import { Edit } from 'lucide-react';
import { KnowledgeDocument } from '@/types/knowledge';

// 親コンポーネントから受け取るPropsの型定義
interface MetadataTableProps {
  documents: KnowledgeDocument[];     // 表示するドキュメントのリスト
  onEdit: (id: string) => void;       // 編集ボタンクリック時のコールバック
}

export const MetadataTable = ({ documents, onEdit }: MetadataTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        {/* テーブルヘッダー */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ファイル名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              最終製品
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              課題感
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              顧客
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              更新日時
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              アクション
            </th>
          </tr>
        </thead>

        {/* テーブルボディ */}
        <tbody className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              {/* ファイル名 */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{doc.title}</div>
              </td>

              {/* 最終製品 */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{doc.finalProduct}</div>
              </td>

              {/* 課題感 */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{doc.issue}</div>
              </td>

              {/* 顧客 */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">{doc.customer}</div>
              </td>

              {/* 更新日時 */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-700">
                  {/* 日時を日本語形式でフォーマット */}
                  {new Date(doc.updatedAt).toLocaleString('ja-JP')}
                </div>
              </td>

              {/* アクションボタン */}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onEdit(doc.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">編集</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
