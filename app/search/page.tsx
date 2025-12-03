'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { DocumentCard } from '@/components/DocumentCard';
import { KnowledgeDocument, SearchFilters } from '@/types/knowledge';
import { filesApi } from '@/api/files';
import { FileRead } from '@/types/files';
import { useDebounce } from '@/hooks/useDebounce';

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

  // フィルター条件を管理
  const [filters, setFilters] = useState<SearchFilters>({});

  // 検索結果のドキュメントリストを管理
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(mockDocuments);

  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  // エラー状態
  const [error, setError] = useState<string | null>(null);

  // ページネーション
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // デバウンス処理: フィルターの変更を300ms遅延
  const debouncedFilters = useDebounce(filters, 300);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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
   */
  const performSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // フィルターまたは検索キーワードが存在するかチェック
      const hasFilters = Object.values(debouncedFilters).some(v => v);

      let result;

      if (hasFilters || debouncedSearchQuery) {
        // フィルター検索またはキーワード検索
        result = await filesApi.search({
          q: debouncedSearchQuery || undefined,
          application: debouncedFilters.finalProduct,
          issue: debouncedFilters.issue,
          ingredient: debouncedFilters.ingredient,
          customer: debouncedFilters.customer,
          trial_id: debouncedFilters.trialId,
          author: debouncedFilters.author,
          page: currentPage,
          page_size: itemsPerPage,
        });

        const docs = result.files.map(convertFileToDocument);
        setDocuments(docs);
        setTotalCount(result.total_count);
      } else {
        // 全件取得
        const files = await filesApi.getAll({
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
        });

        const docs = files.map(convertFileToDocument);
        setDocuments(docs);
        // 全件取得の場合は総件数が分からないため、取得件数をセット
        setTotalCount(files.length);
      }

    } catch (err) {
      console.error('Search failed:', err);
      setError('検索に失敗しました');
      // エラー時はモックデータを表示
      setDocuments(mockDocuments);
    } finally {
      setIsLoading(false);
    }
  };

  // デバウンスされたフィルターまたはページが変更されたら自動で検索
  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters, debouncedSearchQuery, currentPage]);

  // 検索ボタンクリック時の処理
  const handleSearch = () => {
    setCurrentPage(1);  // 検索時は1ページ目に戻る
    performSearch();
  };

  // ページ変更時の処理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 総ページ数を計算
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header />

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

        {/* フィルターバー */}
        <div className="mb-6">
          <FilterBar filters={filters} onChange={setFilters} />
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
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>並び替え: 更新日順</option>
                  <option>並び替え: 関連度順</option>
                </select>
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

            {/* ページネーション */}
            {documents.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {/* 前へボタン */}
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                >
                  &lt;
                </button>

                {/* ページ番号ボタン */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {totalPages > 5 && <span className="px-3 py-2 text-gray-500">...</span>}

                {/* 次へボタン */}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
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
