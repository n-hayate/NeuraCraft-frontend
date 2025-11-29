'use client';

import { Download } from 'lucide-react';
import { KnowledgeDocument } from '@/types/knowledge';
import { useFileDownload } from '@/hooks/useFileDownload';

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
  challenge: 'bg-orange-100 text-orange-800',
  ingredients: 'bg-blue-100 text-blue-800',
  company: 'bg-purple-100 text-purple-800',
  assignee: 'bg-gray-100 text-gray-800',
};

export const DocumentCard = ({ document }: DocumentCardProps) => {
  // カスタムフックを使用してダウンロード機能を取得
  const { downloadFile, isDownloading, error } = useFileDownload();

  /**
   * ダウンロードボタンクリック時の処理
   */
  const handleDownload = async () => {
    await downloadFile(document.id, document.title);
  };

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
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors.challenge}`}>
              課題感: {document.challenge}
            </span>
            {/* 使用原料タグ */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors.ingredients}`}>
              使用原料: {document.ingredients}
            </span>
            {/* 顧客タグ */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors.company}`}>
              顧客: {document.company}
            </span>
            {/* 担当者タグ */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tagColors.assignee}`}>
              担当者: {document.assignee}
            </span>
          </div>

          {/* エラーメッセージ表示 */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
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

        {/* 右側: サムネイル */}
        {document.thumbnailUrl && (
          <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={document.thumbnailUrl}
              alt={document.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};
