"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  Pill, 
  Package, 
  PlusSquare, 
  Clock, 
  Search, 
  Filter, 
  MoreVertical,
  Plus,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Trash2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "dispense", label: "Dispense", icon: ShoppingCart },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "stock", label: "Stock Entry", icon: PlusSquare },
  { id: "expiry", label: "Expiry Tracker", icon: Clock },
];

export default function Pharmacy() {
  const [activeTab, setActiveTab] = useState("dispense");

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Pharmacy Management" />
        
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

          {activeTab === "dispense" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-border-hms shadow-sm">
                  <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
                    <Search className="w-6 h-6 text-teal-hms" />
                    Dispense Medicine
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Search Prescription #</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-4 text-sm font-black focus:ring-2 focus:ring-teal-hms outline-none" placeholder="RX-2024-XXXX" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Patient Name/ID</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-4 text-sm font-black focus:ring-2 focus:ring-teal-hms outline-none" placeholder="Search Patient..." />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Prescription Details</h3>
                      <span className="text-[10px] font-bold text-teal-hms bg-teal-hms/10 px-2 py-1 rounded-full uppercase">ID: RX-7890</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { name: "Tab. Sergel (20mg)", qty: "30", stock: 450, price: 7.5 },
                        { name: "Tab. Napa Extend", qty: "15", stock: 12, price: 2.0, low: true },
                        { name: "Ciprocin (500mg)", qty: "14", stock: 0, price: 15.0, out: true },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
                          <div className="flex-1">
                            <p className="text-sm font-black text-gray-900">{item.name}</p>
                            <div className="flex gap-4 mt-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase">Prescribed: {item.qty}</span>
                              <span className={cn(
                                "text-[10px] font-black uppercase",
                                item.out ? "text-emergency-red" : item.low ? "text-warning-amber" : "text-medical-green"
                              )}>
                                Stock: {item.stock}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-xs font-black text-gray-900">৳{(item.price * parseInt(item.qty)).toFixed(2)}</p>
                              <p className="text-[8px] text-gray-400 font-bold uppercase">৳{item.price} / unit</p>
                            </div>
                            <input type="number" defaultValue={item.out ? 0 : item.qty} className="w-16 bg-gray-50 border border-gray-100 rounded-lg py-2 px-2 text-center text-sm font-black focus:ring-2 focus:ring-teal-hms" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-teal-hms text-white p-6 rounded-2xl shadow-lg shadow-teal-hms/20">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Payable Amount</p>
                      <p className="text-3xl font-black">৳465.50</p>
                    </div>
                    <button className="bg-white text-teal-hms px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-xl">
                      <CheckCircle2 className="w-5 h-5" /> Confirm Dispense
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Patient Quick Info</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema" className="w-full h-full object-cover" alt="Patient" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-gray-900 leading-tight">Fatema Begum</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">PAT-2024-00108</p>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-4">
                    <div className="flex items-center gap-2 text-emergency-red mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Allergy Alert</span>
                    </div>
                    <p className="text-xs text-red-600 font-bold">Penicillin, Ibuprofen</p>
                  </div>
                  <button className="w-full py-3 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all">View Full History</button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm overflow-hidden">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-6">Recent Dispensations</h3>
                  <div className="space-y-4">
                    {[
                      { id: "INV-9021", patient: "Abul Kashem", amount: "৳1,250" },
                      { id: "INV-9020", patient: "Mofizur Rahman", amount: "৳840" },
                      { id: "INV-9019", patient: "Nasrin Akter", amount: "৳315" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-teal-hms/10">
                            <Package className="w-4 h-4 text-gray-400 group-hover:text-teal-hms" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{row.patient}</p>
                            <p className="text-[8px] text-gray-400 font-black uppercase">{row.id}</p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-gray-900">{row.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white rounded-2xl border border-border-hms overflow-hidden">
                <div className="p-6 border-b border-border-hms flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search medicine or generic..." className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-teal-hms" />
                  </div>
                  <div className="flex gap-2">
                    <select className="bg-gray-50 border-none rounded-xl py-2.5 px-4 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-teal-hms">
                      <option>All Categories</option>
                      <option>Tablet</option>
                      <option>Capsule</option>
                      <option>Syrup</option>
                      <option>Inhaler</option>
                    </select>
                    <button className="bg-teal-hms text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-teal-hms/20 flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add New
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Medicine</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reorder Level</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { name: "Sergel (20mg)", generic: "Esomeprazole", cat: "Capsule", stock: 450, reorder: 1000, price: "৳7.5", expiry: "Dec 2025" },
                        { name: "Napa Extend", generic: "Paracetamol", cat: "Tablet", stock: 120, reorder: 500, price: "৳2.0", expiry: "Jan 2026", low: true },
                        { name: "Ciprocin", generic: "Ciprofloxacin", cat: "Tablet", stock: 800, reorder: 300, price: "৳15.0", expiry: "Aug 2025" },
                        { name: "Alatrol", generic: "Cetirizine", cat: "Tablet", stock: 0, reorder: 200, price: "৳3.5", expiry: "Expired", out: true },
                      ].map((row, i) => (
                        <tr key={i} className={cn(
                          "hover:bg-gray-50 transition-all group",
                          row.out && "bg-red-50/50",
                          row.low && "bg-amber-50/50"
                        )}>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-gray-900">{row.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium italic">{row.generic}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[10px] font-bold text-teal-hms bg-teal-hms/10 px-2 py-0.5 rounded-full uppercase">{row.cat}</span>
                          </td>
                          <td className="px-6 py-5">
                            <p className={cn(
                              "text-sm font-black",
                              row.out ? "text-emergency-red" : row.low ? "text-warning-amber" : "text-gray-900"
                            )}>{row.stock} <span className="text-[10px] font-bold text-gray-400">units</span></p>
                          </td>
                          <td className="px-6 py-5 text-sm font-bold text-gray-400">{row.reorder}</td>
                          <td className="px-6 py-5 text-sm font-black text-gray-900">{row.price}</td>
                          <td className="px-6 py-5">
                            <p className={cn(
                              "text-xs font-bold",
                              row.expiry === "Expired" ? "text-emergency-red" : "text-gray-500"
                            )}>{row.expiry}</p>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 hover:bg-teal-hms/10 text-gray-400 hover:text-teal-hms rounded-lg transition-colors">
                                <PlusSquare className="w-4 h-4" />
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
