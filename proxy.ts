import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseProxyClient } from '@/lib/supabase/proxy'

const PROTECTED = ['/dashboard', '/leads', '/pipeline', '/settings', '/onboarding']
const AUTH_ONLY  = ['/login', '/register', '/forgot-password']

export default async function proxy(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createSupabaseProxyClient(req, res)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(p + '/'))
  const isAuthOnly  = AUTH_ONLY.some((p)  => path === p || path.startsWith(p + '/'))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isAuthOnly && session) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$).*)'],
}
