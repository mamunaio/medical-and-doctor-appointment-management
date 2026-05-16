"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  User, 
  Activity, 
  Plus, 
  Search, 
  FileText, 
  FlaskConical, 
  Bed, 
  AlertCircle,
  Save,
  Printer,
  ChevronDown,
  History,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OPDConsultation() {
  const [complaints, setComplaints] = useState("");
  
  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="OPD Consultation - Token #24" />
        
        <main className="p-6 flex flex-col xl:flex-row gap-6">
          {/* Left Column - Patient Quick Info */}
          <div className="w-full xl:w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-border-hms overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border-hms flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 p-1 border border-gray-100 mb-4">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fatema" 
                    className="w-full h-full rounded-xl object-cover"
                    alt="Patient"
                  />
                </div>
                <h2 className="text-lg font-black text-gray-900">Fatema Begum</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PAT-2024-00108</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold rounded-full">45y / F</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded-full">B+</span>
                </div>
              </div>

              <div className="p-4 bg-emergency-red/5 border-b border-emergency-red/10 flex gap-3">
                <AlertCircle className="w-4 h-4 text-emergency-red shrink-0" />
                <p className="text-[10px] font-bold text-emergency-red leading-tight">Allergy: Dust, Ibuprofen</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Patient Vitals</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">BP</label>
                      <input type="text" className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="120/80" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Pulse</label>
                      <input type="text" className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="72" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Temp</label>
                      <input type="text" className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="98.6" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">O2 Sat</label>
                      <input type="text" className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="98" />
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-gray-100 text-gray-600 text-[10px] font-black py-2 rounded-lg hover:bg-gray-200 transition-all uppercase tracking-widest">
                    Save Vitals
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Last Visit Summary</h3>
              <p className="text-xs text-gray-600 leading-relaxed italic">"Patient complained of mild chest pain. Recommended ECG and rest. Blood pressure was slightly elevated (145/90)."</p>
              <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-medical-blue">
                <span>12 Oct 2024</span>
                <span className="hover:underline cursor-pointer">View Details</span>
              </div>
            </div>
          </div>

          {/* Center Column - Consultation Form */}
          <div className="flex-1 min-w-0 space-y-6">
            <div className="bg-white rounded-2xl border border-border-hms shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-border-hms flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-medical-green" />
                  <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm">Consultation Record</h2>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors">
                    <History className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
                <div>
                  <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Chief Complaint</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-medical-green transition-all outline-none min-h-[100px] resize-none"
                    placeholder="Enter patient complaints here..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Physical Examination</label>
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-medical-green transition-all outline-none min-h-[120px] resize-none"
                      placeholder="Examination findings..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Clinical Diagnosis</label>
                    <div className="relative mb-3">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-medical-green" placeholder="ICD-10 Search..." />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-medical-green/10 text-medical-green px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-medical-green/20">
                        I10 - Essential hypertension
                        <button className="hover:text-red-500">×</button>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Treatment Plan & Advice</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-medical-green transition-all outline-none min-h-[150px] resize-none"
                    placeholder="Advice, medications and other notes..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Follow-up Date</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Refer to Specialist</label>
                    <select className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-green appearance-none">
                      <option>None</option>
                      <option>Cardiology Specialist</option>
                      <option>Neurology Specialist</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border-hms bg-gray-50/50 flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-400 italic">Last autosaved at 12:45 PM</p>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-xs font-black uppercase hover:bg-gray-100 transition-all">Draft</button>
                  <button className="px-8 py-2.5 rounded-xl bg-medical-green text-white text-xs font-black uppercase shadow-lg shadow-medical-green/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Record
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="w-full xl:w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-border-hms shadow-sm p-4 space-y-3">
              <button className="w-full bg-medical-blue text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-medical-blue/20 flex items-center justify-center gap-3 hover:bg-medical-blue/90 transition-all">
                <FileText className="w-5 h-5" /> Write Prescription
              </button>
              <button className="w-full bg-teal-hms/10 text-teal-hms py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-teal-hms/20 flex items-center justify-center gap-3 hover:bg-teal-hms hover:text-white transition-all">
                <FlaskConical className="w-5 h-5" /> Order Lab Test
              </button>
              <button className="w-full bg-purple-hms/10 text-purple-hms py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-purple-hms/20 flex items-center justify-center gap-3 hover:bg-purple-hms hover:text-white transition-all">
                <Activity className="w-5 h-5" /> Order Radiology
              </button>
              <button className="w-full bg-emergency-red/10 text-emergency-red py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-emergency-red/20 flex items-center justify-center gap-3 hover:bg-emergency-red hover:text-white transition-all">
                <Bed className="w-5 h-5" /> Admit to IPD
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-border-hms shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border-hms bg-gray-50 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Recent Prescriptions</h3>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="p-4 space-y-4">
                {[
                  { date: "15 Oct 2024", dr: "Dr. Akram" },
                  { date: "02 Sep 2024", dr: "Dr. Akram" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-medical-blue/10 transition-colors">
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-medical-blue" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{p.date}</p>
                        <p className="text-[10px] text-gray-500">{p.dr}</p>
                      </div>
                    </div>
                    <Printer className="w-4 h-4 text-gray-300 group-hover:text-gray-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-hms shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border-hms bg-gray-50 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Lab Results</h3>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="p-4">
                <div className="p-3 bg-medical-green/5 border border-medical-green/10 rounded-xl mb-4">
                  <p className="text-xs font-bold text-gray-900 mb-1">HbA1c (Diabetes)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-medical-green">6.2%</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Pre-Diabetic</span>
                  </div>
                </div>
                <button className="w-full text-center text-[10px] font-black text-medical-blue uppercase tracking-widest hover:underline">All Lab Reports</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
