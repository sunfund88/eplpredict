import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('user_session')?.value

  // ตรวจสอบเฉพาะ Path ที่ขึ้นต้นด้วย /manage
  if (request.nextUrl.pathname.startsWith('/manage')) {
    if (!token) {
      return NextResponse.redirect(new URL('/api/auth/line', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, secret)

      
        console.log("4. บันทึกสำเร็จ:", payload.role);
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      return NextResponse.next()
    } catch (err) {
      return NextResponse.redirect(new URL('/api/auth/line', request.url))
    }
  }

  return NextResponse.next()
}

// กำหนดให้ Middleware ทำงานเฉพาะกลุ่มหน้า Admin
export const config = {
  matcher: '/manage/:path*',
}