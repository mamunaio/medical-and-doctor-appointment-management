"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Bell, 
  ChevronDown, 
  AlertCircle,
  Menu,
  Ambulance,
  Users,
  Activity,
  CreditCard,
  Pill,
  FlaskConical,
  Settings,
  Clock,
  Sparkles,
  Heart,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEmergencyStore } from "@/lib/store/useEmergencyStore";
import EmergencyModal from "./EmergencyModal";

interface HMSHeaderProps {
  title: string;
}

// Search Database Mock Records
const SEARCH_DATABASE = {
  patients: [
    { id: "PAT-2024-00001", name: "Abul Kashem", blood: "O+", dept: "Cardiology", age: "62", href: "/patients" },
    { id: "PAT-2024-00002", name: "Fatema Begum", blood: "A-", dept: "General Medicine", age: "54", href: "/patients" },
    { id: "PAT-2024-00003", name: "Rahim Uddin", blood: "B+", dept: "Cardiology", age: "41", href: "/patients" },
    { id: "PAT-2024-00004", name: "Sumi Akter", blood: "AB+", dept: "Gynecology", age: "29", href: "/patients" },
    { id: "PAT-2024-00005", name: "Jashim Khan", blood: "O-", dept: "Emergency", age: "32", href: "/patients" },
  ],
  doctors: [
    { name: "Dr. Akram Hossain", title: "Chief of Cardiology", dept: "Cardiology", room: "OPD-102", status: "Online" },
    { name: "Dr. Sarah Johnson", title: "Chief Administrator", dept: "Administration", room: "Admin-A1", status: "Online" },
    { name: "Dr. Shaila Rahman", title: "Gynecology Lead", dept: "Gynecology", room: "OPD-204", status: "In Surgery" },
    { name: "Dr. Zaman Hossain", title: "Orthopedics Chief", dept: "Orthopedics", room: "OPD-108", status: "Offline" },
  ],
  shortcuts: [
    { name: "Dashboard Console", desc: "Hospital overall performance summary", href: "/dashboard", icon: Activity, color: "text-medical-blue bg-medical-blue/10" },
    { name: "OPD Consultation Desk", desc: "Outpatient chamber records", href: "/opd", icon: Stethoscope, color: "text-medical-green bg-medical-green/10" },
    { name: "IPD Bed Board & Rounds", desc: "Inpatient admission & ward maps", href: "/ipd", icon: Activity, color: "text-purple-hms bg-purple-hms/10" },
    { name: "Emergency Trauma Hub", desc: "Active emergency queue & bed maps", href: "/emergency", icon: AlertCircle, color: "text-emergency-red bg-emergency-red/10" },
    { name: "Diagnostics Laboratory", desc: "Blood, sugar, lipid lab reports", href: "/lab", icon: FlaskConical, color: "text-teal-hms bg-teal-hms/10" },
    { name: "Pharmacy Inventory", desc: "Medicine stocks and reorder limits", href: "/pharmacy", icon: Pill, color: "text-warning-amber bg-warning-amber/10" },
    { name: "Cashier & Billing Ledger", desc: "Bill checkout & pending payments", href: "/billing", icon: CreditCard, color: "text-medical-green bg-medical-green/10" },
    { name: "Hospital General Settings", desc: "System parameters and departments", href: "/settings", icon: Settings, color: "text-gray-500 bg-gray-100" },
  ]
};

export default function HMSHeader({ title }: HMSHeaderProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeSiren, sirenType, sirenEta, clearSiren } = useEmergencyStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter Search Database
  const filteredPatients = searchQuery 
    ? SEARCH_DATABASE.patients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.dept.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredDoctors = searchQuery 
    ? SEARCH_DATABASE.doctors.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.dept.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredShortcuts = searchQuery 
    ? SEARCH_DATABASE.shortcuts.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_DATABASE.shortcuts.slice(0, 4); // default quick links when input is focused but empty

  const totalResults = filteredPatients.length + filteredDoctors.length + (searchQuery ? filteredShortcuts.length : 0);

  const handleShortcutClick = (href: string) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    router.push(href);
  };

  // Helper to format role titles in topbar
  const getRoleTitle = (role?: string) => {
    if (!role) return "Hospital Staff";
    switch (role.toLowerCase()) {
      case "super_admin": return "Chief Administrator";
      case "admin": return "Hospital Administrator";
      case "doctor": return "Cardiology Specialist";
      case "nurse": return "Clinical Duty Nurse";
      case "receptionist": return "Front Desk Officer";
      case "patient": return "Health Portal Guest";
      default: return "Hospital Staff";
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-border-hms sticky top-0 z-40 px-6 flex items-center justify-between">
        
        {/* Pulsing Siren Alert Banner */}
        {activeSiren && (
          <div className="absolute top-16 left-0 right-0 bg-gradient-to-r from-emergency-red via-red-700 to-emergency-red text-white py-2.5 px-6 flex items-center justify-between text-xs font-black uppercase tracking-wider animate-pulse z-30 shadow-lg border-b border-red-800">
            <span className="flex items-center gap-2">
              <Ambulance className="w-5 h-5 shrink-0 animate-bounce text-white" />
              <span>🚨 AMBULANCE INBOUND ALERT: {sirenType} (ETA: {sirenEta}) - Bay Preparation Dispatched!</span>
            </span>
            <button 
              onClick={clearSiren} 
              className="bg-white text-emergency-red font-black px-3.5 py-1 rounded-lg text-[9px] hover:bg-gray-100 transition-colors uppercase shrink-0 border border-transparent active:scale-95"
            >
              Clear Alarm
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button className="lg:hidden text-gray-500">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Global Live Search */}
        <div ref={searchWrapperRef} className="flex-1 max-w-md mx-8 relative">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-medical-green" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search patients, doctors, page shortcuts..."
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-medical-green transition-all outline-none font-medium placeholder:text-gray-400 text-gray-800"
            />
          </div>

          {/* Search Dropdown Overlay */}
          {isSearchFocused && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[420px] animate-in fade-in slide-in-from-top-4 duration-200">
              
              <div className="p-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>
                  {searchQuery ? `Search Results (${totalResults})` : "Quick Navigation Shortcuts"}
                </span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="hover:text-medical-green text-[10px]"
                  >
                    Clear Query
                  </button>
                )}
              </div>

              <div className="overflow-y-auto p-2 space-y-4 no-scrollbar">
                
                {/* 1. Shortcuts Group */}
                {filteredShortcuts.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 tracking-wider px-2 uppercase mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-medical-green" /> Page Shortcuts
                    </p>
                    {filteredShortcuts.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleShortcutClick(s.href)}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded-xl transition-all flex items-center gap-3"
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", s.color)}>
                          <s.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{s.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{s.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. Patients Group */}
                {searchQuery && filteredPatients.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 tracking-wider px-2 uppercase mb-1 flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-medical-blue" /> Patients Found
                    </p>
                    {filteredPatients.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => handleShortcutClick(p.href)}
                        className="w-full text-left p-2 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-medical-blue/10 text-medical-blue rounded-lg flex items-center justify-center shrink-0 text-xs font-bold uppercase">
                            {p.name.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 group-hover:text-medical-blue transition-colors">{p.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">ID: {p.id} • Age: {p.age}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-medical-blue/10 text-medical-blue font-bold px-2 py-0.5 rounded-full uppercase">{p.dept}</span>
                          <span className="text-[9px] bg-red-100 text-emergency-red font-black px-2 py-0.5 rounded-full">{p.blood}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Doctors Group */}
                {searchQuery && filteredDoctors.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 tracking-wider px-2 uppercase mb-1 flex items-center gap-1.5">
                      <Heart className="w-3 h-3 text-emergency-red" /> Medical Clinicians
                    </p>
                    {filteredDoctors.map((d, i) => (
                      <div
                        key={i}
                        className="p-2 hover:bg-gray-50 rounded-xl flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emergency-red/10 text-emergency-red rounded-lg flex items-center justify-center shrink-0 text-xs font-bold uppercase">
                            DR
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{d.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{d.title} • {d.room}</p>
                          </div>
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border",
                          d.status === "Online" && "bg-medical-green/10 text-medical-green border-medical-green/20",
                          d.status === "In Surgery" && "bg-emergency-red/10 text-emergency-red border-emergency-red/20",
                          d.status === "Offline" && "bg-gray-100 text-gray-400 border-gray-200"
                        )}>
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Empty Result State */}
                {searchQuery && totalResults === 0 && (
                  <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-gray-300" />
                    <span>No clinics, patients, or departments found matching "{searchQuery}"</span>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Action Widgets and Profile Details */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsEmergencyOpen(true)}
            className="flex items-center gap-2 bg-emergency-red text-white hover:bg-red-700 px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emergency-red/20 hover:scale-105 active:scale-95"
          >
            <AlertCircle className="w-4 h-4 animate-pulse fill-white text-emergency-red" />
            <span className="text-xs font-black uppercase tracking-widest">Emergency</span>
          </button>

          <div className="relative cursor-pointer group">
            <div className="p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-medical-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                5
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-border-hms mx-1"></div>

          {/* Dynamic TopBar User Profile Card */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-border-hms flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "Dr. Sarah Johnson")}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 group-hover:text-medical-green transition-colors flex items-center gap-1 leading-tight">
                {user?.name || "Dr. Sarah Johnson"}
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-medical-green transition-all" />
              </p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                {getRoleTitle(user?.role)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Emergency Intake Portal Modal */}
      <EmergencyModal 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
      />
    </>
  );
}
