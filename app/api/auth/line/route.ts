import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.LINE_CHANNEL_ID
  const redirectUri = process.env.LINE_CALLBACK_URL

  if (!clientId || !redirectUri) {
    return NextResponse.json({
      error: 'ENV missing',
      clientId,
      redirectUri
    }, { status: 500 })
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'profile openid',
    state: 'login'
  })

  return NextResponse.redirect(
    `https://access.line.me/oauth2/v2.1/authorize?${params}`
  )
}
