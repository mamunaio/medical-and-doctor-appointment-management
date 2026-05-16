"use client";

import React from "react";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  AlertCircle,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HMSHeaderProps {
  title: string;
}

export default function HMSHeader({ title }: HMSHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-border-hms sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-gray-500">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medical-green" />
          <input 
            type="text" 
            placeholder="Search patients, doctors, appointments..."
            className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-medical-green transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-emergency-red/10 hover:bg-emergency-red text-emergency-red hover:text-white px-4 py-2 rounded-xl transition-all group">
          <AlertCircle className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Emergency</span>
        </button>

        <div className="relative cursor-pointer group">
          <div className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-medical-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              5
            </span>
          </div>
        </div>

        <div className="h-8 w-px bg-border-hms mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-border-hms flex items-center justify-center overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 group-hover:text-medical-green transition-colors flex items-center gap-1">
              Dr. Sarah Johnson
              <ChevronDown className="w-4 h-4" />
            </p>
            <p className="text-xs text-gray-500">Chief Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
