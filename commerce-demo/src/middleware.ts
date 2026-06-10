import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/admin')) {
    const signin = new URL('/signin', req.url)
    signin.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(signin)
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
