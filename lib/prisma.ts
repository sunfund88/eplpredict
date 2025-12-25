import { PrismaClient } from '@prisma/client'

// กำหนด Type ให้ global object
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // ใส่ไว้ช่วย debug ดูคำสั่ง SQL ได้ (เลือกใส่หรือไม่ก็ได้)
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma