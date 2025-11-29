import { Search } from 'lucide-react';

// 親コンポーネントから受け取るPropsの型定義
interface SearchBarProps {
  value: string;                          // 検索キーワード
  onChange: (value: string) => void;      // 値変更時のコールバック
  onSearch: () => void;                   // 検索実行時のコールバック
  placeholder?: string;                   // プレースホルダーテキスト
}

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'ナレッジを検索...',
}: SearchBarProps) => {
  /**
   * Enterキー押下時に検索を実行
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* 検索アイコン */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        {/* 検索入力フィールド */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />

        {/* 検索ボタン */}
        <button
          onClick={onSearch}
          className="absolute inset-y-0 right-0 px-6 m-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          検索
        </button>
      </div>
    </div>
  );
};
