"use client";

import React from "react";
import { IssueWordCloud } from "@/types/files";

interface KeywordCloudProps {
  data: IssueWordCloud;
}

export const KeywordCloud = ({ data }: KeywordCloudProps) => {
  // データを配列に変換してソート
  const words = Object.entries(data).map(([text, value]) => ({ text, value }));

  // 最大値と最小値を取得（フォントサイズの計算用）
  const maxValue = Math.max(...words.map((w) => w.value));
  const minValue = Math.min(...words.map((w) => w.value));

  // フォントサイズを計算する関数 (12px - 32pxの範囲)
  const getFontSize = (value: number) => {
    if (maxValue === minValue) return 16;
    const size = 12 + ((value - minValue) / (maxValue - minValue)) * 24;
    return `${Math.round(size)}px`;
  };

  // 色を計算する関数
  const getColor = (value: number) => {
    // 頻度が高いほど目立つ色（赤・オレンジ系）、中間は緑・青系、低いほどグレー
    // 閾値を下げて、より多くの色が使われるようにする
    if (value > maxValue * 0.7) return "#DC2626"; // red-600 (高頻度)
    if (value > maxValue * 0.5) return "#EA580C"; // orange-600
    if (value > maxValue * 0.35) return "#F59E0B"; // amber-500
    if (value > maxValue * 0.25) return "#10B981"; // emerald-500
    if (value > maxValue * 0.15) return "#0D9488"; // teal-600
    if (value > maxValue * 0.08) return "#2563EB"; // blue-600
    if (value > maxValue * 0.04) return "#6366F1"; // indigo-500
    return "#64748B"; // slate-500 (低頻度)
  };

  // ランダムな配置のためにシャッフル（簡易的）
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-gray-900">
      <h3 className="text-gray-800 text-lg font-semibold mb-6">
        課題感
      </h3>

      <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px] p-4 bg-gray-50 rounded-lg border border-gray-100">
        {shuffledWords.map((word) => (
          <span
            key={word.text}
            style={{
              fontSize: getFontSize(word.value),
              color: getColor(word.value),
              opacity: 0.9,
            }}
            className="font-bold cursor-default hover:opacity-100 transition-opacity duration-200"
            title={`${word.text}: ${word.value}件`}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
};
