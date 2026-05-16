"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  CreditCard, 
  FileText, 
  History, 
  ShieldCheck, 
  Search, 
  Plus, 
  Printer, 
  Download, 
  Trash2,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "new", label: "New Bill", icon: Plus },
  { id: "list", label: "Invoice List", icon: FileText },
  { id: "payment", label: "Payments", icon: CreditCard },
  { id: "insurance", label: "Insurance Claims", icon: ShieldCheck },
];

export default function Billing() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Billing & Payments" />
        
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

          {activeTab === "new" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-border-hms shadow-sm">
                  <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
                    <Plus className="w-6 h-6 text-purple-hms" />
                    Create New Invoice
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Search Patient</label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-10 pr-4 text-sm font-black focus:ring-2 focus:ring-purple-hms outline-none" placeholder="Name or ID..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Visit Reference</label>
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-4 text-sm font-black focus:ring-2 focus:ring-purple-hms outline-none appearance-none">
                        <option>OPD Consultation (16 May)</option>
                        <option>Lab Order #9921</option>
                        <option>Pharmacy #7890</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-6 gap-4 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                      <div className="col-span-3">Service Description</div>
                      <div className="text-center">Qty</div>
                      <div className="text-right">Price</div>
                      <div className="text-right">Total</div>
                    </div>
                    {[
                      { desc: "Consultation Fee (Dr. Akram)", qty: 1, price: 800 },
                      { desc: "CBC Lab Test", qty: 1, price: 450 },
                      { desc: "Lipid Profile", qty: 1, price: 1200 },
                      { desc: "Registration Charge", qty: 1, price: 200 },
                    ].map((item, i) => (
                      <div key={i} className="grid grid-cols-6 gap-4 px-4 py-3 items-center group">
                        <div className="col-span-3">
                          <p className="text-sm font-bold text-gray-900">{item.desc}</p>
                          <p className="text-[10px] text-gray-400 font-medium italic">Service Code: SVC-0{i+1}</p>
                        </div>
                        <div className="text-center font-black text-gray-900 text-sm">{item.qty}</div>
                        <div className="text-right font-bold text-gray-500 text-sm">৳{item.price}</div>
                        <div className="text-right font-black text-gray-900 text-sm">৳{item.price * item.qty}</div>
                      </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-purple-hms hover:border-purple-hms transition-all mt-4 text-xs uppercase tracking-widest">
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Discount (%)</label>
                        <input type="number" className="w-24 bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-black focus:ring-2 focus:ring-purple-hms" defaultValue="0" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                          {["Cash", "Card", "bKash"].map(m => (
                            <button key={m} className={cn(
                              "py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                              m === "Cash" ? "bg-purple-hms text-white border-purple-hms shadow-lg shadow-purple-hms/20" : "bg-white text-gray-500 border-gray-100 hover:border-purple-hms"
                            )}>{m}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-80 bg-gray-50 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-bold">Subtotal</span>
                        <span className="text-gray-900 font-black">৳2,650</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-bold">Discount (0%)</span>
                        <span className="text-gray-900 font-black">-৳0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-bold">Tax (0%)</span>
                        <span className="text-gray-900 font-black">৳0</span>
                      </div>
                      <div className="h-px bg-gray-200 my-2"></div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-gray-900 font-black uppercase tracking-widest text-xs">Grand Total</span>
                        <span className="text-3xl font-black text-purple-hms">৳2,650</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-10 bg-purple-hms text-white font-black py-4 rounded-xl shadow-lg shadow-purple-hms/20 hover:scale-[1.01] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-5 h-5" /> Generate Invoice
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Patient Overview</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" className="w-full h-full object-cover" alt="Patient" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-gray-900 leading-tight">John Doe</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">PAT-2024-00248</p>
                    </div>
                  </div>
                  <div className="bg-purple-hms/5 border border-purple-hms/10 p-4 rounded-xl mb-4">
                    <p className="text-[10px] font-black text-purple-hms uppercase tracking-widest mb-1">Total Due Amount</p>
                    <p className="text-2xl font-black text-purple-hms">৳4,200</p>
                  </div>
                  <button className="w-full py-3 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">View Billing History</button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm overflow-hidden">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Quick Collect</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Enter Amount</p>
                      <input type="number" className="w-full bg-white border-none rounded-xl py-3 px-4 text-xl font-black text-gray-900 focus:ring-2 focus:ring-purple-hms" placeholder="0.00" />
                    </div>
                    <button className="w-full bg-medical-green text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-medical-green/20">Collect Payment</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "list" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white rounded-2xl border border-border-hms overflow-hidden">
                <div className="p-6 border-b border-border-hms flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search invoices or patients..." className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-hms" />
                  </div>
                  <div className="flex gap-2">
                    <select className="bg-gray-50 border-none rounded-xl py-2.5 px-4 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-purple-hms">
                      <option>All Status</option>
                      <option>Paid</option>
                      <option>Unpaid</option>
                      <option>Partial</option>
                    </select>
                    <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice #</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Due</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { id: "INV-2024-001", patient: "Abul Kashem", date: "16 May 2024", total: "৳2,650", paid: "৳2,650", due: "৳0", status: "Paid", color: "green" },
                        { id: "INV-2024-002", patient: "Rahima Khatun", date: "15 May 2024", total: "৳12,400", paid: "৳5,000", due: "৳7,400", status: "Partial", color: "amber" },
                        { id: "INV-2024-003", patient: "John Doe", date: "14 May 2024", total: "৳4,200", paid: "৳0", due: "৳4,200", status: "Unpaid", color: "red" },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-all group">
                          <td className="px-6 py-5 text-sm font-black text-gray-900">{row.id}</td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-gray-900">{row.patient}</p>
                            <p className="text-[10px] text-gray-400 font-medium">ID: PAT-X45</p>
                          </td>
                          <td className="px-6 py-5 text-xs text-gray-500 font-bold">{row.date}</td>
                          <td className="px-6 py-5 text-sm font-black text-gray-900">{row.total}</td>
                          <td className="px-6 py-5 text-sm font-bold text-medical-green">{row.paid}</td>
                          <td className="px-6 py-5 text-sm font-bold text-emergency-red">{row.due}</td>
                          <td className="px-6 py-5">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              row.color === "green" && "bg-medical-green/10 text-medical-green",
                              row.color === "amber" && "bg-warning-amber/10 text-warning-amber",
                              row.color === "red" && "bg-emergency-red/10 text-emergency-red"
                            )}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors">
                                <Printer className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
