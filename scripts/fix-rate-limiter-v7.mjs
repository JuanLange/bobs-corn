import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixRateLimiterFunction() {
    try {
        // Primero eliminamos la función existente
        await prisma.$executeRawUnsafe(`
            DROP FUNCTION IF EXISTS try_buy_corn(text);
        `);

        await prisma.$executeRawUnsafe(`
            DROP TYPE IF EXISTS purchase_result CASCADE;
        `);

        // Creamos el tipo compuesto
        await prisma.$executeRawUnsafe(`
            CREATE TYPE purchase_result AS (
                can_buy boolean,
                next_available timestamp,
                total_purchases bigint
            );
        `);

        // Creamos la función que retorna este tipo
        await prisma.$executeRawUnsafe(`
            CREATE OR REPLACE FUNCTION try_buy_corn(p_client_ip TEXT)
            RETURNS purchase_result
            AS $$
            DECLARE
                last_purchase_time TIMESTAMP;
                time_since_last_purchase INTERVAL;
                result purchase_result;
                current_count bigint;
                current_time TIMESTAMP;
            BEGIN
                current_time := NOW();
                
                -- Obtener la última compra del cliente
                SELECT purchase_time INTO last_purchase_time
                FROM corn_purchases
                WHERE client_ip = p_client_ip
                ORDER BY purchase_time DESC
                LIMIT 1;

                -- Obtener el conteo actual
                SELECT COUNT(*)::bigint INTO current_count
                FROM corn_purchases
                WHERE client_ip = p_client_ip;

                IF last_purchase_time IS NOT NULL THEN
                    time_since_last_purchase := current_time - last_purchase_time;
                    
                    -- Verificar si ha pasado al menos 1 minuto
                    IF time_since_last_purchase < INTERVAL '1 minute' THEN
                        -- No puede comprar aún
                        result.can_buy := FALSE;
                        result.next_available := last_purchase_time + INTERVAL '1 minute';
                        result.total_purchases := current_count;
                        RETURN result;
                    END IF;
                END IF;

                -- Si llegamos aquí, podemos hacer la compra
                INSERT INTO corn_purchases (client_ip, purchase_time)
                VALUES (p_client_ip, current_time);

                -- En compra exitosa, no enviamos next_available
                result.can_buy := TRUE;
                result.next_available := NULL;
                result.total_purchases := current_count + 1;

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
