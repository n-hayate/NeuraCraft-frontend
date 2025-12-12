import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 保護されたルートの一覧
const protectedRoutes = ["/search", "/search-poc", "/register", "/admin"];

// モバイルデバイスを検出する関数
function isMobileDevice(userAgent: string): boolean {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";
  const isMobile = isMobileDevice(userAgent);

  // モバイルデバイスからのアクセスの場合
  if (isMobile) {
    // ログインページとモバイル専用ページは許可
    if (pathname === "/login" || pathname.startsWith("/mobile/")) {
      // モバイル専用ページへのアクセスは認証チェック
      if (pathname.startsWith("/mobile/")) {
        const isAuthenticated =
          request.cookies.get("isAuthenticated")?.value === "true";
        if (!isAuthenticated) {
          const url = request.nextUrl.clone();
          url.pathname = "/login";
          return NextResponse.redirect(url);
        }
      }
      return NextResponse.next();
    }

    // モバイルからは検索以外のページにアクセスできない
    // デスクトップ専用ページ（/search, /register, /admin, /playgroundなど）へのアクセスをブロック
    if (
      pathname.startsWith("/search") ||
      pathname.startsWith("/search-poc") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/playground")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/mobile/search";
      return NextResponse.redirect(url);
    }

    // その他のページもモバイル検索ページにリダイレクト
    if (pathname !== "/" && pathname !== "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/mobile/search";
      return NextResponse.redirect(url);
    }
  }

  // デスクトップからのアクセスの場合
  // 保護されたルートへのアクセスかチェック
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // 認証状態をクッキーまたはセッションから確認
    const isAuthenticated =
      request.cookies.get("isAuthenticated")?.value === "true";

    if (!isAuthenticated) {
      // 未認証の場合、ログインページにリダイレクト
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // デスクトップからモバイル専用ページにアクセスしようとした場合、検索ページにリダイレクト
  if (!isMobile && pathname.startsWith("/mobile/")) {
    const url = request.nextUrl.clone();
    url.pathname = "/search";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
