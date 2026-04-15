import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Proteger qualquer rota abaixo de /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token');

    if (!token) {
      // Se não houver cookie, redireciona para o login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirecionar usuário logado da raiz ou /login para o admin (se tiver token)
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login') {
    const token = request.cookies.get('token');
    if (token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Rodar o middleware para todas as rotas primárias
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
