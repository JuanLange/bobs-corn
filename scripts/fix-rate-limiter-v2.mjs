import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixRateLimiterFunction() {
    try {
        // Primero creamos el tipo compuesto
        await prisma.$executeRawUnsafe(`
            DO $$ 
            BEGIN
                DROP TYPE IF EXISTS purchase_result;
                CREATE TYPE purchase_result AS (
                    can_buy boolean,
                    next_available timestamp,
                    total_purchases bigint
                );
            END $$;
        `);

        // Luego creamos la función que retorna este tipo
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE FUNCTION try_buy_corn(p_client_ip TEXT)
            RETURNS purchase_result
            AS $$
            DECLARE
                last_purchase_time TIMESTAMP;
                time_since_last_purchase INTERVAL;
                result purchase_result;
            BEGIN
                -- Obtener la última compra del cliente
                SELECT purchase_time INTO last_purchase_time
                FROM corn_purchases
                WHERE client_ip = p_client_ip
                ORDER BY purchase_time DESC
                LIMIT 1;

                IF last_purchase_time IS NOT NULL THEN
                    time_since_last_purchase := NOW() - last_purchase_time;
                    
                    -- Verificar si ha pasado al menos 1 minuto
                    IF time_since_last_purchase < INTERVAL '1 minute' THEN
                        SELECT 
                            FALSE,
                            last_purchase_time + INTERVAL '1 minute',
                            COUNT(*)::bigint
                        INTO result
                        FROM corn_purchases
                        WHERE client_ip = p_client_ip;
                        
                        RETURN result;
                    END IF;
                END IF;

                -- Si llegamos aquí, podemos hacer la compra
                INSERT INTO corn_purchases (client_ip, purchase_time)
                VALUES (p_client_ip, NOW());

                SELECT 
                    TRUE,
                    NOW() + INTERVAL '1 minute',
                    COUNT(*)::bigint
                INTO result
                FROM corn_purchases
                WHERE client_ip = p_client_ip;

                RETURN result;
            END;
            $$ LANGUAGE plpgsql;
        `);

        console.log('Función de rate limiter actualizada exitosamente');
    } catch (error) {
        console.error('Error al actualizar la función:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixRateLimiterFunction();
