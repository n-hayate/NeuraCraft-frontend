import { apiClient } from './client';

// 認証リクエストの型定義
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

// 認証レスポンスの型定義
export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserRead {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
}

// 認証APIの関数をまとめたオブジェクト
export const authApi = {
  // ログイン
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<Token>('/auth/login', data);
    return response.data;
  },

  // ユーザー登録
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<UserRead>('/auth/register', data);
    return response.data;
  },

  // 現在のユーザー情報取得
  me: async () => {
    const response = await apiClient.get<UserRead>('/auth/me');
    return response.data;
  },
};
