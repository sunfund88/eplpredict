import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLineProfile } from '@/lib/line'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const profile = await getLineProfile(code)

  const user = await prisma.user.upsert({
    where: { lineId: profile.userId },
    update: {
      name: profile.displayName,
      image: profile.pictureUrl,
    },
    create: {
      lineId: profile.userId,
      name: profile.displayName,
      image: profile.pictureUrl,
    },
  })

  // 👉 simple session (demo)
  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set('userId', user.id, {
    httpOnly: true,
    path: '/',
  })

  return res
}
