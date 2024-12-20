import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BuyResult {
    can_buy: boolean;
    next_available: Date | null;
    total_purchases: bigint;
}

export const buyCorn = async (req: Request, res: Response) => {
    const clientIp = req.ip || "unknown";

    try {
        // Llamar a la función SQL que maneja el rate limiting
        const result = await prisma.$queryRaw<BuyResult[]>`
            SELECT (try_buy_corn(${clientIp})).*;
        `;

        const { can_buy, next_available, total_purchases } = result[0];
        console.log('Resultado de try_buy_corn:', result[0]); // Para debugging

        if (!can_buy) {
            return res.status(429).json({
                message: 'You must wait before buying more corn',
                nextAvailable: next_available,
                totalPurchases: Number(total_purchases)
            });
        }

        // Solo enviamos nextAvailable si la compra fue exitosa Y next_available no es null
        const response = {
            message: 'Purchase successful! 🌽',
            totalPurchases: Number(total_purchases)
        };

        res.json(response);

    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ message: 'Error al procesar la compra' });
    }
};

export const getPurchaseHistory = async (req: Request, res: Response) => {
    try {
        console.log('Getting purchase history...');

        // Obtener el resumen de compras por IP con la última fecha de compra
        const purchases = await prisma.$queryRaw`
            WITH purchase_summary AS (
                SELECT 
                    client_ip,
                    COUNT(*) as total_count,
                    MAX(timezone('America/Argentina/Buenos_Aires', purchase_time)) as last_purchase_time
                FROM corn_purchases
                GROUP BY client_ip
            )
            SELECT 
                client_ip,
                CAST(total_count AS INTEGER) as total_purchases,
                last_purchase_time as purchase_time
            FROM purchase_summary
            ORDER BY last_purchase_time DESC
        `;

        // Obtener compras por día (últimos 7 días)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyPurchases = await prisma.$queryRaw`
            SELECT 
                date_trunc('day', timezone('America/Argentina/Buenos_Aires', purchase_time)) as date,
                CAST(COUNT(*) AS INTEGER) as total
            FROM corn_purchases
            WHERE purchase_time >= ${sevenDaysAgo}
            GROUP BY date_trunc('day', timezone('America/Argentina/Buenos_Aires', purchase_time))
            ORDER BY date DESC
        `;
        console.log('Daily purchases:', dailyPurchases);

        // Formatear la respuesta
        const formattedPurchases = purchases.map(purchase => ({
            client_ip: purchase.client_ip,
            total_purchases: purchase.total_purchases,
            last_purchase: purchase.purchase_time.toISOString()
        }));

        res.json({
            history: formattedPurchases,
            dailyPurchases: dailyPurchases.map(p => ({
                date: p.date.toISOString(),
                total: p.total
            }))
        });
    } catch (error) {
        console.error('Error getting purchase history:', error);
        res.status(500).json({ 
            message: 'Error getting purchase history',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
