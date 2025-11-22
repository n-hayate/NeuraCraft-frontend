import { ChevronDown } from 'lucide-react';
import { SearchFilters } from '@/types/knowledge';

// 親コンポーネントから受け取るPropsの型定義
interface FilterBarProps {
  filters: SearchFilters;                          // 現在のフィルター状態
  onChange: (filters: SearchFilters) => void;      // フィルター変更時のコールバック
}

export const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  // フィルターオプションの定義
  const filterOptions = [
    { key: 'finalProduct', label: '最終製品' },
    { key: 'challenge', label: '課題感' },
    { key: 'ingredients', label: '使用原料' },
    { key: 'company', label: '提案企業（顧客）' },
    { key: 'assignee', label: '開発担当者' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {/* フィルターオプションをループで生成 */}
      {filterOptions.map((option) => (
        <button
          key={option.key}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <span className="text-sm text-gray-700">{option.label}</span>
          {/* ドロップダウンアイコン */}
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      ))}

      {/* 試作ID入力フィールド */}
      <input
        type="text"
        placeholder="試作ID"
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-32"
        value={filters.trialId || ''}  // undefinedの場合は空文字を表示
        onChange={(e) => onChange({ ...filters, trialId: e.target.value })}
      />
    </div>
  );
};
