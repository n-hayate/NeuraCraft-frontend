import { useState } from 'react';

interface UseFileDownloadReturn {
  downloadFile: (fileUrl: string, fileName: string) => Promise<void>;
  isDownloading: boolean;
  error: string | null;
}

/**
 * Azure Blob Storageから直接ファイルをダウンロードするカスタムフック
 */
export const useFileDownload = (): UseFileDownloadReturn => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ファイルをダウンロードする関数
   * @param fileUrl - Azure Blob StorageのURL（azure_blob_url）
   * @param fileName - ダウンロード時のファイル名
   */
  const downloadFile = async (fileUrl: string, fileName: string) => {
    setIsDownloading(true);
    setError(null);

    try {
      // Azure Blob StorageのURLから直接ダウンロード
      const link = document.createElement('a');
      link.href = fileUrl;
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
