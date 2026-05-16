"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  FlaskConical, 
  ClipboardList, 
  FileText, 
  Settings, 
  Search, 
  Filter, 
  MoreVertical,
  Plus,
  Beaker,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "orders", label: "Lab Orders", icon: ClipboardList },
  { id: "entry", label: "Result Entry", icon: Beaker },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "catalog", label: "Test Catalog", icon: Settings },
];

export default function Laboratory() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Diagnostic Laboratory" />
        
        <main className="p-6">
          <div className="bg-white p-2 rounded-2xl border border-border-hms flex gap-2 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 min-w-[150px] flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-teal-hms text-white shadow-lg shadow-teal-hms/20" 
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Pending Samples", val: "২৪", color: "amber" },
                  { label: "Processing", val: "১২", color: "blue" },
                  { label: "Ready Reports", val: "৩৮", color: "green" },
                  { label: "Urgent (STAT)", val: "০৫", color: "red" },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className={cn(
                      "text-3xl font-black",
                      s.color === "amber" && "text-warning-amber",
                      s.color === "blue" && "text-medical-blue",
                      s.color === "green" && "text-medical-green",
                      s.color === "red" && "text-emergency-red",
                    )}>{s.val}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-border-hms overflow-hidden">
                <div className="p-6 border-b border-border-hms flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search orders or patients..." className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-hms" />
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-gray-50 text-gray-600 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-100 flex items-center gap-2">
                      <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="bg-teal-hms text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-teal-hms/20">
                      Collect Sample
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tests Ordered</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { id: "ORD-9921", patient: "Abul Kashem", tests: "CBC, Lipid Profile", priority: "Routine", time: "1h ago", status: "Pending", color: "amber" },
                        { id: "ORD-9922", patient: "Rahima Khatun", tests: "Troponin-I, ECG", priority: "Urgent", time: "15m ago", status: "Sample Collected", color: "blue" },
                        { id: "ORD-9923", patient: "Zubair Ahmed", tests: "RBS, Serum Creatinine", priority: "Routine", time: "2h ago", status: "Processing", color: "purple" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-all group">
                          <td className="px-6 py-5 text-sm font-black text-gray-900">{row.id}</td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-gray-900">{row.patient}</p>
                            <p className="text-[10px] text-gray-400 font-medium">OPD ID: PAT-X45</p>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-600 font-medium">{row.tests}</td>
                          <td className="px-6 py-5">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              row.priority === "Urgent" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                            )}>
                              {row.priority}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-xs text-gray-400 font-bold">{row.time}</td>
                          <td className="px-6 py-5">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              row.status === "Pending" && "bg-warning-amber/10 text-warning-amber",
                              row.status === "Sample Collected" && "bg-medical-blue/10 text-medical-blue",
                              row.status === "Processing" && "bg-purple-hms/10 text-purple-hms",
                            )}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button className="text-xs font-black text-teal-hms hover:underline uppercase tracking-widest">
                              Collect Sample
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

          {activeTab === "entry" && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-8 rounded-3xl border border-border-hms shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Result Entry</h2>
                  <div className="bg-teal-hms/5 px-4 py-2 rounded-xl border border-teal-hms/10 flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID:</span>
                    <span className="text-sm font-black text-teal-hms">ORD-9921</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</p>
                    <p className="text-lg font-black text-gray-900">Abul Kashem (32Y/M)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Test Name</p>
                    <p className="text-lg font-black text-teal-hms">Complete Blood Count (CBC)</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 rounded-lg">
                    <div className="col-span-1">Parameter</div>
                    <div>Value</div>
                    <div>Unit</div>
                    <div>Normal Range</div>
                  </div>
                  {[
                    { p: "Hemoglobin", u: "g/dL", r: "13.5 - 17.5", val: "14.2" },
                    { p: "RBC Count", u: "million/uL", r: "4.5 - 5.5", val: "4.8" },
                    { p: "White Blood Cells", u: "/uL", r: "4000 - 11000", val: "12500", high: true },
                    { p: "Platelets", u: "/uL", r: "1.5L - 4.5L", val: "2.1L" },
                  ].map((item, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3 items-center border-b border-gray-100 last:border-0 group hover:bg-gray-50 transition-colors">
                      <div className="text-sm font-bold text-gray-900">{item.p}</div>
                      <div>
                        <input 
                          type="text" 
                          defaultValue={item.val} 
                          className={cn(
                            "w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm font-black focus:ring-2 focus:ring-teal-hms outline-none",
                            item.high && "text-red-600 border-red-200 bg-red-50"
                          )}
                        />
                      </div>
                      <div className="text-xs font-bold text-gray-400 uppercase">{item.u}</div>
                      <div className="text-xs font-bold text-gray-500">{item.r}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-widest">Lab Interpretation / Notes</label>
                  <textarea className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-teal-hms h-24 resize-none" placeholder="Enter comments about patient's results here..."></textarea>
                </div>

                <div className="flex gap-4 mt-10">
                  <button className="flex-1 bg-white border-2 border-gray-100 text-gray-600 font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-gray-50 transition-all">Save Draft</button>
                  <button className="flex-[2] bg-teal-hms text-white font-black py-4 rounded-xl shadow-lg shadow-teal-hms/20 hover:scale-[1.01] transition-all uppercase tracking-widest text-xs">Save & Publish Result</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm group hover:border-teal-hms transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-hms/10 text-teal-hms rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-medical-green bg-medical-green/10 px-2 py-1 rounded-full uppercase">Ready</span>
                  </div>
                  <h4 className="text-lg font-black text-gray-900 mb-1">Complete Blood Count</h4>
                  <p className="text-xs text-gray-500 mb-4">Patient: Fatema Begum • 16 May</p>
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <button className="text-xs font-black text-teal-hms flex items-center gap-2 hover:underline">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button className="text-xs font-black text-gray-400 flex items-center gap-2 hover:text-gray-900">
                      <Download className="w-4 h-4" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
