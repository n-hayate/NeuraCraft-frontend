"use client";

import { KnowledgeDocument } from "@/types/knowledge";
import { filesApi } from "@/api/files";
import { useState } from "react";
import { User, Hash } from "lucide-react";

// 親コンポーネントから受け取るPropsの型定義
interface MobileDocumentCardProps {
  document: KnowledgeDocument;
  // タグラベルのカスタマイズ（オプション）
  tagLabels?: {
    finalProduct?: string;
    issue?: string;
    ingredient?: string;
    customer?: string;
  };
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
export const MobileDocumentCard = ({
  document,
  tagLabels,
}: MobileDocumentCardProps) => {
  // デフォルトのラベル
  const defaultLabels = {
    finalProduct: "最終製品",
    issue: "課題感",
    ingredient: "使用原料",
    customer: "提案企業",
  };

  // カスタムラベルがあれば使用、なければデフォルト
  const labels = {
    finalProduct: tagLabels?.finalProduct ?? defaultLabels.finalProduct,
    issue: tagLabels?.issue ?? defaultLabels.issue,
    ingredient: tagLabels?.ingredient ?? defaultLabels.ingredient,
    customer: tagLabels?.customer ?? defaultLabels.customer,
  };
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  /**
   * プレビューボタンクリック時の処理
   */
  const handlePreview = async () => {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "MobileDocumentCard.tsx:31",
        message: "handlePreview called",
        data: { documentId: document.id, title: document.title },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    setIsLoadingPreview(true);
    try {
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "MobileDocumentCard.tsx:35",
            message: "Before API call",
            data: { documentId: document.id },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "C",
          }),
        }
      ).catch(() => {});
      // #endregion
      // バックエンドからプレビューURLを取得
      const { preview_url } = await filesApi.getPreviewUrl(document.id);
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "MobileDocumentCard.tsx:38",
            message: "API call succeeded",
            data: { previewUrl: preview_url?.substring(0, 100) },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "C",
          }),
        }
      ).catch(() => {});
      // #endregion

      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "MobileDocumentCard.tsx:40",
            message: "Before window.open",
            data: { previewUrl: preview_url?.substring(0, 100) },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "D",
          }),
        }
      ).catch(() => {});
      // #endregion
      // 新しいタブでOffice Viewerを開く
      const openedWindow = window.open(
        preview_url,
        "_blank",
        "noopener,noreferrer"
      );
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "MobileDocumentCard.tsx:43",
            message: "After window.open",
            data: {
              openedWindow: openedWindow !== null,
              openedWindowClosed: openedWindow?.closed,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "D",
          }),
        }
      ).catch(() => {});
      // #endregion
    } catch (err) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "MobileDocumentCard.tsx:45",
            message: "API call failed",
            data: { error: err instanceof Error ? err.message : String(err) },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "C",
          }),
        }
      ).catch(() => {});
      // #endregion
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

  // #region agent log
  const handleClick = (e: React.MouseEvent) => {
    fetch("http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "MobileDocumentCard.tsx:166",
        message: "onClick event fired",
        data: {
          tagName: (e.target as HTMLElement)?.tagName,
          currentTargetTagName: (e.currentTarget as HTMLElement)?.tagName,
        },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    e.stopPropagation();
    handlePreview();
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    fetch("http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "MobileDocumentCard.tsx:187",
        message: "onTouchStart event fired",
        data: { tagName: (e.target as HTMLElement)?.tagName },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    fetch("http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "MobileDocumentCard.tsx:202",
        message: "onTouchEnd event fired",
        data: { tagName: (e.target as HTMLElement)?.tagName },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    e.preventDefault();
    handlePreview();
  };
  // #endregion
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow cursor-pointer ${
        isLoadingPreview ? "opacity-50 cursor-wait" : ""
      }`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
        <div
          className="flex-1 min-w-0"
          onClick={(e) => {
            // #region agent log
            fetch(
              "http://127.0.0.1:7242/ingest/7ec8523d-392e-410e-8ab0-45663bea7821",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  location: "MobileDocumentCard.tsx:248",
                  message: "Inner div clicked - calling handlePreview",
                  data: { tagName: (e.target as HTMLElement)?.tagName },
                  timestamp: Date.now(),
                  sessionId: "debug-session",
                  runId: "post-fix",
                  hypothesisId: "B",
                }),
              }
            ).catch(() => {});
            // #endregion
            e.stopPropagation();
            handlePreview();
          }}
        >
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
                {labels.finalProduct}: {document.finalProduct}
              </span>
            )}
            {document.issue && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {labels.issue}: {document.issue}
              </span>
            )}
            {document.ingredient && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {labels.ingredient}: {document.ingredient}
              </span>
            )}
            {document.customer && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {labels.customer}: {document.customer}
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
