import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 保護されたルートの一覧
const protectedRoutes = ['/search', '/register', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 保護されたルートへのアクセスかチェック
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // 認証状態をクッキーまたはセッションから確認
    // この例では簡易的にクッキーで判定
    const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';

    if (!isAuthenticated) {
      // 未認証の場合、ログインページにリダイレクト
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
