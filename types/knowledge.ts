// ドキュメントの種類を文字列リテラル型で定義
export type DocumentType = 'pdf' | 'word' | 'excel' | 'powerpoint';

// ナレッジドキュメントのデータ構造（バックエンドAPIに合わせた命名）
export interface KnowledgeDocument {
  id: string;              // 一意な識別子
  title: string;           // ファイル名
  type: DocumentType;      // ドキュメントの種類
  finalProduct: string;    // 最終製品 (API: final_product)
  issue: string;           // 課題感 (API: issue)
  ingredient: string;      // 使用原料 (API: ingredient)
  customer: string;        // 提案企業 (API: customer)
  trialId: string;         // 試作ID (API: trial_id)
  author?: string;         // 開発担当者 (API: author)
  updatedAt: string;       // 更新日時
  fileUrl: string;         // ファイルのダウンロードURL
}

// 検索フィルターの構造（全てオプショナル、バックエンドAPIに合わせた命名）
export interface SearchFilters {
  finalProduct?: string;   // 最終製品 (API: final_product)
  issue?: string;          // 課題感 (API: issue)
  ingredient?: string;     // 使用原料 (API: ingredient)
  customer?: string;       // 提案企業 (API: customer)
  trialId?: string;        // 試作ID (API: trial_id)
  author?: string;         // 開発担当者 (API: author)
}

// 検索結果の型定義
export interface SearchResult {
  documents: KnowledgeDocument[];
  total: number;           // 総件数
  limit: number;           // 1ページあたりの件数
  offset: number;          // 現在のオフセット
}
