import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LiffProvider from '@/components/LiffProvider'

export default async function Home() {
  // 1. ดึง user_session จาก cookies
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_session')?.value

  let user = null

  // 2. ถ้ามี userId ให้ไปหาข้อมูลในฐานข้อมูล (Supabase)
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image:true, score: true } // เลือกเฉพาะที่ต้องใช้ 
    })
  }

  return (
    <main style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '20px' }}>
      <LiffProvider />
      {user ? (
        // กรณีมี Session: แสดงชื่อ คะแนน และปุ่ม Logout
        <div style={{ textAlign: 'center' }}>
          <div>
            <img src={user.image!}
            alt="profile"
            width={120}
            style={{ borderRadius: '50%' }}
          />
          </div>
          
          <h1 style={{ marginBottom: '8px' }}>สวัสดีคุณ {user.name}</h1>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>
            คะแนนของคุณ: <strong>{user.score}</strong> แต้ม
          </p>
          <div style={{ marginTop: '24px' }}>
            <Link
              href="/dashboard"
              style={{ marginRight: '15px', color: '#0070f3', textDecoration: 'none' }}
            >
              ไปหน้าทายผล
            </Link>
            <a
              href="/logout"
              style={{
                background: '#ff4d4f',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Logout
            </a>
          </div>
        </div>
      ) : (
        // กรณีไม่มี Session: แสดงปุ่ม Login
        <a
          href="/api/auth/line/"
          style={{
            background: '#06C755',
            color: '#fff',
            padding: '14px 24px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Login with LINE
        </a>
      )}
    </main>
  )
}