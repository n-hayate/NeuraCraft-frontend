import { apiClient } from "./client";
import { AIAnalysisRequest, AIAnalysisResponse } from "@/types/ai";

// AI分析APIの関数をまとめたオブジェクト
export const aiApi = {
  // AI分析を実行
  analyze: async (request: AIAnalysisRequest) => {
    const response = await apiClient.post<AIAnalysisResponse>(
      "/ai/analyze",
      request
    );
    return response.data;
  },
};




