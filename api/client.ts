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

// #region agent log (debug-mode)
const __debugIngest = (payload: {
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
}) => {
  try {
    fetch('http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'pre-fix',
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

// リクエストインターセプター（全てのリクエストに対して実行される）
apiClient.interceptors.request.use(
  (config) => {
    // ローカルストレージから認証トークンを取得
    const token = localStorage.getItem('authToken');

    // #region agent log (debug-mode)
    __debugIngest({
      hypothesisId: 'A',
      location: 'api/client.ts:request-interceptor',
      message: 'request prepared',
      data: {
        baseURL: apiClient.defaults.baseURL ?? null,
        method: config.method ?? null,
        url: config.url ?? null,
        hasToken: !!token,
        tokenLen: token ? token.length : 0,
        pathname: typeof window !== 'undefined' ? window.location.pathname : 'no-window',
      },
    });
    // #endregion agent log (debug-mode)

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
    // #region agent log (debug-mode)
    try {
      const url = response?.config?.url ?? null;
      if (url === "/auth/login" || url === "/auth/me") {
        __debugIngest({
          hypothesisId: "E",
          location: "api/client.ts:response-interceptor:success",
          message: "response success",
          data: {
            status: response?.status ?? null,
            url,
            method: response?.config?.method ?? null,
            baseURL: apiClient.defaults.baseURL ?? null,
            requestId:
              response?.headers?.["x-ms-request-id"] ??
              response?.headers?.["x-request-id"] ??
              response?.headers?.["x-correlation-id"] ??
              null,
            server: response?.headers?.["server"] ?? null,
            date: response?.headers?.["date"] ?? null,
            pathname:
              typeof window !== "undefined" ? window.location.pathname : "no-window",
          },
        });
      }
    } catch {}
    // #endregion agent log (debug-mode)

    // 正常レスポンスはそのまま返す
    return response;
  },
  (error) => {
    // #region agent log (debug-mode)
    __debugIngest({
      hypothesisId: 'B',
      location: 'api/client.ts:response-interceptor:error',
      message: 'response error',
      data: {
        status: error?.response?.status ?? null,
        url: error?.config?.url ?? null,
        method: error?.config?.method ?? null,
        baseURL: apiClient.defaults.baseURL ?? null,
        requestId:
          error?.response?.headers?.['x-ms-request-id'] ??
          error?.response?.headers?.['x-request-id'] ??
          error?.response?.headers?.['x-correlation-id'] ??
          null,
        server: error?.response?.headers?.['server'] ?? null,
        date: error?.response?.headers?.['date'] ?? null,
        responseDetail:
          typeof error?.response?.data === 'string'
            ? error.response.data.slice(0, 200)
            : (error?.response?.data?.detail ?? null),
        pathname: typeof window !== 'undefined' ? window.location.pathname : 'no-window',
        isOnLoginPage:
          typeof window !== 'undefined' ? window.location.pathname.includes('/login') : null,
      },
    });
    // #endregion agent log (debug-mode)

    // 401エラー（認証エラー）の場合
    if (error.response?.status === 401) {
      // トークンを削除
      localStorage.removeItem('authToken');

      // 既にログインページにいる場合はリダイレクトしない
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // ログインページにリダイレクト
        window.location.href = '/login';
      }
    }

    // エラーをPromise.rejectで返す
    return Promise.reject(error);
  }
);
