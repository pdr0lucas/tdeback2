// middleware.js ou src/middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Token de autenticação não fornecido' }, { status: 401 });
  }

  try {
    // Verifica o token
    await jwtVerify(token, SECRET_KEY);
    // Se o token for válido, a requisição continua
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
  }
}

// Configuração para definir quais rotas serão protegidas pelo middleware
export const config = {
  matcher: [
    // '/api/usuarios/campeonatos/:path*', // ROTA COMENTADA/REMOVIDA
    '/api/inscricoes/:path*',
    '/api/times/:path*',
    '/api/jogador/:path*',
    // Adicione aqui outras rotas que precisam de autenticação
  ],
};