import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma' // ดึงมาจากไฟล์ prisma.ts ที่คุณแนบมา

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) return NextResponse.redirect(new URL('/', req.url))

  try {
    /* 1. แลก Access Token จาก LINE */
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

    /* 2. ดึง Profile จาก LINE */
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const profile = await profileRes.json()

    /* 3. บันทึกลง Supabase ผ่าน Prisma (Upsert) */
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

    /* 4. Redirect และเก็บข้อมูลใน Cookie */
    const res = NextResponse.redirect(new URL('/', req.url))

    // แนะนำ: เก็บเฉพาะ id (UUID) ที่มาจาก database ของเราเอง
    res.cookies.set('user_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 วัน
    })

    return res
  } catch (error) {
    console.error('Auth Error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url))
  }
}