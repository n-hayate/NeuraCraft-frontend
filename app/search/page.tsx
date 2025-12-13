'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { SearchBar } from '@/components/SearchBar';
import { DocumentCard } from '@/components/DocumentCard';
import { KnowledgeDocument } from '@/types/knowledge';
import { filesApi } from '@/api/files';
import { FileRead } from '@/types/files';
import { SORT_OPTIONS, DEFAULT_SORT_BY } from '@/constants/sortOptions';

// モックデータ（開発用のダミーデータ）
const mockDocuments: KnowledgeDocument[] = [
  {
    id: '1',
    title: '中華まん_ふわふわ食感_強力粉_ABCフーズ_AB01.pdf',
    type: 'pdf',
    finalProduct: '中華まん',
    issue: 'ふわふわ食感',
    ingredient: '強力粉',
    customer: 'ABCフーズ',
    trialId: 'AB01',
    author: '鈴木一郎',
    updatedAt: '2023-10-27',
    fileUrl: '/files/report1.pdf',
  },
  {
    id: '2',
    title: '冷凍うどん_コシの持続_タピオカ粉_フードテック社_FT02.xlsx',
    type: 'excel',
    finalProduct: '冷凍うどん',
    issue: 'コシの持続',
    ingredient: 'タピオカ粉',
    customer: 'フードテック社',
    trialId: 'FT02',
    author: '佐藤花子',
    updatedAt: '2023-09-15',
    fileUrl: '/files/trial2.xlsx',
  },
  {
    id: '3',
    title: 'グミ_口溶けの良さ_ゼラチン_OYATSUカンパニー_OY03.pdf',
    type: 'pdf',
    finalProduct: 'グミ',
    issue: '口溶けの良さ',
    ingredient: 'ゼラチン',
    customer: 'OYATSUカンパニー',
    trialId: 'OY03',
    author: '高橋健太',
    updatedAt: '2023-08-01',
    fileUrl: '/files/proposal3.pdf',
  },
];

export default function SearchPage() {
  // 検索キーワードを管理
  const [searchQuery, setSearchQuery] = useState('');

  // 検索結果のドキュメントリストを管理
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(mockDocuments);

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

  // バックエンドのFileReadをKnowledgeDocumentに変換
  const convertFileToDocument = (file: FileRead): KnowledgeDocument => {
    // ファイル名の拡張子からファイルタイプを判定
    const filename = file.original_name || '';
    let docType: KnowledgeDocument['type'] = 'pdf';

    if (filename.endsWith('.pdf')) {
      docType = 'pdf';
    } else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
      docType = 'word';
    } else if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      docType = 'excel';
    } else if (filename.endsWith('.pptx') || filename.endsWith('.ppt')) {
      docType = 'powerpoint';
    }

    return {
      id: file.id,
      title: file.original_name,
      type: docType,
      finalProduct: file.application || '',
      issue: file.issue || '',
      ingredient: file.ingredient || '',
      customer: file.customer || '',
      trialId: file.trial_id || '',
      author: file.author || '',
      updatedAt: new Date(file.updated_at).toISOString().split('T')[0],
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
        q: searchQuery || undefined,  // 空文字列の場合はundefinedを渡す（全件検索）
        page: currentPage,
        page_size: itemsPerPage,
        sort_by: sortBy,
      });

      const docs = result.files.map(convertFileToDocument);
      setDocuments(docs);
      setTotalCount(result.total_count);  // 正しい総件数を取得

    } catch (err) {
      console.error('Search failed:', err);
      setError('検索に失敗しました');
      // エラー時はモックデータを表示
      setDocuments(mockDocuments);
      setTotalCount(mockDocuments.length);
    } finally {
      setIsLoading(false);
    }
  };

  // ページまたはソート順が変更されたら自動で検索（初期表示時も実行）
  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortBy]);

  // 検索ボタンクリック時の処理
  const handleSearch = () => {
    setCurrentPage(1);  // 検索時は1ページ目に戻る
    performSearch();
  };

  /**
   * ページネーションのページ番号配列を生成する関数
   * @param currentPage 現在のページ番号
   * @param totalPages 総ページ数
   * @returns ページ番号の配列（'...'を含む）
   */
  const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
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
      pages.push('...');
      pages.push(totalPages);
    }
    // 現在のページが最終付近（最終-3ページ以降）
    else if (currentPage >= totalPages - 3) {
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    // 現在のページが中間
    else {
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  // ページ変更時の処理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ページトップにスムーススクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * ソート順変更時の処理
   */
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);  // ページ番号を1にリセット
  };

  // 総ページ数を計算
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <AppHeader
        title="食品開発ナレッジ検索"
        icon={
          <div className="w-10 h-10 bg-[#FFCB06] rounded-full flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
        }
        helpLink="/search-poc"
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
              {/* ヘッダー: 件数と並び替え */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {totalCount}件の結果
                </h2>

                {/* 並び替えドロップダウン */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-sm font-bold text-gray-700">
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

              {/* ドキュメントカードのリスト */}
              <div className="space-y-4">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">検索結果が見つかりませんでした</p>
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
                {generatePageNumbers(currentPage, totalPages).map((page, index) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
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
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-label={`${page}ページへ`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* 次へボタン */}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
    </div>
  );
}
