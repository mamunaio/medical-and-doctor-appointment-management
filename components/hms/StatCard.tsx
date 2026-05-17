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

const themeMap = {
  green: {
    border: "border-t-medical-green",
    bg: "bg-medical-green/10 text-medical-green",
    text: "text-medical-green",
    gradient: "group-hover:from-medical-green group-hover:to-teal-600",
    shadow: "group-hover:shadow-medical-green/5",
    glow: "bg-medical-green",
  },
  blue: {
    border: "border-t-medical-blue",
    bg: "bg-medical-blue/10 text-medical-blue",
    text: "text-medical-blue",
    gradient: "group-hover:from-medical-blue group-hover:to-indigo-600",
    shadow: "group-hover:shadow-medical-blue/5",
    glow: "bg-medical-blue",
  },
  purple: {
    border: "border-t-purple-hms",
    bg: "bg-purple-hms/10 text-purple-hms",
    text: "text-purple-hms",
    gradient: "group-hover:from-purple-hms group-hover:to-pink-600",
    shadow: "group-hover:shadow-purple-hms/5",
    glow: "bg-purple-hms",
  },
  amber: {
    border: "border-t-warning-amber",
    bg: "bg-warning-amber/10 text-warning-amber",
    text: "text-warning-amber",
    gradient: "group-hover:from-warning-amber group-hover:to-orange-500",
    shadow: "group-hover:shadow-warning-amber/5",
    glow: "bg-warning-amber",
  },
  teal: {
    border: "border-t-teal-hms",
    bg: "bg-teal-hms/10 text-teal-hms",
    text: "text-teal-hms",
    gradient: "group-hover:from-teal-hms group-hover:to-emerald-600",
    shadow: "group-hover:shadow-teal-hms/5",
    glow: "bg-teal-hms",
  },
  red: {
    border: "border-t-emergency-red",
    bg: "bg-emergency-red/10 text-emergency-red",
    text: "text-emergency-red",
    gradient: "group-hover:from-emergency-red group-hover:to-rose-600",
    shadow: "group-hover:shadow-emergency-red/5",
    glow: "bg-emergency-red",
  },
};

export default function StatCard({ label, value, icon: Icon, color, trend, trendUp }: StatCardProps) {
  const theme = themeMap[color];

  return (
    <div className={cn(
      "bg-white p-6 rounded-2xl border border-border-hms border-t-4 shadow-xl shadow-gray-100/40 hover:shadow-2xl hover:border-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden",
      theme.border,
      theme.shadow
    )}>
      
      {/* Decorative Radial Backdrop Glow */}
      <div className={cn(
        "absolute -right-6 -bottom-6 w-24 h-24 rounded-full filter blur-xl opacity-0 group-hover:opacity-20 transition-all duration-500 pointer-events-none",
        theme.glow
      )} />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6", theme.bg)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider",
            trendUp 
              ? "bg-green-50 text-green-700 border border-green-100" 
              : "bg-red-50 text-red-700 border border-red-100"
          )}>
            {trend}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</h3>
        <p className={cn(
          "text-2xl font-black text-gray-900 transition-all duration-300 bg-gradient-to-r bg-clip-text text-transparent bg-none bg-gray-900",
          theme.gradient
        )}>
          {value}
        </p>
      </div>
    </div>
  );
}
