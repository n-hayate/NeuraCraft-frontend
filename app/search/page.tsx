'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/FilterBar';
import { DocumentCard } from '@/components/DocumentCard';
import { KnowledgeDocument, SearchFilters } from '@/types/knowledge';

// モックデータ（開発用のダミーデータ）
const mockDocuments: KnowledgeDocument[] = [
  {
    id: '1',
    title: '中華まん生地の改良に関するレポート.pdf',
    type: 'pdf',
    finalProduct: '中華まん',
    challenge: 'ふわふわ食感',
    ingredients: '強力粉',
    company: 'ABCフーズ',
    assignee: '鈴木一郎',
    updatedAt: '2023-10-27',
    thumbnailUrl: 'https://via.placeholder.com/192x128',
    fileUrl: '/files/report1.pdf',
  },
  {
    id: '2',
    title: '冷凍うどんの食感改善トライアル.docx',
    type: 'word',
    finalProduct: '冷凍うどん',
    challenge: 'コシの持続',
    ingredients: 'タピオカ粉',
    company: 'フードテック社',
    assignee: '佐藤花子',
    updatedAt: '2023-09-15',
    thumbnailUrl: 'https://via.placeholder.com/192x128',
    fileUrl: '/files/trial2.docx',
  },
  {
    id: '3',
    title: '新食感グミの開発提案.pptx',
    type: 'powerpoint',
    finalProduct: 'グミ',
    challenge: '口溶けの良さ',
    ingredients: 'ゼラチン',
    company: 'OYATSUカンパニー',
    assignee: '高橋健太',
    updatedAt: '2023-08-01',
    thumbnailUrl: 'https://via.placeholder.com/192x128',
    fileUrl: '/files/proposal3.pptx',
  },
];

export default function SearchPage() {
  // 検索キーワードを管理
  const [searchQuery, setSearchQuery] = useState('');

  // フィルター条件を管理
  const [filters, setFilters] = useState<SearchFilters>({});

  // 検索結果のドキュメントリストを管理
  const [documents, setDocuments] = useState(mockDocuments);

  // 検索実行時の処理
  const handleSearch = () => {
    // TODO: 実際の検索API呼び出しに置き換える
    console.log('Searching for:', searchQuery, filters);
  };

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

        {/* 検索結果エリア */}
        <div className="mb-6">
          {/* ヘッダー: 件数と並び替え */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {documents.length}件の結果
            </h2>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>並び替え: 更新日順</option>
              <option>並び替え: 関連度順</option>
            </select>
          </div>

          {/* ドキュメントカードのリスト */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>

        {/* ページネーション */}
        <div className="flex items-center justify-center gap-2">
          {/* 前へボタン */}
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
            &lt;
          </button>

          {/* ページ番号ボタン */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            2
          </button>
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            3
          </button>
          <span className="px-3 py-2 text-gray-500">...</span>
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            10
          </button>

          {/* 次へボタン */}
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
            &gt;
          </button>
        </div>
      </main>
    </div>
  );
};
