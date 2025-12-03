'use client';

import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MetadataTable } from '@/components/MetadataTable';
import { KnowledgeDocument } from '@/types/knowledge';

// モックデータ（Chapter 3と同じ）
const mockDocuments: KnowledgeDocument[] = [
  {
    id: '1',
    title: '中華まん生地の改良に関するレポート.pdf',
    type: 'pdf',
    finalProduct: '中華まん',
    issue: 'ふわふわ食感',
    ingredient: '強力粉',
    customer: 'ABCフーズ',
    trialId: 'TRIAL-001',
    author: '鈴木一郎',
    updatedAt: '2023-10-27',
    fileUrl: '/files/report1.pdf',
  },
  {
    id: '2',
    title: '冷凍うどんの食感改善トライアル.docx',
    type: 'word',
    finalProduct: '冷凍うどん',
    issue: 'コシの持続',
    ingredient: 'タピオカ粉',
    customer: 'フードテック社',
    trialId: 'TRIAL-002',
    author: '佐藤花子',
    updatedAt: '2023-09-15',
    fileUrl: '/files/trial2.docx',
  },
  {
    id: '3',
    title: '新食感グミの開発提案.pptx',
    type: 'powerpoint',
    finalProduct: 'グミ',
    issue: '口溶けの良さ',
    ingredient: 'ゼラチン',
    customer: 'OYATSUカンパニー',
    trialId: 'TRIAL-003',
    author: '高橋健太',
    updatedAt: '2023-08-01',
    fileUrl: '/files/proposal3.pptx',
  },
];

export default function AdminPage() {
  // アクティブなメニューを管理
  const [activeMenu, setActiveMenu] = useState<'metadata' | 'users'>('metadata');

  // 検索キーワードを管理
  const [searchQuery, setSearchQuery] = useState('');

  // ドキュメントリストを管理
  const [documents, setDocuments] = useState(mockDocuments);

  // 編集ボタンクリック時の処理
  const handleEdit = (id: string) => {
    console.log('Editing document:', id);
    // TODO: 編集モーダルを開く
  };

  // フィルターオプションの定義
  const filterOptions = [
    { key: 'finalProduct', label: '最終製品' },
    { key: 'issue', label: '課題感' },
    { key: 'customer', label: '顧客' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* サイドバー */}
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* メインコンテンツ */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          メタデータ管理
        </h1>

        {/* 検索とフィルターエリア */}
        <div className="mb-6 space-y-4">
          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="キーワードでファイルを検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* フィルターボタン */}
          <div className="flex gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="text-sm text-gray-700">{option.label}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            ))}
          </div>
        </div>

        {/* メタデータテーブル */}
        <MetadataTable documents={documents} onEdit={handleEdit} />
      </main>
    </div>
  );
};
