import { NextResponse } from 'next/server'

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINE_CLIENT_ID!,
    redirect_uri: process.env.LINE_REDIRECT_URI!,
    scope: 'profile openid',
    state: 'login'
  })

  return NextResponse.redirect(
    `https://access.line.me/oauth2/v2.1/authorize?${params}`
  )
}
