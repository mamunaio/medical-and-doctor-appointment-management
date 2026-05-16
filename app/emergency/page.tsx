"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
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
  FlaskConical
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Emergency() {
  const [activeTab, setActiveTab] = useState("queue");

  return (
    <div className="flex min-h-screen bg-red-50/30">
      {/* Sidebar with red accent for emergency */}
      <div className="relative group">
        <HMSSidebar />
        <div className="absolute top-0 right-0 w-1 h-full bg-emergency-red"></div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-emergency-red/20 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm shadow-red-100/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emergency-red rounded-xl flex items-center justify-center animate-pulse">
              <AlertTriangle className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-emergency-red uppercase tracking-tighter">Emergency Department</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Monitoring</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-emergency-red text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emergency-red/20 hover:scale-105 transition-all">
              <Plus className="w-5 h-5" /> New Emergency Patient
            </button>
            <div className="p-2 bg-gray-50 rounded-xl relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emergency-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">3</span>
            </div>
          </div>
        </header>
        
        <main className="p-6 space-y-6">
          {/* Top KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Emergency", val: "12", color: "red", sub: "5 Critical" },
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
                  <span className="bg-red-50 text-emergency-red px-3 py-1 rounded-full text-[10px] font-black border border-red-100">🔴 Critical: 3</span>
                  <span className="bg-amber-50 text-warning-amber px-3 py-1 rounded-full text-[10px] font-black border border-amber-100">🟡 Urgent: 5</span>
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
                    {[
                      { token: "ER-045", triage: "Critical", patient: "Unknown (Male, ~30y)", complaint: "Road Accident, Severe Bleeding", status: "In Surgery", color: "red" },
                      { token: "ER-046", triage: "Critical", patient: "Abul Kalam", complaint: "Cardiac Arrest", status: "In Resuscitation", color: "red" },
                      { token: "ER-047", triage: "Urgent", patient: "Mina Akter", complaint: "High Fever & Seizure", status: "Waiting", color: "amber" },
                      { token: "ER-048", triage: "Non-urgent", patient: "Sujon Ahmed", complaint: "Minor Burn", status: "Waiting", color: "green" },
                    ].map((row, i) => (
                      <tr key={i} className={cn(
                        "hover:bg-red-50/50 transition-all group",
                        row.triage === "Critical" && "bg-red-50/20"
                      )}>
                        <td className="px-6 py-5 font-black text-gray-900 text-sm">{row.token}</td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                            row.color === "red" && "bg-emergency-red text-white border-emergency-red animate-pulse",
                            row.color === "amber" && "bg-warning-amber/10 text-warning-amber border-warning-amber/20",
                            row.color === "green" && "bg-medical-green/10 text-medical-green border-medical-green/20"
                          )}>
                            {row.triage}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-gray-900">{row.patient}</p>
                          <p className="text-[10px] text-gray-400">Time: 12:30 PM</p>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-gray-600 max-w-xs truncate">{row.complaint}</td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-gray-900">{row.status}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors">
                            <MoreVertical className="w-4 h-4" />
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
