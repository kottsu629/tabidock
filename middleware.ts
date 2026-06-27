import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // 未ログインで保護ページにアクセス → /login へ
  const protectedPaths = ['/dashboard', '/trips']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ログイン済みで / にアクセス → /dashboard へ
  if (pathname === '/' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // ログイン済みで /login /signup にアクセス → /dashboard へ
  const authPaths = ['/login', '/signup']
  if (authPaths.includes(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard/:path*', '/trips/:path*'],
}
