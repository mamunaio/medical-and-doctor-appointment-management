"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { useEmergencyStore } from "@/lib/store/useEmergencyStore";
import { 
  AlertTriangle, 
  Activity, 
  UserPlus, 
  Bed, 
  Bell, 
  Clock, 
  MoreVertical,
  Plus,
  ShieldAlert,
  Ambulance,
  ChevronRight,
  FlaskConical,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Emergency() {
  const { intakes, removeIntake } = useEmergencyStore();
  const [activeTab, setActiveTab] = useState("queue");

  return (
    <div className="flex min-h-screen bg-red-50/30">
      {/* Sidebar with red accent for emergency */}
      <div className="relative group">
        <HMSSidebar />
        <div className="absolute top-0 right-0 w-1 h-full bg-emergency-red"></div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Emergency Department" />
        
        <main className="p-6 space-y-6">
          {/* Top KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Emergency", val: String(intakes.length), color: "red", sub: `${intakes.filter(it => it.priority === 'Critical').length} Critical` },
              { label: "Ambulance Incoming", val: "3", color: "blue", sub: "10-15 mins" },
              { label: "ER Bed Availability", val: "4 / 20", color: "amber", sub: "Severe Shortage" },
              { label: "Avg Triage Time", val: "4.5m", color: "green", sub: "Within limit" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm shadow-red-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={cn(
                  "text-3xl font-black mb-1",
                  stat.color === "red" && "text-emergency-red",
                  stat.color === "blue" && "text-medical-blue",
                  stat.color === "amber" && "text-warning-amber",
                  stat.color === "green" && "text-medical-green",
                )}>{stat.val}</p>
                <p className="text-[10px] font-bold text-gray-500 italic">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left - Emergency Queue */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-red-50 flex items-center justify-between">
                <h3 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest text-sm">
                  <Activity className="w-5 h-5 text-emergency-red" />
                  Live Emergency Queue
                </h3>
                <div className="flex gap-2">
                  <span className="bg-red-50 text-emergency-red px-3 py-1 rounded-full text-[10px] font-black border border-red-100">🔴 Critical: {intakes.filter(it => it.priority === 'Critical').length}</span>
                  <span className="bg-amber-50 text-warning-amber px-3 py-1 rounded-full text-[10px] font-black border border-amber-100">🟡 Urgent: {intakes.filter(it => it.priority === 'Urgent').length}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-red-50/30">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Token</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Triage</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Patient</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Complaint</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-50">
                    {intakes.map((row) => (
                      <tr key={row.id} className={cn(
                        "hover:bg-red-50/50 transition-all group",
                        row.priority === "Critical" && "bg-red-50/20"
                      )}>
                        <td className="px-6 py-5 font-black text-gray-900 text-sm">{row.id}</td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            row.priority === "Critical" && "bg-emergency-red text-white border-emergency-red animate-pulse",
                            row.priority === "Urgent" && "bg-warning-amber/10 text-warning-amber border-warning-amber/20",
                            (row.priority === "Stable" || row.priority === "Minor") && "bg-medical-green/10 text-medical-green border-medical-green/20"
                          )}>
                            {row.priority}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-gray-900">{row.name}</p>
                          <p className="text-[10px] text-gray-400">Time: {row.time}</p>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-gray-600 max-w-xs truncate">{row.complaint}</td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-gray-900">{row.status}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => removeIntake(row.id)}
                            className="p-2 hover:bg-red-50 rounded-lg text-gray-300 hover:text-emergency-red transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right - Emergency Bed Status & Quick Reg */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                    <Bed className="w-4 h-4 text-emergency-red" />
                    ER Bed Grid
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400">Total: 20 Beds</span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const status = i < 12 ? 'occupied' : i < 16 ? 'available' : 'cleaning';
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold border-2 transition-all cursor-pointer relative group",
                          status === 'occupied' && "bg-emergency-red text-white border-emergency-red",
                          status === 'available' && "bg-white text-medical-green border-medical-green/20 hover:border-medical-green",
                          status === 'cleaning' && "bg-warning-amber/10 text-warning-amber border-warning-amber/20"
                        )}
                      >
                        {i + 1}
                        {status === 'occupied' && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                        <div className="absolute inset-0 bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 text-center transition-opacity z-10">
                          {status === 'occupied' ? 'PAT-42' : status === 'available' ? 'Empty' : 'Cleaning'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emergency-red to-red-800 rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Ambulance className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6" />
                  Quick Registration
                </h3>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">Save time, save life. Register patient in 30 seconds.</p>
                <div className="space-y-4">
                  <input type="text" placeholder="Patient Name (Unknown if unconscious)" className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-sm placeholder:text-white/40 focus:bg-white/20 outline-none transition-all" />
                  <div className="grid grid-cols-2 gap-4">
                    <select className="bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-sm focus:bg-white/20 outline-none transition-all appearance-none">
                      <option className="text-gray-900">Male</option>
                      <option className="text-gray-900">Female</option>
                    </select>
                    <input type="text" placeholder="Age" className="bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-sm placeholder:text-white/40 focus:bg-white/20 outline-none transition-all" />
                  </div>
                  <button className="w-full bg-white text-emergency-red py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl shadow-black/20">
                    Register Now
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emergency-red" />
                  ER Alerts
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4 p-3 bg-red-50 border border-red-100 rounded-xl animate-pulse">
                    <div className="w-10 h-10 bg-emergency-red text-white rounded-lg flex items-center justify-center shrink-0">
                      <Ambulance className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-emergency-red uppercase">Ambulance Incoming</p>
                      <p className="text-[10px] text-red-600 font-bold">ETA: 5 mins • Trauma Case</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="w-10 h-10 bg-medical-blue text-white rounded-lg flex items-center justify-center shrink-0">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-medical-blue uppercase">Critical Lab Result</p>
                      <p className="text-[10px] text-blue-600 font-bold">Patient: Abul Kalam • Troponin High</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
