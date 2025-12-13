import { apiClient } from "./client";
import { AIAnalysisRequest, AIAnalysisResponse } from "@/types/ai";

// AI分析APIの関数をまとめたオブジェクト
export const aiApi = {
  // AI分析を実行
  analyze: async (request: AIAnalysisRequest) => {
    const response = await apiClient.post<AIAnalysisResponse>(
      "/ai/analyze",
      request,
      {
        timeout: 150000, // AI分析APIは150秒のタイムアウトを設定（バックエンドのLLMタイムアウト120秒 + 余裕）
      }
    );
    return response.data;
  },
};




