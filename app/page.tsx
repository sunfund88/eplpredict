// app/page.tsx
import { jwtVerify } from 'jose'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import Link from 'next/link'
import HomeClient from '@/components/HomeClient'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user_session')?.value
  let userId = null
  let user = null

  // 1. ตรวจสอบ Login
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      userId = payload.userId as string
      
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, image: true, score: true }
      })
    } catch (err) {
      console.error("JWT Invalid:", err)
    }
  }

  // 2. ถ้าไม่ได้ Login ให้แสดงหน้า Login (ตามภาพร่างหน้า Login)
  if (!user) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-200">
        <a
          href="/api/auth/line/"
          className="bg-[#06C755] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg"
        >
          Line Login
        </a>
      </main>
    )
  }

  // 3. ถ้า Login แล้ว ดึงข้อมูลสำหรับ 3 Tabs
  // const [results, pending, leaderboard] = await Promise.all([
  //   prisma.fixture.findMany({ where: { finished: true }, orderBy: { kickoff: 'desc' } }),
  //   prisma.fixture.findMany({ where: { finished: false }, orderBy: { kickoff: 'asc' } }),
  //   prisma.user.findMany({ orderBy: { score: 'desc' }, select: { name: true, image: true, score: true }, take: 50 })
  // ])

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <div className="relative w-[425px] h-[120px] overflow-hidden shadow-md mx-auto">
        
        {/* 1. รูปพื้นหลัง EPL Predict */}
        <img 
          src="/EPL.png" 
          alt="EPL Header" 
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 2. Layer ข้อมูล User ที่วางทับ (ใช้ Flex เพื่อจัดวาง) */}
        <div className="relative z-10 flex items-center h-full px-6 bg-black/10"> 
          
          {/* รูป Profile */}
          <Link href="/userdetail" className="flex-shrink-0">
            <div className="relative w-20 h-20 rounded-full border-2 border-white overflow-hidden shadow-lg">
              <img 
                src={user.image!} 
                className="w-full h-full object-cover" 
                alt="profile" 
              />
            </div>
          </Link>

          {/* ชื่อและคะแนน */}
          <div className="ml-4 text-white drop-shadow-md">
            <h2 className="text-xl font-black italic uppercase leading-none">
              {user.name}
            </h2>
            <div className="mt-1 flex items-center">
              <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm mr-2 uppercase">
                Score
              </span>
              <span className="text-2xl font-bold leading-none">
                {user.score}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ส่วนเนื้อหา 3 Tabs (ส่งข้อมูลไปจัดการต่อที่ Client) */}
      <HomeClient userId={user.id} />
    
    </div>
  )
}