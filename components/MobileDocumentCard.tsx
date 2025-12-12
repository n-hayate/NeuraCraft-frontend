"use client";

import { KnowledgeDocument } from "@/types/knowledge";
import { filesApi } from "@/api/files";
import { useState } from "react";
import { User, Hash } from "lucide-react";

// 親コンポーネントから受け取るPropsの型定義
interface MobileDocumentCardProps {
  document: KnowledgeDocument;
}

// ドキュメントタイプごとのアイコン
const documentIcons = {
  pdf: "📄",
  word: "📝",
  excel: "📊",
  powerpoint: "📊",
};

/**
 * モバイル専用のコンパクトなドキュメントカードコンポーネント
 * 情報密度を高め、1画面に多くのカードを表示できるように最適化
 */
export const MobileDocumentCard = ({ document }: MobileDocumentCardProps) => {
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  /**
   * プレビューボタンクリック時の処理
   */
  const handlePreview = async () => {
    setIsLoadingPreview(true);
    try {
      // バックエンドからプレビューURLを取得
      const { preview_url } = await filesApi.getPreviewUrl(document.id);

      // 新しいタブでOffice Viewerを開く
      window.open(preview_url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Preview error:", err);
      alert("プレビューの表示に失敗しました");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // ファイル名を省略表示（最大2行、約60文字程度）
  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow cursor-pointer ${
        isLoadingPreview ? "opacity-50 cursor-wait" : ""
      }`}
      onClick={handlePreview}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePreview();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${document.title}をプレビュー`}
      aria-busy={isLoadingPreview}
    >
      <div className="flex gap-3">
        {/* 左側: ドキュメントタイプアイコン */}
        <div className="flex-shrink-0">
          <span className="text-xl">{documentIcons[document.type]}</span>
        </div>

        {/* 右側: ドキュメント情報 */}
        <div className="flex-1 min-w-0">
          {/* ヘッダー: 更新日（右上）とファイル名 */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            {/* ファイル名 */}
            <h3
              className="flex-1 text-sm font-semibold text-gray-900 line-clamp-2 leading-tight"
              title={document.title}
            >
              {truncateTitle(document.title)}
              {isLoadingPreview && (
                <span className="ml-1 text-xs text-gray-500">
                  (読み込み中...)
                </span>
              )}
            </h3>

            {/* 更新日（右上） */}
            <span className="flex-shrink-0 text-xs text-gray-600 font-medium whitespace-nowrap">
              {document.updatedAt}
            </span>
          </div>

          {/* 重要タグ（最終製品、課題感、使用原料、提案企業） */}
          <div className="flex flex-wrap gap-1 mb-1.5">
            {document.finalProduct && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                最終製品: {document.finalProduct}
              </span>
            )}
            {document.issue && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                課題感: {document.issue}
              </span>
            )}
            {document.ingredient && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                使用原料: {document.ingredient}
              </span>
            )}
            {document.customer && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                提案企業: {document.customer}
              </span>
            )}
          </div>

          {/* メタデータ（担当者、試作ID） - グレーテキストで1行にまとめる */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {document.author && (
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{document.author}</span>
              </div>
            )}
            {document.trialId && (
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>{document.trialId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
