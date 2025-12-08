"use client";

import React from "react";
import { DownloadRankingItem } from "@/types/files";

interface DownloadRankingListProps {
  data: DownloadRankingItem[];
}

export const DownloadRankingList = ({ data }: DownloadRankingListProps) => {
  // Top3のみ表示
  const top3Data = data.slice(0, 3);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-full">
      <h3 className="text-gray-800 text-lg font-semibold mb-6">
        先週のダウンロード数Top3
      </h3>

      {top3Data.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          データがありません
        </div>
      ) : (
        <div className="space-y-4">
          {top3Data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0
                      ? "bg-yellow-500"
                      : index === 1
                      ? "bg-gray-400"
                      : "bg-amber-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{item.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-900 font-bold text-lg">
                  {item.count.toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs">回</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

