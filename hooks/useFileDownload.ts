import { useState } from 'react';
import { filesApi } from '@/api/files';

interface UseFileDownloadReturn {
  downloadFile: (fileId: string, fileName: string) => Promise<void>;
  isDownloading: boolean;
  error: string | null;
}

/**
 * バックエンドAPIを使用してファイルをダウンロードするカスタムフック
 */
export const useFileDownload = (): UseFileDownloadReturn => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ファイルをダウンロードする関数
   * @param fileId - ファイルID
   * @param fileName - ダウンロード時のファイル名
   */
  const downloadFile = async (fileId: string, fileName: string) => {
    setIsDownloading(true);
    setError(null);

    try {
      // バックエンドからダウンロードURLを取得
      const { download_url } = await filesApi.getDownloadUrl(fileId);

      // 取得したURLを使用してダウンロード
      const link = document.createElement('a');
      link.href = download_url;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Download error:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : 'ダウンロード中にエラーが発生しました';
      setError(errorMessage);
    } finally {
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
