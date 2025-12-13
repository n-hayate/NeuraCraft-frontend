import { create } from "zustand";
import { AuthState } from "@/types/auth";
import { authApi } from "@/api/auth";

// #region agent log (debug-mode)
const __debugIngest = (payload: {
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
}) => {
  try {
    fetch("http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: payload.hypothesisId,
        location: payload.location,
        message: payload.message,
        data: payload.data ?? {},
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  } catch {}
};
// #endregion agent log (debug-mode)

// Zustandでグローバルな認証ストアを作成
// このストアはアプリ全体からアクセス可能
export const useAuthStore = create<AuthState>((set) => ({
  // 初期状態: ログインしていない
  user: null,
  isAuthenticated: false,

  // ログイン関数
  login: async (email: string, password: string) => {
    try {
      // #region agent log (debug-mode)
      __debugIngest({
        hypothesisId: "A",
        location: "store/authStore.ts:login:entry",
        message: "login() called",
        data: {
          emailDomain:
            typeof email === "string" && email.includes("@")
              ? email.split("@")[1]
              : null,
          emailLen: typeof email === "string" ? email.length : null,
          passwordLen: typeof password === "string" ? password.length : null,
          pathname:
            typeof window !== "undefined"
              ? window.location.pathname
              : "no-window",
          hasAuthTokenBeforeClear:
            typeof window !== "undefined"
              ? !!localStorage.getItem("authToken")
              : null,
          hasCookieIsAuthenticated:
            typeof document !== "undefined"
              ? /(^|;\s*)isAuthenticated=true(\s*;|$)/.test(document.cookie)
              : null,
        },
      });
      // #endregion agent log (debug-mode)

      // ログイン試行前に古いトークンをクリアする
      localStorage.removeItem("authToken");

      // 実際のAPI呼び出し
      const tokenResponse = await authApi.login({ email, password });

      // トークンをローカルストレージに保存
      localStorage.setItem("authToken", tokenResponse.access_token);

      // #region agent log (debug-mode)
      __debugIngest({
        hypothesisId: "B",
        location: "store/authStore.ts:login:token-set",
        message: "token saved; calling /auth/me next",
        data: {
          hasAuthTokenAfterSet:
            typeof window !== "undefined"
              ? !!localStorage.getItem("authToken")
              : null,
          tokenType: (tokenResponse as any)?.token_type ?? "unknown",
        },
      });
      // #endregion agent log (debug-mode)

      // ユーザー情報を取得
      const userResponse = await authApi.me();

      // ログイン成功: ユーザー情報をストアに保存
      set({
        user: {
          id: userResponse.id,
          email: userResponse.email,
          name: userResponse.full_name || userResponse.email,
          role: "user", // バックエンドにroleがない場合はデフォルト値
        },
        isAuthenticated: true,
      });

      // クッキーに認証状態を保存（ミドルウェアで使用）
      document.cookie = "isAuthenticated=true; path=/; max-age=86400"; // 24時間有効
    } catch (error) {
      // #region agent log (debug-mode)
      const errAny: any = error;
      __debugIngest({
        hypothesisId: "C",
        location: "store/authStore.ts:login:catch",
        message: "login() failed",
        data: {
          errorName: errAny?.name ?? null,
          errorMessage: errAny?.message ?? null,
          axiosStatus: errAny?.response?.status ?? null,
          axiosUrl: errAny?.config?.url ?? null,
          axiosDetail:
            typeof errAny?.response?.data === "string"
              ? errAny.response.data.slice(0, 200)
              : errAny?.response?.data?.detail ?? null,
          pathname:
            typeof window !== "undefined"
              ? window.location.pathname
              : "no-window",
          hasAuthTokenNow:
            typeof window !== "undefined"
              ? !!localStorage.getItem("authToken")
              : null,
        },
      });
      // #endregion agent log (debug-mode)

      // ログイン失敗: エラーをスロー
      console.error("Login failed:", error);
      throw new Error(
        "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
      );
    }
  },

  // ログアウト関数
  logout: () => {
    // トークンを削除
    localStorage.removeItem("authToken");

    // ユーザー情報をクリアして未認証状態に戻す
    set({ user: null, isAuthenticated: false });

    // クッキーから認証状態を削除
    document.cookie = "isAuthenticated=; path=/; max-age=0";
  },
}));
