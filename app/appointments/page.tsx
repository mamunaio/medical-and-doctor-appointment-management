"use client";

import React from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { Calendar, Plus, Search, Filter } from "lucide-react";

export default function Appointments() {
  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Appointments" />
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
              <Calendar className="w-6 h-6 text-medical-blue" />
              Appointment Scheduling
            </h2>
            <button className="bg-medical-blue text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-medical-blue/20 hover:scale-105 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" /> Book Appointment
            </button>
          </div>
          
          <div className="bg-white p-20 rounded-3xl border border-border-hms text-center">
            <Calendar className="w-16 h-16 text-gray-100 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Appointments module coming soon</h3>
          </div>
        </main>
      </div>
    </div>
  );
}
