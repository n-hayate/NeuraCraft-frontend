// ログインフォームのデータ構造を定義
export interface LoginFormData {
  email: string;      // ユーザーのメールアドレス
  password: string;   // ユーザーのパスワード
}

// ユーザー情報の構造を定義
export interface User {
  id: string;         // ユーザーの一意な識別子
  email: string;      // メールアドレス
  name: string;       // ユーザー名
  role: 'admin' | 'user';  // 権限（管理者 or 一般ユーザー）
}

// 認証状態の構造を定義
export interface AuthState {
  user: User | null;           // ログイン中のユーザー情報（未ログイン時はnull）
  isAuthenticated: boolean;    // ログイン状態のフラグ
  login: (email: string, password: string) => Promise<void>;  // ログイン関数
  logout: () => void;          // ログアウト関数
}
