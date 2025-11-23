import { create } from 'zustand';
import { AuthState } from '@/types/auth';

// Zustandでグローバルな認証ストアを作成
// このストアはアプリ全体からアクセス可能
export const useAuthStore = create<AuthState>((set) => ({
  // 初期状態: ログインしていない
  user: null,
  isAuthenticated: false,

  // ログイン関数
  login: async (email: string, password: string) => {
    // TODO: 実際のAPI呼び出しに置き換える
    // 仮のログイン処理（開発用）
    // 1秒待機してAPIコールをシミュレート
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // デモ用の認証チェック
    if (email === 'admin@example.com' && password === 'password') {
      // ログイン成功: ユーザー情報をストアに保存
      set({
        user: {
          id: '1',
          email: 'admin@example.com',
          name: '管理者',
          role: 'admin',
        },
        isAuthenticated: true,
      });

      // クッキーに認証状態を保存（ミドルウェアで使用）
      document.cookie = 'isAuthenticated=true; path=/; max-age=86400'; // 24時間有効
    } else {
      // ログイン失敗: エラーをスロー
      throw new Error('Invalid credentials');
    }
  },

  // ログアウト関数
  logout: () => {
    // ユーザー情報をクリアして未認証状態に戻す
    set({ user: null, isAuthenticated: false });

    // クッキーから認証状態を削除
    document.cookie = 'isAuthenticated=; path=/; max-age=0';
  },
}));
