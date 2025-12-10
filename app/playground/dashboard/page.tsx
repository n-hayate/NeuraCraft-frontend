"use client";

import React, { useEffect, useState } from "react";
import { FileText, Plus, Download, BarChart3 } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DownloadRankingList } from "@/components/dashboard/DownloadRankingList";
import { RegistrationTrendChart } from "@/components/dashboard/RegistrationTrendChart";
import { KeywordCloud } from "@/components/dashboard/KeywordCloud";
import { DashboardResponse } from "@/types/files";
import { filesApi } from "@/api/files";

export default function DashboardPlaygroundPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await filesApi.getDashboard();
        setData(response);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          "データの取得に失敗しました。ログイン状態を確認してください。"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-xl font-bold mb-2">エラー</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <AppHeader
        title="ダッシュボード"
        icon={
          <div className="w-10 h-10 bg-[#FFCB06] rounded-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
        }
      />

      <div className="p-8 text-gray-900 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* フィルター（期間のみ） */}
          <div className="flex justify-end gap-4">
            <div className="bg-white border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-700 flex items-center gap-2 shadow-sm">
              <span>2024年1月 - 2024年6月</span>
              <span className="text-gray-400">📅</span>
            </div>
          </div>

        {/* 統計カードセクション */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="今月の新規登録数"
            value={data.new_files_last_month.toLocaleString()}
            icon={<Plus />}
          />
          <StatCard
            title="今月のダウンロード数"
            value={data.downloads_this_month.toLocaleString()}
            icon={<Download />}
          />
          <StatCard
            title="総登録件数"
            value={data.total_files.toLocaleString()}
            icon={<FileText />}
          />
        </div>

        {/* リストとグラフセクション */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <DownloadRankingList data={data.top_downloads_last_week} />
          </div>
          <div>
            <RegistrationTrendChart data={data.registration_trend} />
          </div>
        </div>

          {/* ワードインプレッション */}
          <div className="h-[300px]">
            <KeywordCloud data={data.issue_word_cloud} />
          </div>
        </div>
      </div>
    </div>
  );
}
