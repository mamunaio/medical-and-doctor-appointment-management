"use client";

import React from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { UserRound } from "lucide-react";

export default function Doctors() {
  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Doctor Management" />
        <main className="p-6">
          <div className="bg-white p-20 rounded-3xl border border-border-hms text-center">
            <UserRound className="w-16 h-16 text-gray-100 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Doctors module coming soon</h3>
          </div>
        </main>
      </div>
    </div>
  );
}
