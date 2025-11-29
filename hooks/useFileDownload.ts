import { useState } from 'react';
import { filesApi } from '@/api/files';

// カスタムフックの返り値の型定義
interface UseFileDownloadReturn {
  downloadFile: (fileId: string, fileName: string) => Promise<void>;
  isDownloading: boolean;
  error: string | null;
}

/**
 * ファイルダウンロード機能を提供するカスタムフック
 */
export const useFileDownload = (): UseFileDownloadReturn => {
  // ダウンロード中かどうかの状態
  const [isDownloading, setIsDownloading] = useState(false);

  // エラーメッセージの状態
  const [error, setError] = useState<string | null>(null);

  /**
   * ファイルをダウンロードする関数
   * @param fileId - ダウンロードするファイルのID
   * @param fileName - ダウンロード時のファイル名
   */
  const downloadFile = async (fileId: string, fileName: string) => {
    // ローディング開始、エラーをクリア
    setIsDownloading(true);
    setError(null);

    try {
      // 1. バックエンドAPIからダウンロードURLを取得
      const { download_url } = await filesApi.getDownloadUrl(fileId);

      // 2. 仮想的なaタグを作成してダウンロード
      // Azure Blob StorageのURLは署名付きURLなので直接ダウンロード可能
      const link = document.createElement('a');
      link.href = download_url;
      link.download = fileName;  // ダウンロード時のファイル名を指定
      link.target = '_blank';    // 新しいタブで開く（ダウンロードできない場合のフォールバック）
      link.rel = 'noopener noreferrer';  // セキュリティ対策
      document.body.appendChild(link);
      link.click();  // プログラムでクリックを実行

      // 3. 後片付け: aタグを削除
      document.body.removeChild(link);

    } catch (err) {
      // エラー処理
      console.error('Download error:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : 'ダウンロード中にエラーが発生しました';
      setError(errorMessage);
    } finally {
      // ローディング終了（少し遅延させてユーザーにフィードバック）
      setTimeout(() => {
        setIsDownloading(false);
      }, 500);
    }
  };

  return {
    downloadFile,
    isDownloading,
    error,
  };
};
