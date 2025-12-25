import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) return NextResponse.redirect(new URL('/', req.url))

  try {
    console.log("1. เริ่มดึง Token ด้วย code:", code);    
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINE_CALLBACK_URL!,
        client_id: process.env.LINE_CHANNEL_ID!,
        client_secret: process.env.LINE_CHANNEL_SECRET!,
      }),
    })
    const tokenData = await tokenRes.json()

    console.log("2. ดึง Profile ด้วย Token");    
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const profile = await profileRes.json()

    console.log("3. กำลังบันทึกข้อมูลลง Database:", profile.userId);
    const user = await prisma.user.upsert({
      where: { lineId: profile.userId }, // อ้างอิงจาก lineId @unique ใน schema
      update: {
        name: profile.displayName,
        image: profile.pictureUrl,
      },
      create: {
        lineId: profile.userId,
        name: profile.displayName,
        image: profile.pictureUrl,
        role: 'USER', // ค่า default ตาม enum Role
      },
    })

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const token = await new SignJWT({ userId: user.id }) // เก็บ user.id ไว้ข้างใน
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d') // หมดอายุใน 7 วัน
      .sign(secret)

    console.log("4. บันทึกสำเร็จ:", user.id);
    const res = NextResponse.redirect(new URL('/', req.url))
    res.cookies.set('user_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 7 วัน
    })

    return res
  } catch (error) {
    console.error('Auth Error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url))
  }
}