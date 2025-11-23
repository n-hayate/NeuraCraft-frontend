import { useState } from 'react';
import { filesApi } from '@/api/files';
import { FileRead } from '@/types/files';

// カスタムフック（use〜で始まる名前）
export const useFiles = () => {
  // ファイルリスト
  const [files, setFiles] = useState<FileRead[]>([]);

  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  // エラーメッセージ
  const [error, setError] = useState<string | null>(null);

  // 全件取得
  const fetchAll = async (params?: { limit?: number; offset?: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await filesApi.getAll(params);
      setFiles(results);
    } catch (err) {
      setError('ファイルの取得に失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1件削除
  const deleteFile = async (id: string) => {
    try {
      await filesApi.delete(id);
      // 削除後、リストから除外
      setFiles((prev) => prev.filter((file) => file.id !== id));
    } catch (err) {
      setError('ファイルの削除に失敗しました');
      console.error(err);
    }
  };

  // 状態と関数を返す
  return { files, isLoading, error, fetchAll, deleteFile };
};
