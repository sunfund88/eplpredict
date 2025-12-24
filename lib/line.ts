const LINE_AUTH_URL = 'https://access.line.me/oauth2/v2.1/authorize'
const LINE_TOKEN_URL = 'https://api.line.me/oauth2/v2.1/token'
const LINE_PROFILE_URL = 'https://api.line.me/v2/profile'

export function getLineLoginUrl() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINE_CHANNEL_ID!,
    redirect_uri: process.env.LINE_CALLBACK_URL!,
    state: crypto.randomUUID(),
    scope: 'profile openid',
  })

  return `${LINE_AUTH_URL}?${params.toString()}`
}

export async function getLineProfile(code: string) {
  const tokenRes = await fetch(LINE_TOKEN_URL, {
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

  const token = await tokenRes.json()

  const profileRes = await fetch(LINE_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  })

  return profileRes.json()
}
