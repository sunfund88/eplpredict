// app/page.tsx
import { jwtVerify } from 'jose'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import Link from 'next/link'
import HomeClient from '@/components/HomeClient' // เราจะสร้างคอมโพเนนต์นี้สำหรับ Tab Logic

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
  const [results, pending, leaderboard] = await Promise.all([
    prisma.fixture.findMany({ where: { finished: true }, orderBy: { kickoff: 'desc' } }),
    prisma.fixture.findMany({ where: { finished: false }, orderBy: { kickoff: 'asc' } }),
    prisma.user.findMany({ orderBy: { score: 'desc' }, select: { name: true, image: true, score: true }, take: 50 })
  ])

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header ส่วนบนตามภาพร่าง */}
      <header className="bg-blue-400 p-4 text-center text-white font-bold text-xl">
        Header
      </header>

      {/* ข้อมูล User ส่วนกลาง */}
      <div className="flex flex-col items-center py-6 bg-gray-100">
        <Link href="/userdetail">
          <img 
            src={user.image!} 
            className="w-24 h-24 rounded-full border-4 border-purple-600 mb-2" 
            alt="profile" 
          />
        </Link>
        <p className="font-bold text-lg">{user.name}</p>
        <p className="text-gray-600">Score: {user.score}</p>
      </div>

      {/* ส่วนเนื้อหา 3 Tabs (ส่งข้อมูลไปจัดการต่อที่ Client) */}
      <HomeClient 
        initialData={{ results, pending, leaderboard }} 
        userId={user.id} 
      />
      
      {/* Footer ตามภาพร่าง */}
      <footer className="bg-blue-400 p-4 text-center text-white font-bold mt-auto">
        Footer
      </footer>
    </div>
  )
}