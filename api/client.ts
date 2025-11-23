import axios from 'axios';

// Axiosインスタンスを作成（共通設定を持つ）
export const apiClient = axios.create({
  // 環境変数からAPIのベースURLを取得
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,  // タイムアウト時間（10秒）
  headers: {
    'Content-Type': 'application/json',  // デフォルトのコンテンツタイプ
  },
});

// リクエストインターセプター（全てのリクエストに対して実行される）
apiClient.interceptors.request.use(
  (config) => {
    // ローカルストレージから認証トークンを取得
    const token = localStorage.getItem('authToken');

    // トークンが存在する場合、Authorizationヘッダーに追加
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // リクエストエラー時の処理
    return Promise.reject(error);
  }
);

// レスポンスインターセプター（全てのレスポンスに対して実行される）
apiClient.interceptors.response.use(
  (response) => {
    // 正常レスポンスはそのまま返す
    return response;
  },
  (error) => {
    // 401エラー（認証エラー）の場合
    if (error.response?.status === 401) {
      // トークンを削除
      localStorage.removeItem('authToken');
      // ログインページにリダイレクト
      window.location.href = '/login';
    }

    // エラーをPromise.rejectで返す
    return Promise.reject(error);
  }
);
