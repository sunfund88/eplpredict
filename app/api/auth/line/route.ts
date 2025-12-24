import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.LINE_CLIENT_ID
  const redirectUri = process.env.LINE_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json({
      error: 'ENV missing',
      clientId,
      redirectUri
    }, { status: 500 })
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId, // ต้องเป็น 2008765764
    redirect_uri: redirectUri,
    scope: 'profile openid',
    state: 'login'
  })

  return NextResponse.redirect(
    `https://access.line.me/oauth2/v2.1/authorize?${params}`
  )
}
