"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendDataItem } from "@/types/files";

interface RegistrationTrendChartProps {
  data: TrendDataItem[];
}

export const RegistrationTrendChart = ({
  data,
}: RegistrationTrendChartProps) => {
  // 日付をMM/DD形式に変換
  const formattedData = data.map((item) => ({
    ...item,
    dateLabel: new Date(item.date).toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-full">
      <h3 className="text-gray-800 text-lg font-semibold mb-6">
        登録件数推移
      </h3>

      {formattedData.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          データがありません
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="dateLabel"
                stroke="#64748B"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#64748B" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#E2E8F0",
                  color: "#0F172A",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: "#64748B", fontWeight: "bold" }}
                itemStyle={{ color: "#0F172A" }}
                formatter={(value: number) => [`${value}件`, "登録数"]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ fill: "#2563EB", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

