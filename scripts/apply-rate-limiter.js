const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function applyRateLimiterFunction() {
    try {
        const sql = `
        CREATE OR REPLACE FUNCTION try_buy_corn(p_client_ip TEXT)
        RETURNS TABLE (
            can_buy BOOLEAN,
            next_available TIMESTAMP,
            total_purchases BIGINT
        ) AS $$
        DECLARE
            last_purchase_time TIMESTAMP;
            time_since_last_purchase INTERVAL;
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
                    RETURN QUERY
                    SELECT 
                        FALSE,
                        last_purchase_time + INTERVAL '1 minute',
                        COUNT(*)::BIGINT
                    FROM corn_purchases
                    WHERE client_ip = p_client_ip;
                    RETURN;
                END IF;
            END IF;

            -- Si llegamos aquí, podemos hacer la compra
            INSERT INTO corn_purchases (client_ip, purchase_time)
            VALUES (p_client_ip, NOW());

            RETURN QUERY
            SELECT 
                TRUE,
                NOW() + INTERVAL '1 minute',
                COUNT(*)::BIGINT
            FROM corn_purchases
            WHERE client_ip = p_client_ip;
        END;
        $$ LANGUAGE plpgsql;
        `;

        await prisma.$executeRawUnsafe(sql);
        console.log('Función de rate limiter creada exitosamente');
    } catch (error) {
        console.error('Error al crear la función:', error);
    } finally {
        await prisma.$disconnect();
    }
}

applyRateLimiterFunction();
