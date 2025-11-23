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
  final_product?: string;  // 最終製品
  issue?: string;          // 課題
  ingredient?: string;     // 成分
  customer?: string;       // 顧客
  trial_id?: string;       // 試作ID
  author?: string;         // 著者
  status?: string;         // ステータス
  file_extension?: string; // ファイル拡張子
  download_count?: number; // ダウンロード回数
}

// ファイル検索のフィルター条件
export interface FileSearchParams {
  final_product?: string;
  issue?: string;
  ingredient?: string;
  customer?: string;
  trial_id?: string;
  author?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

// ダッシュボードのレスポンス
export interface DashboardResponse {
  total_files: number;
  total_size: number;
  recent_files: FileRead[];
}

// ダウンロードURLレスポンス
export interface DownloadUrlResponse {
  download_url: string;
  file_id: string;
  filename: string;
}
