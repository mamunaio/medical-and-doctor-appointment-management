"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  Bed, 
  Users, 
  UserPlus, 
  LogOut, 
  Search, 
  Filter, 
  MoreVertical,
  Activity,
  Plus,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "admissions", label: "Admitted Patients", icon: Users },
  { id: "beds", label: "Bed Management", icon: Bed },
  { id: "new", label: "New Admission", icon: UserPlus },
  { id: "discharge", label: "Discharge", icon: LogOut },
];

export default function IPDManagement() {
  const [activeTab, setActiveTab] = useState("admissions");

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="IPD (Inpatient) Management" />
        
        <main className="p-6">
          <div className="bg-white p-2 rounded-2xl border border-border-hms flex gap-2 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 min-w-[150px] flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-purple-hms text-white shadow-lg shadow-purple-hms/20" 
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "admissions" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white rounded-2xl border border-border-hms overflow-hidden">
                <div className="p-6 border-b border-border-hms flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search admitted patients..." className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-hms" />
                  </div>
                  <div className="flex items-center gap-3">
                    <select className="bg-gray-50 border-none rounded-xl py-2.5 px-4 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-purple-hms">
                      <option>All Wards</option>
                      <option>General Ward</option>
                      <option>ICU</option>
                      <option>Cabin</option>
                    </select>
                    <button className="bg-purple-hms text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-purple-hms/20 flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Admit Patient
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient / ID</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bed / Ward</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Doctor</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Admit Date</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Diagnosis</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { patient: "Abul Kashem", id: "PAT-2024-001", bed: "GW-12", ward: "General Ward", doctor: "Dr. Akram", date: "12 May 2024", diagnosis: "Severe Pneumonia", status: "Stable", color: "green" },
                        { patient: "Rahima Khatun", id: "PAT-2024-042", bed: "ICU-04", ward: "ICU", doctor: "Dr. Sarah", date: "14 May 2024", diagnosis: "Heart Failure", status: "Critical", color: "red" },
                        { patient: "Jamil Hossain", id: "PAT-2024-105", bed: "CB-08", ward: "Private Cabin", doctor: "Dr. Zaman", date: "15 May 2024", diagnosis: "Post-Surgery Recovery", status: "Stable", color: "green" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-all group">
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-gray-900">{row.patient}</p>
                            <p className="text-[10px] text-gray-400 font-medium">ID: {row.id}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-black text-purple-hms">{row.bed}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">{row.ward}</p>
                          </td>
                          <td className="px-6 py-5 text-sm font-bold text-gray-600">{row.doctor}</td>
                          <td className="px-6 py-5 text-sm text-gray-500">{row.date}</td>
                          <td className="px-6 py-5 text-sm font-medium text-gray-600 max-w-xs truncate">{row.diagnosis}</td>
                          <td className="px-6 py-5">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                              row.color === "green" && "bg-medical-green/10 text-medical-green",
                              row.color === "red" && "bg-emergency-red/10 text-emergency-red animate-pulse"
                            )}>
                              {row.status}
                            </span>
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
            </div>
          )}

          {activeTab === "beds" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Beds", val: "120", color: "gray" },
                  { label: "Occupied", val: "84", color: "red" },
                  { label: "Available", val: "26", color: "green" },
                  { label: "Cleaning/Maint.", val: "10", color: "amber" },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-border-hms flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                      <p className="text-3xl font-black text-gray-900">{s.val}</p>
                    </div>
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      s.color === "red" && "bg-emergency-red/10 text-emergency-red",
                      s.color === "green" && "bg-medical-green/10 text-medical-green",
                      s.color === "amber" && "bg-warning-amber/10 text-warning-amber",
                      s.color === "gray" && "bg-gray-100 text-gray-500",
                    )}>
                      <Bed className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-2xl border border-border-hms">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Visual Floor Plan - General Ward (GW)</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-medical-green"></div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emergency-red"></div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-warning-amber"></div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Cleaning</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const status = i % 5 === 0 ? "available" : i % 8 === 0 ? "cleaning" : "occupied";
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "aspect-[4/3] rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative group",
                          status === "available" && "border-medical-green/20 bg-medical-green/5 text-medical-green hover:bg-medical-green/10",
                          status === "occupied" && "border-emergency-red/20 bg-emergency-red/5 text-emergency-red hover:bg-emergency-red/10",
                          status === "cleaning" && "border-warning-amber/20 bg-warning-amber/5 text-warning-amber hover:bg-warning-amber/10",
                        )}
                      >
                        <Bed className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase">GW-{String(i + 1).padStart(2, '0')}</span>
                        {status === "occupied" && (
                          <div className="absolute inset-0 bg-black/80 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-1 text-center transition-opacity z-10">
                            <p className="text-[8px] text-white font-bold uppercase truncate w-full px-1">Rahim Uddin</p>
                            <p className="text-[7px] text-gray-400 font-bold uppercase">PAT-2024-X</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "new" && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-border-hms p-10 animate-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Inpatient Admission</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Search Patient</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-hms" placeholder="Name or ID..." />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Ward Type</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-purple-hms appearance-none">
                        <option>General Ward</option>
                        <option>ICU</option>
                        <option>Semi-Cabin</option>
                        <option>VVIP Cabin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Available Bed</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-purple-hms appearance-none">
                        <option>GW-12</option>
                        <option>GW-15</option>
                        <option>GW-18</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Admitting Doctor</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-purple-hms appearance-none">
                      <option>Dr. Akram Hossain</option>
                      <option>Dr. Sarah Johnson</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Admission Type</label>
                    <div className="flex gap-2">
                      {["Emergency", "Planned", "Transfer"].map(type => (
                        <button key={type} className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-purple-hms hover:text-purple-hms transition-all">
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Primary Diagnosis</label>
                    <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-hms h-32 resize-none" placeholder="Reason for admission..."></textarea>
                  </div>
                </div>
              </div>
              <button className="w-full mt-10 bg-purple-hms text-white font-black py-4 rounded-xl shadow-lg shadow-purple-hms/20 hover:scale-[1.01] transition-all uppercase tracking-widest">
                Confirm Admission
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
