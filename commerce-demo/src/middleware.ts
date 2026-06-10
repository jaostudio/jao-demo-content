import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  if (!token && req.nextUrl.pathname.startsWith('/admin')) {
    const signin = new URL('/signin', req.url)
    signin.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(signin)
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
