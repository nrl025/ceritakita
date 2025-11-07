import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const publicPaths = ['/login', '/register', '/', '/cerita', '/tentang', '/jurnal', '/edukasi'];
const authPaths = ['/login', '/register'];

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.some(p => path.startsWith(p)) && !authPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and trying to access protected routes
  if (!token && !publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to beranda if already logged in and trying to access auth pages
  if (token && authPaths.some(p => path.startsWith(p))) {
    return NextResponse.redirect(new URL('/beranda', request.url));
  }

  if (token) {
    try {
      verifyToken(token);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
