import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/', req.url))

  res.cookies.set('line_user', '', {
    path: '/',
    maxAge: 0, // ลบ cookie
  })

  return res
}
