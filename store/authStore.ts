import { create } from "zustand";
import { AuthState } from "@/types/auth";
import { authApi } from "@/api/auth";

// Zustandでグローバルな認証ストアを作成
// このストアはアプリ全体からアクセス可能
export const useAuthStore = create<AuthState>((set) => ({
  // 初期状態: ログインしていない
  user: null,
  isAuthenticated: false,

  // ログイン関数
  login: async (email: string, password: string) => {
    try {
      // ログイン試行前に古いトークンをクリアする
      localStorage.removeItem("authToken");

      // 実際のAPI呼び出し
      const tokenResponse = await authApi.login({ email, password });

      // トークンをローカルストレージに保存
      localStorage.setItem("authToken", tokenResponse.access_token);

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
