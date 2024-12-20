import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Limpiar la base de datos
    await prisma.cornPurchase.deleteMany();

    // Generar IPs aleatorias
    const ips = Array.from({ length: 10 }, (_, i) => 
        `192.168.1.${100 + i}`
    );

    // Fecha actual
    const now = new Date();
    // Fecha hace 7 días
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Generar compras aleatorias para los últimos 7 días
    const purchases = [];
    for (let ip of ips) {
        // Cada IP hace entre 5 y 15 compras
        const numPurchases = Math.floor(Math.random() * 10) + 5;
        
        for (let i = 0; i < numPurchases; i++) {
            // Generar fecha aleatoria entre hace 7 días y ahora
            const randomTime = sevenDaysAgo.getTime() + 
                Math.random() * (now.getTime() - sevenDaysAgo.getTime());
            
            purchases.push({
                client_ip: ip,
                purchase_time: new Date(randomTime)
            });
        }
    }

    // Ordenar compras por fecha
    purchases.sort((a, b) => a.purchase_time.getTime() - b.purchase_time.getTime());

    // Insertar compras
    console.log('Insertando', purchases.length, 'compras...');
    for (const purchase of purchases) {
        await prisma.cornPurchase.create({
            data: purchase
        });
    }
    console.log('Datos de prueba insertados correctamente');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
