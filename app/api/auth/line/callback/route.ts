import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  // ถ้า LINE ไม่ส่ง code มา
  if (!code) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // ===== 1) แลก code เป็น access token =====
  const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.LINE_REDIRECT_URI!,
      client_id: process.env.LINE_CLIENT_ID!,
      client_secret: process.env.LINE_CLIENT_SECRET!
    })
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const tokenData = await tokenRes.json()
  const accessToken = tokenData.access_token

  // ===== 2) ดึง profile ผู้ใช้จาก LINE =====
  const profileRes = await fetch('https://api.line.me/v2/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const profile = await profileRes.json()
  /**
   * profile = {
   *   userId,
   *   displayName,
   *   pictureUrl,
   *   statusMessage
   * }
   */

  // ===== 3) set cookie (login สำเร็จ) =====
  const res = NextResponse.redirect(new URL('/dashboard', req.url))

  res.cookies.set('line_user', JSON.stringify({
    userId: profile.userId,
    name: profile.displayName,
    picture: profile.pictureUrl
  }), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 วัน
  })

  return res
}
