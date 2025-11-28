import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  subText?: string;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, subText }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-gray-900">
      <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold tracking-tight text-gray-900">
          {value}
        </span>
        {subText && (
          <span className="text-emerald-600 text-sm font-medium mb-1.5">
            {subText}
          </span>
        )}
      </div>
    </div>
  );
};
