// ファイルの基本情報（バックエンドのスキーマに合わせて定義）
export interface FileRead {
  id: string;
  owner_id: number;
  original_name: string; // バックエンドの実際のフィールド名
  blob_path: string; // バックエンドの実際のフィールド名
  created_at: string;
  updated_at: string;
  // メタデータフィールド
  application?: string; // 最終製品（バックエンドの実際のフィールド名）
  issue?: string; // 課題
  ingredient?: string; // 成分
  customer?: string; // 顧客
  trial_id?: string; // 試作ID
  author?: string; // 著者
  status?: string; // ステータス
}

// ファイル検索のフィルター条件（バックエンドAPI仕様に準拠）
export interface FileSearchParams {
  q?: string;              // 検索キーワード（ファイル名での部分一致検索）
  application?: string;    // 最終製品(バックエンドのフィールド名に合わせた)
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

export interface DownloadRankingItem {
  name: string;
  count: number;
}

export interface TrendDataItem {
  date: string; // YYYY-MM-DD形式
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
  // 新規追加フィールド
  downloads_this_month: number; // 今月のダウンロード数
  top_downloads_last_week: DownloadRankingItem[]; // 先週のダウンロード数Top3
  registration_trend: TrendDataItem[]; // 登録件数推移
}
