import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // สร้าง Response ให้ Redirect ไปที่หน้า Home ('/')
  const res = NextResponse.redirect(new URL('/', req.url))

  // ลบ Cookie โดยตั้งค่า maxAge เป็น 0
  res.cookies.set('user_session', '', {
    path: '/',
    maxAge: 0,
  })

  return res
}