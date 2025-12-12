"use client";

import { useState, useEffect } from "react";
import { Search, Sparkles, X, Loader2 } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { SearchBar } from "@/components/SearchBar";
import { DocumentCard } from "@/components/DocumentCard";
import { KnowledgeDocument } from "@/types/knowledge";
import { filesApi } from "@/api/files";
import { FileRead } from "@/types/files";
import { useDebounce } from "@/hooks/useDebounce";
import { SORT_OPTIONS, DEFAULT_SORT_BY } from "@/constants/sortOptions";
import { aiApi } from "@/api/ai";
import { AIAnalysisResponse } from "@/types/ai";

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

export default function SearchPocPage() {
  // 検索キーワードを管理
  const [searchQuery, setSearchQuery] = useState("");

  // 検索結果のドキュメントリストを管理
  const [documents, setDocuments] =
    useState<KnowledgeDocument[]>(mockDocuments);

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

  // 検索が実行されたか（AIボタン表示用）
  const [hasSearched, setHasSearched] = useState(false);

  // AI分析関連の状態
  const [isShikujiriAnalyzing, setIsShikujiriAnalyzing] = useState(false);
  const [isBestPracticeAnalyzing, setIsBestPracticeAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] =
    useState<AIAnalysisResponse | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // デバウンス処理: 検索キーワードの変更を300ms遅延
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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
   *
   * 注意: getAll APIは配列のみを返し、総件数を返さないため、
   * キーワードの有無にかかわらず search APIを使用する。
   * search APIは total_count を返すため、ページネーションが正しく動作する。
   */
  const performSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // キーワードの有無にかかわらず、search APIを使用
      const result = await filesApi.search({
        q: debouncedSearchQuery || undefined, // 空文字列の場合はundefinedを渡す（全件検索）
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
      // エラー時はモックデータを表示
      setDocuments(mockDocuments);
      setTotalCount(mockDocuments.length);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  // デバウンスされた検索キーワード、ページ、ソート順が変更されたら自動で検索
  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, currentPage, sortBy]);

  // 検索ボタンクリック時の処理
  const handleSearch = () => {
    setCurrentPage(1); // 検索時は1ページ目に戻る
    performSearch();
  };

  /**
   * ページネーションのページ番号配列を生成する関数
   * @param currentPage 現在のページ番号
   * @param totalPages 総ページ数
   * @returns ページ番号の配列（'...'を含む）
   */
  const generatePageNumbers = (
    currentPage: number,
    totalPages: number
  ): (number | string)[] => {
    const pages: (number | string)[] = [];

    // 総ページ数が7以下の場合、すべて表示
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // 常に最初のページを追加
    pages.push(1);

    // 現在のページが先頭付近（1-4ページ）
    if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }
    // 現在のページが最終付近（最終-3ページ以降）
    else if (currentPage >= totalPages - 3) {
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    // 現在のページが中間
    else {
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  // ページ変更時の処理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ページトップにスムーススクロール
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * ソート順変更時の処理
   */
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // ページ番号を1にリセット
  };

  // しくじり先生実行（失敗の原因を分析）
  const handleShikujiri = async () => {
    setIsShikujiriAnalyzing(true);
    setError(null);

    try {
      const result = await aiApi.analyze({
        question:
          "あなたは熟練の食品開発アドバイザーです。このファイルから失敗の原因について考察している内容をまとめて。",
        q: debouncedSearchQuery || undefined, // 現在の検索キーワードを使用
        sort_by: sortBy,
        top: 5, // 上位5件を分析
      });

      setAiAnalysisResult(result);
      setShowAiModal(true);
    } catch (err) {
      console.error("AI analysis failed:", err);
      setError("AI分析に失敗しました");
    } finally {
      setIsShikujiriAnalyzing(false);
    }
  };

  // 勝利の方程式実行（ベストプラクティスを提示）
  const handleBestPractice = async () => {
    setIsBestPracticeAnalyzing(true);
    setError(null);

    try {
      const result = await aiApi.analyze({
        question:
          "あなたは熟練の食品開発アドバイザーです。ファイル内の配合表の情報を整理した状態で提供してください。ファイルに配合情報がない場合は「情報なし」としてください",
        q: debouncedSearchQuery || undefined, // 現在の検索キーワードを使用
        sort_by: sortBy,
        top: 5, // 上位5件を分析
      });

      setAiAnalysisResult(result);
      setShowAiModal(true);
    } catch (err) {
      console.error("AI analysis failed:", err);
      setError("AI分析に失敗しました");
    } finally {
      setIsBestPracticeAnalyzing(false);
    }
  };

  // 総ページ数を計算
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <AppHeader
        title="食品開発ナレッジ検索（POC）"
        icon={
          <div className="w-10 h-10 bg-[#FFCB06] rounded-full flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
        }
      />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 検索バー */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>

        {/* ローディング表示 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-500 mt-2">読み込み中...</p>
          </div>
        )}

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 検索結果エリア */}
        {!isLoading && !error && (
          <>
            <div className="mb-6">
              {/* ヘッダー: 件数と並び替え、AI分析ボタン */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {totalCount}件の結果
                </h2>

                <div className="flex flex-wrap items-center gap-3 justify-end">
                  {hasSearched && (
                    <>
                      {/* 勝利の方程式ボタン */}
                      <button
                        onClick={handleBestPractice}
                        disabled={
                          isBestPracticeAnalyzing || isShikujiriAnalyzing
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#EE5D50] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isBestPracticeAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            分析中...
                          </>
                        ) : (
                          <>配合を抽出</>
                        )}
                      </button>

                      {/* しくじり先生ボタン */}
                      <button
                        onClick={handleShikujiri}
                        disabled={
                          isShikujiriAnalyzing || isBestPracticeAnalyzing
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#4545E6] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#3A38CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isShikujiriAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            分析中...
                          </>
                        ) : (
                          <>失敗から学ぶ</>
                        )}
                      </button>
                    </>
                  )}

                  {/* 並び替えドロップダウン */}
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="sort-select"
                      className="text-sm font-bold text-gray-700"
                    >
                      並べ替え:
                    </label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                      aria-label="検索結果の並び替え"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ドキュメントカードのリスト */}
              <div className="space-y-4">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      検索結果が見つかりませんでした
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ページネーション（改善版） */}
            {documents.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {/* 前へボタン */}
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          className="px-3 py-2 text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`min-w-[40px] px-4 py-2 rounded-lg border transition-colors ${
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
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="次のページへ"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* AI分析結果モーダル */}
      {showAiModal && aiAnalysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">AI分析結果</h2>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="閉じる"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 回答 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  分析結果
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {aiAnalysisResult.answer}
                  </p>
                </div>
              </div>

              {/* 参照元ファイル */}
              {aiAnalysisResult.sources &&
                aiAnalysisResult.sources.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      参照したファイル ({aiAnalysisResult.sources.length}件)
                    </h3>
                    <ul className="space-y-2">
                      {aiAnalysisResult.sources.map((source, index) => (
                        <li
                          key={index}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700"
                        >
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* エラー表示 */}
              {aiAnalysisResult.error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    {aiAnalysisResult.error}
                  </p>
                </div>
              )}
            </div>

            {/* フッター */}
            <div className="border-t border-gray-200 p-6 flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
