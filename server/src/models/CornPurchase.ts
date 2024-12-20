import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ICornPurchase {
    id?: number;
    client_ip: string;
    purchase_time?: Date;
    success?: boolean;
}

interface IPurchaseHistory {
    client_ip: string;
    total_purchases: number;
    last_purchase: Date;
}

interface IDailyPurchases {
    date: string;
    total: number;
}

class CornPurchase {
    // Verificar si un cliente puede hacer una compra
    static async canPurchase(clientIp: string): Promise<{ canPurchase: boolean; nextAvailable?: Date }> {
        try {
            console.log('Verificando límite de compra para IP:', clientIp);
            const lastPurchase = await prisma.cornPurchase.findFirst({
                where: {
                    client_ip: clientIp,
                    success: true
                },
                orderBy: {
                    purchase_time: 'desc'
                }
            });

            if (!lastPurchase) {
                return { canPurchase: true };
            }

            const lastPurchaseTime = lastPurchase.purchase_time;
            const nextAvailable = new Date(lastPurchaseTime.getTime() + 60000);
            const now = new Date();

            return {
                canPurchase: nextAvailable <= now,
                nextAvailable
            };
        } catch (error) {
            console.error('Error en canPurchase:', error);
            throw error;
        }
    }

    // Crear un nuevo registro de compra
    static async create(clientIp: string): Promise<ICornPurchase> {
        try {
            console.log('Creando compra para IP:', clientIp);
            const result = await prisma.cornPurchase.create({
                data: {
                    client_ip: clientIp
                }
            });
            console.log('Resultado de la creación:', result);
            return result;
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    // Obtener historial de compras agrupado por IP
    static async getHistory(): Promise<IPurchaseHistory[]> {
        try {
            console.log('Obteniendo historial de compras');
            const result = await prisma.cornPurchase.groupBy({
                by: ['client_ip'],
                where: {
                    success: true
                },
                _count: {
                    _all: true
                },
                _max: {
                    purchase_time: true
                }
            });
            console.log('Resultado del historial:', result);
            return result.map((item) => ({
                client_ip: item.client_ip,
                total_purchases: item._count._all,
                last_purchase: item._max.purchase_time
            }));
        } catch (error) {
            console.error('Error en getHistory:', error);
            throw error;
        }
    }

    // Obtener compras diarias
    static async getDailyPurchases(): Promise<IDailyPurchases[]> {
        try {
            console.log('Obteniendo compras diarias');
            const result = await prisma.cornPurchase.groupBy({
                by: ['date'],
                where: {
                    success: true
                },
                _count: {
                    _all: true
                }
            });
            console.log('Resultado de compras diarias:', result);
            return result.map((item) => ({
                date: item.date,
                total: item._count._all
            }));
        } catch (error) {
            console.error('Error en getDailyPurchases:', error);
            throw error;
        }
    }

    // Obtener total de compras para un cliente
    static async getClientPurchases(clientIp: string): Promise<number> {
        try {
            console.log('Obteniendo total de compras para IP:', clientIp);
            const result = await prisma.cornPurchase.count({
                where: {
                    client_ip: clientIp,
                    success: true
                }
            });
            console.log('Total de compras:', result);
            return result;
        } catch (error) {
            console.error('Error en getClientPurchases:', error);
            throw error;
        }
    }
}

export default CornPurchase;
export type { ICornPurchase, IPurchaseHistory, IDailyPurchases };
