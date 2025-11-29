import { SearchFilters } from '@/types/knowledge';

interface FilterBarProps {
  filters: SearchFilters;                           // 現在のフィルター値
  onChange: (filters: SearchFilters) => void;       // フィルター変更時のコールバック
}

export const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  /**
   * 個別のフィルター値を更新
   */
  const updateFilter = (key: keyof SearchFilters, value: string) => {
    onChange({
      ...filters,
      [key]: value || undefined,  // 空文字列の場合はundefinedに
    });
  };

  /**
   * 全フィルターをクリア
   */
  const clearFilters = () => {
    onChange({});
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">フィルター</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          クリア
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 最終製品フィルター */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            最終製品
          </label>
          <input
            type="text"
            value={filters.finalProduct || ''}
            onChange={(e) => updateFilter('finalProduct', e.target.value)}
            placeholder="例: 中華まん"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 課題感フィルター */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            課題感
          </label>
          <input
            type="text"
            value={filters.issue || ''}
            onChange={(e) => updateFilter('issue', e.target.value)}
            placeholder="例: ふわふわ食感"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 使用原料フィルター */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            使用原料
          </label>
          <input
            type="text"
            value={filters.ingredient || ''}
            onChange={(e) => updateFilter('ingredient', e.target.value)}
            placeholder="例: 強力粉"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 提案企業フィルター */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            提案企業
          </label>
          <input
            type="text"
            value={filters.customer || ''}
            onChange={(e) => updateFilter('customer', e.target.value)}
            placeholder="例: ABCフーズ"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 試作IDフィルター */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            試作ID
          </label>
          <input
            type="text"
            value={filters.trialId || ''}
            onChange={(e) => updateFilter('trialId', e.target.value)}
            placeholder="例: AB12"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 開発担当者フィルター */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            開発担当者
          </label>
          <input
            type="text"
            value={filters.author || ''}
            onChange={(e) => updateFilter('author', e.target.value)}
            placeholder="例: 鈴木一郎"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};
