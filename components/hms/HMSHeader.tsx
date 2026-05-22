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
  Stethoscope,
  Volume2,
  VolumeX,
  CheckCircle2,
  X,
  LogOut,
  User,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEmergencyStore } from "@/lib/store/useEmergencyStore";
import { useNotificationStore } from "@/lib/store/useNotificationStore";
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
  const { user, logout } = useAuthStore();
  const { activeSiren, sirenType, sirenEta, clearSiren } = useEmergencyStore();
  const { notifications, unreadCount, soundEnabled, toggleSound, markAsRead, markAllAsRead } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const notifWrapperRef = useRef<HTMLDivElement>(null);
  const profileWrapperRef = useRef<HTMLDivElement>(null);
  
  // Audio synthesizer refs
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifWrapperRef.current && !notifWrapperRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileWrapperRef.current && !profileWrapperRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Play Ambulance Siren Audio
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeSiren) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.15; // Set volume
        gainNode.connect(ctx.destination);

        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.connect(gainNode);
        osc.start();

        let isHigh = true;
        interval = setInterval(() => {
          if (ctx.state === "running") {
            // Hi-Low European Ambulance frequencies
            osc.frequency.setValueAtTime(isHigh ? 960 : 770, ctx.currentTime);
            isHigh = !isHigh;
          }
        }, 500);

      } catch (err) {
        console.error("Siren audio failed to play:", err);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(console.error);
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSiren]);

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

          <div ref={notifWrapperRef} className="relative cursor-pointer group">
            <div 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-4 h-4 text-gray-500" />
              {mounted && unreadCount() > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-medical-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount()}
                </span>
              )}
            </div>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute top-12 right-0 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in slide-in-from-top-4 duration-200 cursor-default">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-black text-gray-800 text-sm">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={toggleSound}
                      title={mounted && soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
                      className={cn("p-1.5 rounded-lg transition-colors", (mounted && soundEnabled) ? "text-medical-green hover:bg-green-100" : "text-gray-400 hover:bg-gray-200")}
                    >
                      {mounted && soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={markAllAsRead}
                      className="p-1.5 text-medical-blue hover:bg-blue-100 rounded-lg transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center gap-2">
                      <Bell className="w-6 h-6 text-gray-300" />
                      <span>No new notifications</span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {notifications.slice(0, 5).map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            if (!n.isRead) markAsRead(n.id);
                            if (n.link) {
                              setIsNotifOpen(false);
                              router.push(n.link);
                            }
                          }}
                          className={cn(
                            "p-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer",
                            !n.isRead ? "bg-blue-50/30" : ""
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-gray-800 line-clamp-1">{n.title}</p>
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-medical-blue shrink-0 mt-1"></span>}
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                          <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase">
                            {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                  <button 
                    onClick={() => {
                      setIsNotifOpen(false);
                      router.push('/notifications');
                    }}
                    className="text-xs font-black text-medical-blue hover:underline uppercase tracking-widest"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-border-hms mx-1"></div>

          {/* Dynamic TopBar User Profile Card & Dropdown */}
          <div ref={profileWrapperRef} className="relative">
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 cursor-pointer group p-1.5 pr-3 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 border border-border-hms flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent((mounted && user?.name) || "Dr. Sarah Johnson")}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900 group-hover:text-medical-green transition-colors flex items-center gap-1 leading-tight">
                  {(mounted && user?.name) || "Dr. Sarah Johnson"}
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 group-hover:text-medical-green transition-all", isProfileOpen && "rotate-180")} />
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                  {(mounted && getRoleTitle(user?.role)) || "HOSPITAL STAFF"}
                </p>
              </div>
            </div>

            {isProfileOpen && (
              <div className="absolute top-14 right-0 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 mb-3 shadow-sm overflow-hidden p-1">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent((mounted && user?.name) || "Dr. Sarah Johnson")}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <p className="text-sm font-black text-gray-900">{(mounted && user?.name) || "Dr. Sarah Johnson"}</p>
                  <p className="text-xs text-gray-500 font-medium mb-2">{(mounted && user?.email) || "doctor@injaazh.com"}</p>
                  <span className="text-[10px] bg-medical-green/10 text-medical-green font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    {(mounted && getRoleTitle(user?.role)) || "HOSPITAL STAFF"}
                  </span>
                </div>
                
                <div className="p-2 space-y-1">
                  <button 
                    onClick={() => { setIsProfileOpen(false); router.push('/profile'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-700 hover:text-medical-blue hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </button>
                  <button 
                    onClick={() => { setIsProfileOpen(false); router.push('/settings'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <Settings className="w-4 h-4" /> Account Settings
                  </button>
                </div>
                
                <div className="p-2 border-t border-gray-100 bg-red-50/30">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                      router.push('/auth/login');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-black text-emergency-red hover:bg-red-100 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
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
