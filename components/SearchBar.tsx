import { Search } from 'lucide-react';

// 親コンポーネントから受け取るPropsの型定義
interface SearchBarProps {
  value: string;                  // 検索キーワード
  onChange: (value: string) => void;  // 入力変更時のコールバック
  onSearch: () => void;           // 検索実行時のコールバック
}

export const SearchBar = ({ value, onChange, onSearch }: SearchBarProps) => {
  // Enterキーが押されたら検索を実行
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative">
      {/* 検索アイコン（入力欄の左側に配置） */}
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

      {/* 検索入力欄 */}
      <input
        type="text"
        placeholder="お困りごとをそのまま入力してください（例: 中華まん ふわふわ）"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};
