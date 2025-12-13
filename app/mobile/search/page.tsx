"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { SearchBar } from "@/components/SearchBar";
import { MobileDocumentCard } from "@/components/MobileDocumentCard";
import { KnowledgeDocument } from "@/types/knowledge";
import { filesApi } from "@/api/files";
import { FileRead } from "@/types/files";
import { SORT_OPTIONS, DEFAULT_SORT_BY } from "@/constants/sortOptions";

// モックデータ（開発用のダミーデータ）
const mockDocuments: KnowledgeDocument[] = [
  {
    id: "1",
    title: "中華まん_ふわふわ食感_強力粉_ABCフーズ_AB01.pdf",
    type: "pdf",
    finalProduct: "中華まん",
    issue: "ふわふわ食感",
    ingredient: "強力粉",
    customer: "ABCフーズ",
    trialId: "AB01",
    author: "鈴木一郎",
    updatedAt: "2023-10-27",
    fileUrl: "/files/report1.pdf",
  },
  {
    id: "2",
    title: "冷凍うどん_コシの持続_タピオカ粉_フードテック社_FT02.xlsx",
    type: "excel",
    finalProduct: "冷凍うどん",
    issue: "コシの持続",
    ingredient: "タピオカ粉",
    customer: "フードテック社",
    trialId: "FT02",
    author: "佐藤花子",
    updatedAt: "2023-09-15",
    fileUrl: "/files/trial2.xlsx",
  },
  {
    id: "3",
    title: "グミ_口溶けの良さ_ゼラチン_OYATSUカンパニー_OY03.pdf",
    type: "pdf",
    finalProduct: "グミ",
    issue: "口溶けの良さ",
    ingredient: "ゼラチン",
    customer: "OYATSUカンパニー",
    trialId: "OY03",
    author: "高橋健太",
    updatedAt: "2023-08-01",
    fileUrl: "/files/proposal3.pdf",
  },
];

export default function MobileSearchPage() {
  // 検索キーワードを管理
  const [searchQuery, setSearchQuery] = useState("");

  // 検索結果のドキュメントリストを管理（初期値は空配列）
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);

  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  // エラー状態
  const [error, setError] = useState<string | null>(null);

  // ページネーション
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // ソート順の状態
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_BY);

  // 検索が実行されたかどうかを追跡
  const [hasSearched, setHasSearched] = useState(false);

  // バックエンドのFileReadをKnowledgeDocumentに変換
  const convertFileToDocument = (file: FileRead): KnowledgeDocument => {
    // ファイル名の拡張子からファイルタイプを判定
    const filename = file.original_name || "";
    let docType: KnowledgeDocument["type"] = "pdf";

    if (filename.endsWith(".pdf")) {
      docType = "pdf";
    } else if (filename.endsWith(".docx") || filename.endsWith(".doc")) {
      docType = "word";
    } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
      docType = "excel";
    } else if (filename.endsWith(".pptx") || filename.endsWith(".ppt")) {
      docType = "powerpoint";
    }

    return {
      id: file.id,
      title: file.original_name,
      type: docType,
      finalProduct: file.application || "",
      issue: file.issue || "",
      ingredient: file.ingredient || "",
      customer: file.customer || "",
      trialId: file.trial_id || "",
      author: file.author || "",
      updatedAt: new Date(file.updated_at).toISOString().split("T")[0],
      fileUrl: file.id, // ダウンロードはファイルIDを使用（実際のダウンロードURLは動的に取得）
    };
  };

  /**
   * 検索を実行する関数
   */
  const performSearch = async () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true); // 検索が実行されたことを記録

    try {
      // キーワードの有無にかかわらず、search APIを使用
      const result = await filesApi.search({
        q: searchQuery || undefined, // 空文字列の場合はundefinedを渡す（全件検索）
        page: currentPage,
        page_size: itemsPerPage,
        sort_by: sortBy, // ソート順を追加
      });

      const docs = result.files.map(convertFileToDocument);
      setDocuments(docs);
      setTotalCount(result.total_count); // 正しい総件数を取得
    } catch (err) {
      console.error("Search failed:", err);
      setError("検索に失敗しました");
      // エラー時は空配列を設定（モックデータは表示しない）
      setDocuments([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // 検索ボタンクリックまたはEnterキー押下時の処理
  const handleSearch = () => {
    setCurrentPage(1); // 検索時は1ページ目に戻る
    performSearch();
  };

  /**
   * ページネーションのページ番号配列を生成する関数（モバイル向けに簡略化）
   */
  const generatePageNumbers = (
    currentPage: number,
    totalPages: number
  ): (number | string)[] => {
    const pages: (number | string)[] = [];

    // モバイルでは最大5ページまで表示
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // 常に最初のページを追加
    pages.push(1);

    // 現在のページが先頭付近（1-3ページ）
    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
    // 現在のページが最終付近（最終-2ページ以降）
    else if (currentPage >= totalPages - 2) {
      pages.push("...");
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    // 現在のページが中間
    else {
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  // ページ変更時の処理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ページ変更時も検索を実行
    performSearch();
    // ページトップにスムーススクロール
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * ソート順変更時の処理
   */
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // ページ番号を1にリセット
    // ソート順変更時も検索を実行
    performSearch();
  };

  // 総ページ数を計算
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* モバイル専用ヘッダー */}
      <MobileHeader />

      {/* メインコンテンツ */}
      <main className="px-4 py-4">
        {/* 検索バー（固定表示） */}
        <div className="sticky top-14 z-40 bg-gray-50 py-3 -mx-4 px-4 mb-4 border-b border-gray-200">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="ナレッジを検索..."
          />
        </div>

        {/* ローディング表示 */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-500 mt-2 text-sm">読み込み中...</p>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* 検索結果エリア（検索が実行された場合のみ表示） */}
        {hasSearched && !isLoading && !error && (
          <>
            <div className="mb-4">
              {/* ヘッダー: 件数と並び替え */}
              <div className="flex flex-col gap-3 mb-4">
                {totalCount > 0 && (
                  <h2 className="text-base font-bold text-gray-900">
                    {totalCount}件の結果
                  </h2>
                )}

                {/* 並び替えドロップダウン（モバイル向けにフル幅、結果がある場合のみ表示） */}
                {totalCount > 0 && (
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="sort-select-mobile"
                      className="text-xs font-bold text-gray-700 whitespace-nowrap"
                    >
                      並べ替え:
                    </label>
                    <select
                      id="sort-select-mobile"
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                      aria-label="検索結果の並び替え"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* ドキュメントカードのリスト */}
              <div className="space-y-2">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <MobileDocumentCard
                      key={doc.id}
                      document={doc}
                      tagLabels={{
                        finalProduct: "用途",
                        issue: "用途",
                        ingredient: "原料",
                        customer: "顧客",
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      検索結果が見つかりませんでした
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ページネーション（モバイル向けに簡略化） */}
            {documents.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-6">
                {/* 前へボタン */}
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  aria-label="前のページへ"
                >
                  &lt;
                </button>

                {/* ページ番号ボタン */}
                {generatePageNumbers(currentPage, totalPages).map(
                  (page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 py-2 text-gray-500 text-sm"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`min-w-[36px] px-3 py-2 rounded-lg border transition-colors text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-label={`${page}ページへ`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                {/* 次へボタン */}
                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  aria-label="次のページへ"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
