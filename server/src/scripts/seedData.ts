import { PrismaClient } from '@prisma/client'
import { subDays, subHours, addHours } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // Limpiar registros existentes
  await prisma.cornPurchase.deleteMany()

  // Generar IPs aleatorias
  const ips = [
    '192.168.1.100',
    '192.168.1.101',
    '192.168.1.102',
    '192.168.1.103',
    '192.168.1.104'
  ]

  // Fecha actual
  const now = new Date()

  // Generar compras para los últimos 3 días
  for (let i = 0; i < 3; i++) {
    const day = subDays(now, i)
    
    // Generar entre 5 y 10 compras por día
    const purchasesPerDay = Math.floor(Math.random() * 6) + 5
    
    for (let j = 0; j < purchasesPerDay; j++) {
      const ip = ips[Math.floor(Math.random() * ips.length)]
      const purchaseTime = addHours(subHours(day, Math.floor(Math.random() * 24)), Math.floor(Math.random() * 24))
      
      await prisma.cornPurchase.create({
        data: {
          client_ip: ip,
          purchase_time: purchaseTime
        }
      })
    }
  }

  console.log('Datos de prueba generados exitosamente')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
