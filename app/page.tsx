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
      lineId: 'Uafe8d8e81d4af1947592d2ae4fc9ac0b',
      image: 'https://scontent.fphs1-1.fna.fbcdn.net/v/t39.30808-6/464993633_122098003922598671_5652212377622387416_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=GPizQ7u5mKQQ7kNvwF2s8sj&_nc_oc=AdmR0ORkso4NNSGYHXjzOhOsWDrDc-LWJla0WEa_jO-uacI3QdWpdYPyIDaVFX0UB8s&_nc_zt=23&_nc_ht=scontent.fphs1-1.fna&_nc_gid=VD6GLUaS46fDTjonhpYHlw&oh=00_AfkiDb3O29UNftbHdtqvefyBqQGgi0cQnJppiWQfyYoKmQ&oe=6959B687'
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* ส่วนเนื้อหา 3 Tabs (ส่งข้อมูลไปจัดการต่อที่ Client) */}
      {user && <HomeClient user={user} />}    
    </div>
  )
}