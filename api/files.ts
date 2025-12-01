import { apiClient } from './client';
import { FileRead, DashboardResponse, FileSearchParams, FileSearchResponse } from '@/types/files';

// ファイルAPIの関数をまとめたオブジェクト
export const filesApi = {
  // ダッシュボードデータ取得
  getDashboard: async () => {
    const response = await apiClient.get<DashboardResponse>('/files/dashboard');
    return response.data;
  },

  // 検索機能（フィルター対応）
  search: async (params: FileSearchParams) => {
    const response = await apiClient.get<FileSearchResponse>('/files/search', { params });
    return response.data;
  },

  // 全件取得（ページネーション対応）
  getAll: async (params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get<FileRead[]>('/files/', { params });
    return response.data;
  },

  // 1件取得（IDで指定）
  getById: async (id: string) => {
    const response = await apiClient.get<FileRead>(`/files/${id}`);
    return response.data;
  },

  // 新規登録（ファイルアップロード含む）
  create: async (data: FormData) => {
    const response = await apiClient.post<FileRead>('/files/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',  // ファイルアップロード用
      },
    });
    return response.data;
  },

  // 更新
  update: async (id: string, data: Partial<FileRead>) => {
    const response = await apiClient.put<FileRead>(`/files/${id}`, data);
    return response.data;
  },

  // 削除
  delete: async (id: string) => {
    await apiClient.delete(`/files/${id}`);
  },

  // プレビューURL取得（Office Viewer用）
  getPreviewUrl: async (id: string) => {
    const response = await apiClient.get<{
      preview_url: string;
      expires_at: string;
    }>(`/files/${id}/preview-url`);
    return response.data;
  },
};
