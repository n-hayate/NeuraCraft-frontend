"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { UsageRankingItem } from "@/types/files";

interface UsagePieChartProps {
  data: UsageRankingItem[];
}

// 視認性を高めたカラーパレット（青、ティール、紫、オレンジ、ピンク系）
const COLORS = ["#2563EB", "#0D9488", "#7C3AED", "#EA580C", "#DB2777"];

export const UsagePieChart = ({ data }: UsagePieChartProps) => {
  // データの降順（多い順）にソート
  const sortedData = [...data].sort(
    (a, b) => Number(b.count) - Number(a.count)
  );

  // 凡例用のデータを明示的に作成（表示順序を固定するため）
  const legendPayload = sortedData.map((item, index) => ({
    value: item.name,
    type: "circle" as const,
    id: item.name,
    color: COLORS[index % COLORS.length],
    // formatterで利用するためのペイロード
    payload: {
      ...item,
      count: item.count,
      fill: COLORS[index % COLORS.length],
    },
  }));

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-full">
      <h3 className="text-gray-800 text-lg font-semibold mb-6">最終製品</h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={0}
              dataKey="count"
              nameKey="name"
              stroke="none"
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E2E8F0",
                color: "#0F172A",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "#0F172A" }}
            />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{ color: "#64748B" }}
              payload={legendPayload}
              formatter={(value, entry: any) => {
                const { payload } = entry;
                // 全体の合計を計算してパーセンテージを表示
                const total = sortedData.reduce(
                  (sum, item) => sum + Number(item.count),
                  0
                );
                const percent = Math.round(
                  (Number(payload.count) / total) * 100
                );
                return (
                  <span className="text-gray-600 ml-2">
                    {value}{" "}
                    <span className="text-gray-400 ml-1">{percent}%</span>
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
