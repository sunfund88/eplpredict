// app/page.tsx
import { jwtVerify } from 'jose'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import HomeClient from '@/components/HomeClient'

interface UserProfile {
  id: string;
  name: string;
  lineId: string;
  image: string | null;
  score: number;
}

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value
  let userId = null
  let user: UserProfile | null = null;

  const test_mode = true
  const currentEnv = process.env.VERCEL_ENV;

  if (currentEnv === 'production') {
    // ทำเฉพาะบนหน้าเว็บจริง เช่น ต่อ Database ตัวจริง, เก็บ Analytics
    // 1. ตรวจสอบ Login
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)
        userId = payload.userId as string
        
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, lineId:true, name: true, image: true, score: true }
        })
      } catch (err) {
        console.error("JWT Invalid:", err)
      }
    }

    // 2. ถ้าไม่ได้ Login ให้แสดงหน้า Login (ตามภาพร่างหน้า Login)
    if (!user) {
      return (
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          <div className="flex items-center justify-center h-screen">
            <a
              href="/api/auth/line/"
              className="bg-[#06C755] text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg"
            >
              Line Login
            </a>
          </div>
        </div>
      )
    }
  } else if (currentEnv === 'preview' || !currentEnv) {
    // ทำเฉพาะตอนทดสอบบน Branch อื่น เช่น ใช้ Database สำหรับ Test
    user = {
      id: '513d2c62-cbeb-4e1e-bb15-92deea7dbb83',
      name: 'Test User',
      score: 0,
      lineId: 'test-line-id',
      image: 'https://via.placeholder.com/150'
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* ส่วนเนื้อหา 3 Tabs (ส่งข้อมูลไปจัดการต่อที่ Client) */}
      {user && <HomeClient user={user} />}    
    </div>
  )
}