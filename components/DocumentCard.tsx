'use client';

import { Download, Eye } from 'lucide-react';
import { KnowledgeDocument } from '@/types/knowledge';
import { useFileDownload } from '@/hooks/useFileDownload';
import { filesApi } from '@/api/files';
import { useState } from 'react';

// 親コンポーネントから受け取るPropsの型定義
interface DocumentCardProps {
  document: KnowledgeDocument;  // 表示するドキュメントのデータ
}

// ドキュメントタイプごとのアイコン
const documentIcons = {
  pdf: '📄',
  word: '📝',
  excel: '📊',
  powerpoint: '📊',
};

// タグの色分け定義
const tagColors = {
  finalProduct: 'bg-green-100 text-green-800',
  issue: 'bg-orange-100 text-orange-800',
  ingredient: 'bg-blue-100 text-blue-800',
  customer: 'bg-purple-100 text-purple-800',
  author: 'bg-gray-100 text-gray-800',
};

export const DocumentCard = ({ document }: DocumentCardProps) => {
  // カスタムフックを使用してダウンロード機能を取得
  const { downloadFile, isDownloading, error } = useFileDownload();
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  /**
   * ダウンロードボタンクリック時の処理
   */
  const handleDownload = async () => {
    // Azure Blob URLを直接使用
    await downloadFile(document.fileUrl, document.title);
  };

  /**
   * プレビューボタンクリック時の処理
   */
  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      // バックエンドからプレビューURLを取得
      const { preview_url } = await filesApi.getPreviewUrl(document.id);

      // 新しいタブでOffice Viewerを開く
      window.open(preview_url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Preview error:', err);
      alert('プレビューの表示に失敗しました');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // PDFとOfficeファイルのみプレビュー可能
  const canPreview = ['pdf', 'word', 'excel', 'powerpoint'].includes(document.type);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* 左側: ドキュメント情報 */}
        <div className="flex-1">
          {/* ドキュメントタイプアイコンとタイトル */}
          <div className="flex items-start gap-3 mb-3">
            {/* ドキュメントタイプのアイコン */}
            <span className="text-2xl">{documentIcons[document.type]}</span>

            <div>
              {/* メタ情報（ドキュメントタイプと更新日時） */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span className="capitalize">{document.type} Document</span>
                <span>•</span>
                <span>更新日: {document.updatedAt}</span>
              </div>

              {/* ファイル名（クリック可能） */}
              <h3 className="text-lg font-bold text-blue-600 hover:underline cursor-pointer">
                {document.title}
              </h3>
            </div>
          </div>

          {/* タグエリア */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* 最終製品タグ */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors.finalProduct}`}>
              最終製品: {document.finalProduct}
            </span>
            {/* 課題感タグ */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors.issue}`}>
              課題感: {document.issue}
            </span>
            {/* 使用原料タグ */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors.ingredient}`}>
              使用原料: {document.ingredient}
            </span>
            {/* 提案企業タグ */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors.customer}`}>
              提案企業: {document.customer}
            </span>
            {/* 試作IDタグ */}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              試作ID: {document.trialId}
            </span>
            {/* 担当者タグ */}
            {document.author && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors.author}`}>
                担当者: {document.author}
              </span>
            )}
          </div>

          {/* エラーメッセージ表示 */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ボタンエリア */}
          <div className="flex gap-2">
            {/* プレビューボタン */}
            {canPreview && (
              <button
                onClick={handlePreview}
                disabled={isLoadingPreview}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isLoadingPreview ? '読み込み中...' : 'プレビュー'}
                </span>
              </button>
            )}

            {/* ダウンロードボタン */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isDownloading ? 'ダウンロード中...' : 'ダウンロード'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
