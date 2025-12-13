/**
 * ソートオプションの型定義
 */
export interface SortOption {
  value: string;    // バックエンドAPIに渡す値
  label: string;    // UIに表示するラベル
}

/**
 * 利用可能なソートオプション一覧
 * バックエンドAPI仕様（app/services/search_service.py）に準拠
 */
export const SORT_OPTIONS: SortOption[] = [
  {
    value: 'relevance',
    label: '関連度順',
  },
  {
    value: 'updated_at_desc',
    label: '更新日が新しい順',
  },
  {
    value: 'updated_at_asc',
    label: '更新日が古い順',
  },
  {
    value: 'created_at_desc',
    label: '登録日が新しい順',
  },
  {
    value: 'created_at_asc',
    label: '登録日が古い順',
  },
];

/**
 * デフォルトのソート順
 */
export const DEFAULT_SORT_BY = 'updated_at_desc';
