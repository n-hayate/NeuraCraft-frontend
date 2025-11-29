"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { IngredientRankingItem } from "@/types/files";

interface IngredientBarChartProps {
  data: IngredientRankingItem[];
}

export const IngredientBarChart = ({ data }: IngredientBarChartProps) => {
  // データの並び順を反転（Rechartsの横棒グラフは下から順に描画されるため）
  // また、上位10件に絞るなどの処理が必要ならここで行う
  const chartData = [...data].slice(0, 10);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-full">
      <h3 className="text-gray-800 text-lg font-semibold mb-6">
        原材料
      </h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#E2E8F0"
            />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#64748B", fontSize: 12 }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "#F1F5F9", opacity: 1 }}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E2E8F0",
                color: "#0F172A",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
              {chartData.map((entry, index) => (
                // カラフルな配色に変更
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(217, 91%, ${60 - index * 3}%)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
