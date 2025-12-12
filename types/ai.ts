// AI分析APIの型定義

export interface AIAnalysisRequest {
  question: string; // 分析したい質問
  q?: string; // 検索キーワード
  sort_by?: string; // ソートキー（デフォルト: "updated_at_desc"）
  top?: number; // 分析に使用する上位N件（デフォルト: 5, 1-10の範囲）
}

export interface AIAnalysisResponse {
  answer: string; // LLMが生成した回答
  sources: string[]; // 参照したファイル名のリスト
  error?: string; // エラーメッセージ（エラー時のみ）
}




