import AuthService from './auth/auth.service';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

const publicRoutes = ['/auth/sign-in', '/auth/sign-up'];
const apiPublicRoutes = ['/api/admin/auth-admin', '/api/admin/create-admin'];
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

 // Permitir acesso às rotas publicas da aplicação
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

   // Permitir acesso às rotas públicas da API
   if (apiPublicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

    const session = await AuthService.isSessionValid(req);
 
    if (!session) {
      const isAPIRoute = pathname.startsWith('/api');
      if (isAPIRoute) {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }

    return NextResponse.next();
  
}
