// ファイルの基本情報（バックエンドのスキーマに合わせて定義）
export interface FileRead {
  id: string;
  owner_id: number;
  original_filename: string;
  blob_name: string;
  content_type: string;
  file_size: number;
  azure_blob_url: string;
  created_at: string;
  updated_at: string;
  // メタデータフィールド
  final_product?: string; // 最終製品
  issue?: string; // 課題
  ingredient?: string; // 成分
  customer?: string; // 顧客
  trial_id?: string; // 試作ID
  author?: string; // 著者
  status?: string; // ステータス
  file_extension?: string; // ファイル拡張子
  download_count?: number; // ダウンロード回数
}

// ファイル検索のフィルター条件（バックエンドAPI仕様に準拠）
export interface FileSearchParams {
  q?: string;              // 検索キーワード（ファイル名での部分一致検索）
  final_product?: string;
  issue?: string;
  ingredient?: string;
  customer?: string;
  trial_id?: string;
  author?: string;
  sort_by?: string;        // デフォルト: "updated_at_desc"
  page?: number;           // ページ番号（1始まり、デフォルト: 1）
  page_size?: number;      // 1ページあたりの件数（デフォルト: 10, 最大: 100）
}

// ファイル検索のレスポンス（バックエンドAPI仕様に準拠）
export interface FileSearchResponse {
  total_count: number;
  files: FileRead[];
}

// ダッシュボード用：ランキングアイテム
export interface UsageRankingItem {
  name: string;
  count: number;
}

export interface IngredientRankingItem {
  name: string;
  count: number;
}

export interface IssueWordCloud {
  [key: string]: number;
}

// ダッシュボードのレスポンス（バックエンド仕様に準拠）
export interface DashboardResponse {
  total_files: number;
  new_files_last_month: number;
  usage_ranking: UsageRankingItem[];
  ingredient_ranking: IngredientRankingItem[];
  issue_word_cloud: IssueWordCloud;
}
