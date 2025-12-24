import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  /* 1️⃣ ขอ access token */
  const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.LINE_CALLBACK_URL!,
      client_id: process.env.LINE_CHANNEL_ID!,
      client_secret: process.env.LINE_CHANNEL_SECRET!,
    }),
  })

  const tokenData = await tokenRes.json()

  if (!tokenData.access_token) {
    return NextResponse.json(tokenData, { status: 400 })
  }

  /* 2️⃣ ขอ profile */
  const profileRes = await fetch('https://api.line.me/v2/profile', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  })

  const profile = await profileRes.json()

  /* 3️⃣ แสดงผล (ทดสอบ) */
  return NextResponse.json({
    userId: profile.userId,
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
  })
}
