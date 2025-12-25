// @ts-ignore
import { PrismaClient } from '@prisma/client'
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("DIRECT_URL:", process.env.DIRECT_URL);

let prisma: any

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient()
  }
  // @ts-ignore
  prisma = global.prisma
}

export default prisma