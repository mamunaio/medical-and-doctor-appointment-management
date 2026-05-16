"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  Activity, 
  Printer, 
  Download, 
  Mail, 
  Smartphone, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Info,
  Calendar,
  Search,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Prescription() {
  const [medicines, setMedicines] = useState([
    { name: "Tab. Sergel (20mg)", dose: "1 + 0 + 1", duration: "15 days", instruction: "Before meal" },
    { name: "Tab. Napa Extend (665mg)", dose: "1 + 1 + 1", duration: "5 days", instruction: "After meal (if pain)" },
  ]);

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Prescription Pad" />
        
        <main className="p-6 flex flex-col lg:flex-row gap-6">
          {/* Action Bar - Desktop Left/Top */}
          <div className="lg:w-72 shrink-0 space-y-6 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Actions</h3>
              <button className="w-full bg-medical-green text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-medical-green/20">
                <Printer className="w-4 h-4" /> Print PDF
              </button>
              <button className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-all">
                <Download className="w-4 h-4" /> Download
              </button>
              <button className="w-full bg-medical-blue/10 text-medical-blue py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-medical-blue/20 hover:bg-medical-blue hover:text-white transition-all">
                <Smartphone className="w-4 h-4" /> SMS পাঠান
              </button>
              <button className="w-full bg-purple-hms/10 text-purple-hms py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-purple-hms/20 hover:bg-purple-hms hover:text-white transition-all">
                <Mail className="w-4 h-4" /> Email পাঠান
              </button>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 space-y-4">
              <div className="flex items-center gap-2 text-warning-amber">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-xs font-black uppercase tracking-widest">Drug Interactions</h3>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">No severe interactions found between selected medicines.</p>
            </div>
          </div>

          {/* Prescription Pad */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-100 min-h-[1000px] flex flex-col p-12 max-w-[800px] mx-auto print:shadow-none print:border-none print:m-0 print:p-8">
              {/* Header */}
              <div className="flex items-start justify-between border-b-4 border-medical-green pb-8 mb-8">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-1">Injaazh Hospital</h1>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dhaka-Chittagong Highway, Comilla, Bangladesh</p>
                  <p className="text-xs font-bold text-gray-500">Phone: +880 1234-567890 | Web: www.medicare.com</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-3 mb-2">
                    <Activity className="w-10 h-10 text-medical-green" />
                  </div>
                  <p className="text-xl font-black text-gray-900">Dr. Akram Hossain</p>
                  <p className="text-xs font-bold text-medical-blue">MBBS, MD (Cardiology)</p>
                  <p className="text-[10px] font-bold text-gray-400">BMDC Reg: A-56789</p>
                </div>
              </div>

              {/* Patient Info Row */}
              <div className="bg-gray-50 px-6 py-4 rounded-xl flex flex-wrap gap-y-4 justify-between mb-10 border border-gray-100">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Patient</p>
                    <p className="text-sm font-black text-gray-900">Fatema Begum</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Age/Sex</p>
                    <p className="text-sm font-black text-gray-900">45Y / Female</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Date</p>
                    <p className="text-sm font-black text-gray-900">16 May 2024</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Rx ID</p>
                    <p className="text-sm font-black text-medical-blue uppercase">RX-7890</p>
                  </div>
                </div>
              </div>

              {/* Prescription Body */}
              <div className="flex-1 flex">
                {/* Left Side - Vitals & Findings */}
                <div className="w-56 shrink-0 border-r-2 border-gray-100 pr-8 space-y-10">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">Vitals</h3>
                    <div className="space-y-3">
                      {[
                        { l: "BP", v: "140/90" },
                        { l: "Pulse", v: "78" },
                        { l: "Wt", v: "68 kg" },
                        { l: "Temp", v: "98.4" },
                      ].map(v => (
                        <div key={v.l} className="flex justify-between text-xs font-bold">
                          <span className="text-gray-400 uppercase">{v.l}</span>
                          <span className="text-gray-900">{v.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">Dx</h3>
                    <p className="text-xs font-bold text-gray-900">Essential Hypertension</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">Investigation</h3>
                    <ul className="text-[10px] font-bold text-gray-600 space-y-2 list-disc pl-4">
                      <li>CBC, Lipid Profile</li>
                      <li>ECG (Resting)</li>
                      <li>Echo Cardiology</li>
                    </ul>
                  </div>
                </div>

                {/* Right Side - Rx Symbol and Medicines */}
                <div className="flex-1 pl-10">
                  <div className="text-5xl font-black text-gray-200 mb-8 font-serif italic">Rx</div>
                  
                  <div className="space-y-8 mb-12">
                    {medicines.map((m, i) => (
                      <div key={i} className="group relative">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-black text-gray-900">{m.name}</h4>
                          <button className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all no-print">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="font-black text-medical-green">{m.dose}</span>
                          <span className="text-gray-400 font-bold">-----------</span>
                          <span className="font-bold text-gray-900">{m.duration}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">({m.instruction})</p>
                      </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:text-medical-green hover:border-medical-green hover:bg-medical-green/5 transition-all no-print">
                      <Plus className="w-4 h-4" /> + ওষুধ যোগ করুন
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-widest border-b border-gray-200 pb-2">Advice</h3>
                    <ul className="text-xs font-medium text-gray-600 space-y-2 list-disc pl-4">
                      <li>লবণ কম খাবেন (Low salt diet)</li>
                      <li>প্রতিদিন অন্তত ৩০ মিনিট হাঁটবেন</li>
                      <li>ধূমপান থেকে বিরত থাকুন</li>
                      <li>পর্যাপ্ত ঘুম নিশ্চিত করুন</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-12 border-t-2 border-gray-100 flex items-end justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-medical-blue mb-4">
                    <Calendar className="w-4 h-4" />
                    পরবর্তী ভিজিট: ১৫ জুন ২০২৪
                  </div>
                  <div className="flex items-center gap-3 no-print">
                    <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center text-[10px] text-gray-400 font-bold uppercase text-center p-2">
                      Scan QR for Digital Copy
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-12 border-b-2 border-gray-900 mb-2"></div>
                  <p className="text-sm font-black text-gray-900">Dr. Akram Hossain</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
