// ドキュメントの種類を文字列リテラル型で定義
export type DocumentType = 'pdf' | 'word' | 'excel' | 'powerpoint';

// ナレッジドキュメントのデータ構造
export interface KnowledgeDocument {
  id: string;              // 一意な識別子
  title: string;           // ファイル名
  type: DocumentType;      // ドキュメントの種類
  finalProduct: string;    // 最終製品名
  challenge: string;       // 課題感
  ingredients: string;     // 使用原料
  company: string;         // 提案企業（顧客）
  assignee: string;        // 開発担当者
  trialId?: string;        // 試作ID（オプショナル）
  updatedAt: string;       // 更新日時
  thumbnailUrl?: string;   // サムネイル画像のURL（オプショナル）
  fileUrl: string;         // ファイルのダウンロードURL
}

// 検索フィルターの構造（全てオプショナル）
export interface SearchFilters {
  finalProduct?: string;
  challenge?: string;
  ingredients?: string;
  company?: string;
  assignee?: string;
  trialId?: string;
}
