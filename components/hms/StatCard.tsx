"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "green" | "blue" | "purple" | "amber" | "teal" | "red";
  trend?: string;
  trendUp?: boolean;
}

const colorMap = {
  green: "bg-medical-green text-medical-green",
  blue: "bg-medical-blue text-medical-blue",
  purple: "bg-purple-hms text-purple-hms",
  amber: "bg-warning-amber text-warning-amber",
  teal: "bg-teal-hms text-teal-hms",
  red: "bg-emergency-red text-emergency-red",
};

export default function StatCard({ label, value, icon: Icon, color, trend, trendUp }: StatCardProps) {
  const [bgClass, textClass] = colorMap[color].split(" ");

  return (
    <div className="bg-white p-6 rounded-2xl border border-border-hms hover:shadow-lg hover:shadow-gray-200/50 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", bgClass.replace("bg-", "bg-") + "/10")}>
          <Icon className={cn("w-6 h-6", textClass)} />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
        <p className="text-2xl font-bold text-gray-900 group-hover:text-medical-green transition-colors">{value}</p>
      </div>
    </div>
  );
}
