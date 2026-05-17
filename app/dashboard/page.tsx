"use client";

import React from "react";
import Link from "next/link";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import StatCard from "@/components/hms/StatCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEmergencyStore } from "@/lib/store/useEmergencyStore";
import { 
  Users, 
  Calendar, 
  Bed, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  MoreVertical,
  ChevronRight,
  FlaskConical,
  Pill,
  Activity,
  UserPlus,
  ArrowRight,
  FileText,
  Stethoscope,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Heart,
  Zap
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { cn } from "@/lib/utils";

// Mock datasets for analytics charts
const visitData = [
  { name: "Sat", opd: 400, ipd: 240, emergency: 150 },
  { name: "Sun", opd: 300, ipd: 139, emergency: 120 },
  { name: "Mon", opd: 500, ipd: 380, emergency: 200 },
  { name: "Tue", opd: 450, ipd: 300, emergency: 180 },
  { name: "Wed", opd: 550, ipd: 420, emergency: 250 },
  { name: "Thu", opd: 480, ipd: 350, emergency: 210 },
  { name: "Fri", opd: 200, ipd: 150, emergency: 80 },
];

const revenueData = [
  { name: "OPD", value: 45000 },
  { name: "IPD", value: 32000 },
  { name: "Lab", value: 18000 },
  { name: "Pharmacy", value: 24000 },
  { name: "Other", value: 5500 },
];

const bedData = [
  { name: "Occupied", value: 42, color: "#10B981" }, // medical-green
  { name: "Available", value: 18, color: "#E5E7EB" },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { emergencyCount } = useEmergencyStore();

  // Helper to extract initials for avatar chips
  const getInitials = (name?: string) => {
    if (!name) return "P";
    const cleaned = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, "");
    const parts = cleaned.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return cleaned.slice(0, 2).toUpperCase();
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-slate-50/70 font-sans">
        <HMSSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          
          {/* ========================================================================= */}
          {/* 1. PATIENT PORTAL INTERFACE */}
          {/* ========================================================================= */}
          {user?.role === "patient" ? (
            <>
              <HMSHeader title="Patient Portal" />
              
              <main className="p-6 space-y-6 animate-in fade-in duration-500">
                {/* Greeting Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-white/5">
                  <div className="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
                  <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
                  
                  <div className="relative z-10">
                    <span className="bg-white/10 backdrop-blur-md text-[9px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 w-fit">
                      <ShieldCheck className="w-3.5 h-3.5 text-medical-green animate-bounce" /> Personal Health Portal
                    </span>
                    <h1 className="text-3xl font-black mt-4 mb-2 tracking-tight">Hello, {user?.name || "Abul Kashem"}!</h1>
                    <p className="text-white/70 text-xs font-medium max-w-xl leading-relaxed">
                      Welcome to your clinical dashboard. Keep track of your appointments, access active prescriptions, review laboratory diagnostic reports, and manage outstanding settlements effortlessly.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/5">
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-2xl">
                        <p className="text-[9px] text-white/50 font-black uppercase tracking-wider">Patient ID</p>
                        <p className="text-xs font-black mt-1 text-white">PAT-2024-00001</p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-2xl">
                        <p className="text-[9px] text-white/50 font-black uppercase tracking-wider">Blood Group</p>
                        <p className="text-xs font-black mt-1 text-red-400">A+ (Rh Positive)</p>
                      </div>
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-2xl">
                        <p className="text-[9px] text-white/50 font-black uppercase tracking-wider">Emergency Contact</p>
                        <p className="text-xs font-black mt-1 text-white">01911-111111</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Upcoming Bookings" value="1 Active" icon={Calendar} color="blue" />
                  <StatCard label="My Prescriptions" value="2 Active" icon={Pill} color="purple" />
                  <StatCard label="Pending Lab Orders" value="1 Pending" icon={FlaskConical} color="amber" />
                  <StatCard label="Outstanding Balance" value="৳1,250" icon={TrendingUp} color="green" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Appointment Schedule */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 lg:col-span-2 flex flex-col justify-between hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-medical-blue" />
                          My Appointment Schedule
                        </h2>
                        <span className="text-[10px] bg-medical-blue/5 text-medical-blue font-bold px-2.5 py-0.5 rounded-full uppercase">1 Confirmed</span>
                      </div>
                      
                      <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center shrink-0 shadow-sm">
                            <span className="text-[9px] font-black text-gray-400">MAY</span>
                            <span className="text-sm font-black text-medical-blue leading-none">18</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">Dr. Akram Hossain</p>
                            <p className="text-xs text-gray-500">Chief of Cardiology • OPD Room 102</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-left sm:text-right">
                            <p className="text-xs font-black text-gray-900">09:30 AM</p>
                            <p className="text-[10px] font-bold text-gray-400">Regular Consultation</p>
                          </div>
                          <span className="w-2.5 h-2.5 rounded-full bg-medical-green animate-ping shrink-0" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-xs text-gray-500 font-medium">Please check in at the front desk 15 minutes prior to your booking.</p>
                      <button className="bg-medical-blue text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all w-fit">
                        Reschedule Appointment
                      </button>
                    </div>
                  </div>

                  {/* Active Medications */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Pill className="w-5 h-5 text-purple-hms" />
                      Active Medications
                    </h2>
                    
                    <div className="space-y-4">
                      {[
                        { name: "Napa Extend 665mg", intake: "1+0+1 After Meal", duration: "10 Days remaining", color: "purple" },
                        { name: "Ciprocin 500mg", intake: "1+0+1 Before Meal", duration: "3 Days remaining", color: "blue" },
                      ].map((med, i) => (
                        <div key={i} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 relative group overflow-hidden">
                          <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-lg", med.color === "purple" ? "bg-purple-hms" : "bg-medical-blue")} />
                          <p className="text-xs font-bold text-gray-900">{med.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium mt-1">{med.intake}</p>
                          <p className="text-[9px] text-medical-green font-black uppercase mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-medical-green animate-pulse" /> {med.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </main>
            </>
          ) : user?.role === "receptionist" ? (
            
            // =========================================================================
            // 2. RECEPTIONIST FRONT DESK CONSOLE
            // =========================================================================
            <>
              <HMSHeader title="Front Desk Console" />
              
              <main className="p-6 space-y-6 animate-in fade-in duration-500">
                {/* Receptionist Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Today's Registrations" value="12 Patients" icon={Users} color="green" />
                  <StatCard label="Today's Bookings" value="45 Slots" icon={Calendar} color="blue" />
                  <StatCard label="Beds Occupied" value="42/60 Admitted" icon={Bed} color="purple" />
                  <StatCard label="Checkout Pending Bills" value="4 Invoices" icon={TrendingUp} color="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column - Front Desk Action Links */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 flex flex-col justify-between hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <div>
                      <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-warning-amber" />
                        Quick Front-Desk Actions
                      </h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-6">Administrative Operations</p>
                      
                      <div className="space-y-3">
                        <Link 
                          href="/patients/register"
                          className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-medical-green hover:to-teal-600 hover:text-white rounded-2xl transition-all duration-300 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-medical-green/10 text-medical-green group-hover:bg-white/20 group-hover:text-white rounded-xl transition-all">
                              <UserPlus className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold group-hover:font-black">Register New Patient</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </Link>

                        <Link 
                          href="/appointments"
                          className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-medical-blue hover:to-indigo-600 hover:text-white rounded-2xl transition-all duration-300 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-medical-blue/10 text-medical-blue group-hover:bg-white/20 group-hover:text-white rounded-xl transition-all">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold group-hover:font-black">Book New Appointment</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </Link>

                        <Link 
                          href="/emergency"
                          className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-emergency-red hover:to-rose-600 hover:text-white rounded-2xl transition-all duration-300 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emergency-red/10 text-emergency-red group-hover:bg-white/20 group-hover:text-white rounded-xl transition-all">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold group-hover:font-black">Emergency Intake Check-in</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100 mt-6 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-medical-green animate-ping shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">Front-desk Counter 01 Active</p>
                        <p className="text-[9px] text-gray-500 font-medium">Logged in as Receptionist • Duty Station A</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Live Queue (2 Columns wide) */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 lg:col-span-2 flex flex-col justify-between hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-5 h-5 text-medical-blue" />
                          Today's Front Desk Queue
                        </h2>
                        <span className="text-[10px] bg-medical-green/5 text-medical-green font-bold px-2.5 py-0.5 rounded-full uppercase">3 Waiting</span>
                      </div>
                      
                      <div className="overflow-x-auto max-h-[300px] no-scrollbar">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50/50 sticky top-0 z-10 border-b border-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Patient</th>
                              <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Booking Slot</th>
                              <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Payment Status</th>
                              <th className="px-4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { name: "Abul Kashem", id: "PAT-24-001", time: "09:30 AM", type: "Paid Consultation", badge: "Paid", color: "green" },
                              { name: "Fatema Begum", id: "PAT-24-002", time: "10:00 AM", type: "Follow-up", badge: "Free Visit", color: "blue" },
                              { name: "Rahim Uddin", id: "PAT-24-003", time: "10:30 AM", type: "Billing Checkout Pending", badge: "Unpaid", color: "amber" },
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-black uppercase">
                                      {getInitials(row.name)}
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-gray-900">{row.name}</p>
                                      <p className="text-[9px] text-gray-400">{row.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="text-xs font-black text-gray-900">{row.time}</p>
                                  <p className="text-[9px] text-gray-500 font-medium">{row.type}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                                    row.color === "green" && "bg-medical-green/10 text-medical-green border-medical-green/20",
                                    row.color === "blue" && "bg-medical-blue/10 text-medical-blue border-medical-blue/20",
                                    row.color === "amber" && "bg-warning-amber/10 text-warning-amber border-warning-amber/20"
                                  )}>
                                    {row.badge}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <Link 
                                    href="/billing"
                                    className="text-[10px] font-black text-medical-green hover:text-teal-600 uppercase tracking-wider"
                                  >
                                    Settle Bill
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Total Check-ins handled: 18 Patients</span>
                      <Link href="/patients" className="font-bold text-medical-blue hover:underline">View Ledger</Link>
                    </div>
                  </div>
                </div>
              </main>
            </>
          ) : user?.role === "nurse" ? (
            
            // =========================================================================
            // 3. CLINICAL CARE STATION - NURSE
            // =========================================================================
            <>
              <HMSHeader title="Clinical Care Station" />
              
              <main className="p-6 space-y-6 animate-in fade-in duration-500">
                {/* Nurse Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Active Inpatients (IPD)" value="42 Wards" icon={Bed} color="purple" />
                  <StatCard label="OPD Triage Queue" value="8 Waiting" icon={Users} color="blue" />
                  <StatCard label="Emergency Triages" value={`${emergencyCount} Triages`} icon={AlertTriangle} color="red" />
                  <StatCard label="Low Stock Ward Supplies" value="2 Supplies" icon={Pill} color="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column - Nurse Actions */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 flex flex-col justify-between hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <div>
                      <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-hms" />
                        Quick Clinical Actions
                      </h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-6">Inpatient Ward Duty Operations</p>
                      
                      <div className="space-y-3">
                        <Link 
                          href="/opd"
                          className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-medical-blue hover:to-indigo-600 hover:text-white rounded-2xl transition-all duration-300 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-medical-blue/10 text-medical-blue group-hover:bg-white/20 group-hover:text-white rounded-xl transition-all">
                              <Activity className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold group-hover:font-black">Record Patient Vitals</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </Link>

                        <Link 
                          href="/ipd"
                          className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-purple-hms hover:to-pink-600 hover:text-white rounded-2xl transition-all duration-300 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-hms/10 text-purple-hms group-hover:bg-white/20 group-hover:text-white rounded-xl transition-all">
                              <Bed className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold group-hover:font-black">IPD Ward Rounds Check-in</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </Link>

                        <Link 
                          href="/emergency"
                          className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-emergency-red hover:to-rose-600 hover:text-white rounded-2xl transition-all duration-300 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emergency-red/10 text-emergency-red group-hover:bg-white/20 group-hover:text-white rounded-xl transition-all">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold group-hover:font-black">Emergency Trauma Intake</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100 mt-6 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-hms animate-ping shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">Ward Assignment: ICU & Ward B</p>
                        <p className="text-[9px] text-gray-500 font-medium">Nurse Emily • Shift: Day Shift A</p>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column - OPD Vitals Intake Queue */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 lg:col-span-2 flex flex-col justify-between hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-5 h-5 text-medical-blue" />
                          OPD Vitals Intake Queue
                        </h2>
                        <span className="text-[10px] bg-medical-blue/5 text-medical-blue font-bold px-2.5 py-0.5 rounded-full uppercase">8 Waiting</span>
                      </div>
                      
                      <div className="overflow-y-auto max-h-[300px] no-scrollbar">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50/50 sticky top-0 z-10 border-b border-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Patient</th>
                              <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Age/Sex</th>
                              <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Priority</th>
                              <th className="px-4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { name: "Mofizur Rahman", details: "ID: PAT-24-098", ageSex: "45 Yrs / Male", priority: "Urgent", color: "red" },
                              { name: "Nasrin Akter", details: "ID: PAT-24-102", ageSex: "29 Yrs / Female", priority: "Routine", color: "blue" },
                              { name: "Kamal Uddin", details: "ID: PAT-24-055", ageSex: "62 Yrs / Male", priority: "Routine", color: "blue" },
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-black uppercase">
                                      {getInitials(row.name)}
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-gray-900">{row.name}</p>
                                      <p className="text-[9px] text-gray-400">{row.details}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600 font-medium">{row.ageSex}</td>
                                <td className="px-4 py-3">
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                                    row.color === "red" ? "bg-emergency-red/10 text-emergency-red border-emergency-red/20" : "bg-medical-blue/10 text-medical-blue border-medical-blue/20"
                                  )}>
                                    {row.priority}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <Link 
                                    href="/opd"
                                    className="bg-medical-blue text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all"
                                  >
                                    Record Vitals
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Shift Target: 40 OPD Intake Records</span>
                      <Link href="/opd" className="font-bold text-medical-blue hover:underline">Full OPD Desk</Link>
                    </div>
                  </div>
                </div>

                {/* Third Row: Bed/Ward Occupancy Map */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                      <Bed className="w-5 h-5 text-purple-hms" />
                      Inpatient Ward Occupancy Map (IPD)
                    </h2>
                    <span className="text-xs font-bold text-gray-400">Capacity: 60 Active Clinical Beds</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: "General Medicine Ward", beds: "18 / 20 Beds", pct: 90, status: "High Occupancy", color: "purple" },
                      { name: "Surgical Ward", beds: "12 / 15 Beds", pct: 80, status: "Normal Capacity", color: "blue" },
                      { name: "Intensive Care Unit (ICU)", beds: "4 / 5 Beds", pct: 80, status: "Critical Alert", color: "red" },
                      { name: "Emergency Ward Admissions", beds: "8 / 20 Beds", pct: 40, status: "Low Occupancy", color: "green" },
                    ].map((ward, i) => (
                      <div key={i} className="p-4.5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                        <p className="text-xs font-black text-gray-950 mb-1 leading-tight">{ward.name}</p>
                        <div className="flex justify-between items-center mb-3.5">
                          <span className="text-[10px] text-gray-500 font-bold">{ward.beds}</span>
                          <span className={cn(
                            "text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider",
                            ward.color === "purple" && "bg-purple-hms/10 text-purple-hms border-purple-hms/20",
                            ward.color === "blue" && "bg-medical-blue/10 text-medical-blue border-medical-blue/20",
                            ward.color === "red" && "bg-emergency-red/10 text-emergency-red border-emergency-red/20",
                            ward.color === "green" && "bg-medical-green/10 text-medical-green border-medical-green/20"
                          )}>
                            {ward.status}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200/70 h-2 rounded-full overflow-hidden shadow-inner">
                          <div className={cn(
                            "h-full rounded-full bg-gradient-to-r",
                            ward.color === "purple" && "from-purple-hms to-pink-500",
                            ward.color === "blue" && "from-medical-blue to-indigo-600",
                            ward.color === "red" && "from-emergency-red to-rose-600",
                            ward.color === "green" && "from-medical-green to-teal-500"
                          )} style={{ width: `${ward.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </>
          ) : user?.role === "doctor" ? (
            
            // =========================================================================
            // 4. CLINICAL PRACTICE CONSOLE - DOCTOR
            // =========================================================================
            <>
              <HMSHeader title="Clinical Practice Console" />
              
              <main className="p-6 space-y-6 animate-in fade-in duration-500">
                {/* Doctor Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard label="Today's Patients" value="18 Bookings" icon={Users} color="blue" />
                  <StatCard label="Pending Consultations" value="5 Waiting" icon={Clock} color="amber" />
                  <StatCard label="IPD Under My Care" value="12 Patients" icon={Bed} color="purple" />
                  <StatCard label="Critical Lab Reviews" value="3 Lab Orders" icon={Activity} color="red" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column - Clinical Duty Actions */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 flex flex-col justify-between hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <div>
                      <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-medical-blue" />
                        Clinical Workflows
                      </h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-6">Patient Rounds & Consultations</p>
                      
                      <div className="space-y-3">
                        <Link 
                          href="/opd"
                          className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-medical-blue hover:to-indigo-600 hover:text-white rounded-2xl transition-all duration-300 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-medical-blue/10 text-medical-blue group-hover:bg-white/20 group-hover:text-white rounded-xl transition-all">
                              <Stethoscope className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold group-hover:font-black">Start OPD Consultation</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </Link>

                        <Link 
                          href="/ipd"
                          className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-purple-hms hover:to-pink-600 hover:text-white rounded-2xl transition-all duration-300 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-hms/10 text-purple-hms group-hover:bg-white/20 group-hover:text-white rounded-xl transition-all">
                              <Bed className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold group-hover:font-black">IPD Ward Round Logs</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </Link>

                        <Link 
                          href="/lab"
                          className="group flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-teal-hms hover:to-emerald-600 hover:text-white rounded-2xl transition-all duration-300 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-hms/10 text-teal-hms group-hover:bg-white/20 group-hover:text-white rounded-xl transition-all">
                              <FlaskConical className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold group-hover:font-black">Review Lab Test Reports</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                        </Link>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100 mt-6 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-medical-green animate-ping shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">Cardiology Lead Practitioner</p>
                        <p className="text-[9px] text-gray-500 font-medium">Logged in as Dr. Akram Hossain • Department A</p>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column - Consultation Queue */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 lg:col-span-2 flex flex-col justify-between hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-5 h-5 text-medical-blue" />
                          Today's Consultation Desk
                        </h2>
                        <span className="text-[10px] bg-warning-amber/5 text-warning-amber font-bold px-2.5 py-0.5 rounded-full uppercase">5 Waiting</span>
                      </div>
                      
                      <div className="overflow-y-auto max-h-[300px] no-scrollbar">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50/50 sticky top-0 z-10 border-b border-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Patient</th>
                              <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Vitals Status</th>
                              <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Triage Status</th>
                              <th className="px-4 py-2"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { name: "Abul Kashem", id: "PAT-24-001", vitals: "128/84 BP • 98% SpO2", status: "Critical Care", color: "red" },
                              { name: "Fatema Begum", id: "PAT-24-002", vitals: "116/78 BP • 99% SpO2", status: "Stable Ward", color: "blue" },
                              { name: "Rahim Uddin", id: "PAT-24-003", vitals: "135/90 BP • 96% SpO2", status: "Urgent Care", color: "amber" },
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-black uppercase">
                                      {getInitials(row.name)}
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-gray-900">{row.name}</p>
                                      <p className="text-[9px] text-gray-400">{row.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-600 font-bold">{row.vitals}</td>
                                <td className="px-4 py-3">
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                                    row.color === "red" && "bg-emergency-red/10 text-emergency-red border-emergency-red/20",
                                    row.color === "blue" && "bg-medical-blue/10 text-medical-blue border-medical-blue/20",
                                    row.color === "amber" && "bg-warning-amber/10 text-warning-amber border-warning-amber/20"
                                  )}>
                                    {row.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <Link 
                                    href="/opd"
                                    className="bg-medical-blue text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all"
                                  >
                                    Diagnose
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Completed Consultations: 12 Patients</span>
                      <Link href="/opd" className="font-bold text-medical-blue hover:underline">Full Consultation Board</Link>
                    </div>
                  </div>
                </div>
              </main>
            </>
          ) : (
            
            // =========================================================================
            // 5. HOSPITAL OVERVIEW - ADMIN & SUPER ADMIN
            // =========================================================================
            <>
              <HMSHeader title="Hospital Overview" />
              
              <main className="p-6 space-y-6 animate-in fade-in duration-500">
                {/* Admin Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  <StatCard label="Today's Patients" value="148" icon={Users} color="green" trend="+12%" trendUp={true} />
                  <StatCard label="Appointments" value="86" icon={Calendar} color="blue" trend="+5%" trendUp={true} />
                  <StatCard label="Admitted (IPD)" value="42" icon={Bed} color="purple" trend="+2" trendUp={true} />
                  <StatCard label="Available Beds" value="18/60" icon={Activity} color="amber" />
                  <StatCard label="Today's Revenue" value="৳1,24,500" icon={TrendingUp} color="teal" trend="+৳8,400" trendUp={true} />
                  <StatCard label="Emergency" value={String(emergencyCount)} icon={AlertTriangle} color="red" trend="+1" trendUp={false} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Appointment Timeline */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 flex flex-col justify-between hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300 lg:col-span-2">
                    <div>
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-5 h-5 text-medical-blue" />
                          Appointment Timeline
                        </h2>
                        <Link href="/appointments" className="text-xs font-bold text-medical-green hover:underline">View All</Link>
                      </div>
                      
                      <div className="overflow-y-auto max-h-[380px] no-scrollbar">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50/50 sticky top-0 z-10 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Time</th>
                              <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Patient</th>
                              <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Clinician</th>
                              <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3.5"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {[
                              { time: "09:30 AM", patient: "Abul Kashem", id: "PAT-24-001", doctor: "Dr. Akram (Cardiology)", status: "Waiting", color: "amber" },
                              { time: "10:00 AM", patient: "Fatema Begum", id: "PAT-24-002", doctor: "Dr. Sarah (Super Admin)", status: "In Progress", color: "blue" },
                              { time: "10:30 AM", patient: "Rahim Uddin", id: "PAT-24-003", doctor: "Dr. Karim (Medicine)", status: "Completed", color: "green" },
                              { time: "11:00 AM", patient: "Sumi Akter", id: "PAT-24-004", doctor: "Dr. Rahman (Gynae)", status: "Waiting", color: "amber" },
                              { time: "11:30 AM", patient: "Jashim Khan", id: "PAT-24-005", doctor: "Dr. Sarah (Super Admin)", status: "Cancelled", color: "red" },
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-3.5 text-xs font-black text-gray-900">{row.time}</td>
                                <td className="px-6 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                                      {getInitials(row.patient)}
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-gray-900 group-hover:text-medical-green transition-colors">{row.patient}</p>
                                      <p className="text-[9px] text-gray-400 font-medium">{row.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-3.5 text-xs text-gray-600 font-medium">{row.doctor}</td>
                                <td className="px-6 py-3.5">
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border tracking-wider",
                                    row.color === "amber" && "bg-warning-amber/10 text-warning-amber border-warning-amber/20",
                                    row.color === "blue" && "bg-medical-blue/10 text-medical-blue border-medical-blue/20",
                                    row.color === "green" && "bg-medical-green/10 text-medical-green border-medical-green/20",
                                    row.color === "red" && "bg-emergency-red/10 text-emergency-red border-emergency-red/20"
                                  )}>
                                    {row.status}
                                  </span>
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-950">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>Duty Roster Active: 14 Consulting Doctors</span>
                      <Link href="/appointments" className="font-bold text-medical-green hover:underline">Full Bookings</Link>
                    </div>
                  </div>

                  {/* Right Column: Stacked Bed Occupancy & Upcoming Surgeries */}
                  <div className="space-y-6">
                    {/* Bed Occupancy */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 flex items-center gap-6 hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                      <div className="flex-1">
                        <h2 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-1">Bed Occupancy</h2>
                        <p className="text-[10px] text-gray-500 font-medium mb-4">Real-time status across wards</p>
                        <div className="space-y-3">
                          {[
                            { name: "General Ward", val: "24/30 Beds", color: "bg-medical-green" },
                            { name: "ICU", val: "8/10 Beds", color: "bg-purple-hms" },
                            { name: "Emergency Ward", val: "5/10 Beds", color: "bg-emergency-red animate-pulse" },
                            { name: "Cabin Wards", val: "5/10 Beds", color: "bg-medical-blue" },
                          ].map((ward) => (
                            <div key={ward.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={cn("w-2 h-2 rounded-full", ward.color)} />
                                <span className="text-[11px] font-bold text-gray-600">{ward.name}</span>
                              </div>
                              <span className="text-[11px] font-black text-gray-900">{ward.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="w-28 h-28 relative flex items-center justify-center shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={bedData}
                              innerRadius={34}
                              outerRadius={46}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {bedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-base font-black text-gray-900 leading-none">70%</span>
                          <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider mt-0.5">Full</span>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Surgeries */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 overflow-hidden hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                      <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-emergency-red animate-pulse" /> Upcoming Surgeries
                        </h2>
                        <span className="bg-emergency-red text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">3 Today</span>
                      </div>
                      
                      <div className="p-4 space-y-3.5">
                        {[
                          { patient: "Mofizur Rahman", dr: "Dr. Akram (Cardiology)", time: "02:00 PM", room: "OT-2" },
                          { patient: "Nasrin Akter", dr: "Dr. Shaila (Gynae)", time: "04:30 PM", room: "OT-1" },
                          { patient: "Kamal Uddin", dr: "Dr. Zaman (Orthopedics)", time: "06:00 PM", room: "OT-3" },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all group">
                            <div className="w-11 h-11 bg-gray-100 rounded-xl flex flex-col items-center justify-center shrink-0 border border-gray-200/40 shadow-sm">
                              <span className="text-[8px] font-black text-gray-400 leading-none">ROOM</span>
                              <span className="text-sm font-black text-medical-blue leading-none mt-1">{s.room.split("-")[1]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-900 truncate">{s.patient}</p>
                              <p className="text-[10px] text-gray-500 truncate mt-0.5">{s.dr}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-black text-gray-900">{s.time}</p>
                              <p className="text-[9px] font-bold text-medical-green mt-0.5 uppercase tracking-wider">{s.room}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patient Visit & Revenue Curve Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-medical-green" /> Patient Intake Visit Trend
                    </h2>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={visitData}>
                          <defs>
                            <linearGradient id="colorOpd" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorIpd" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorEmergency" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                          <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' }} />
                          <Area type="monotone" dataKey="opd" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorOpd)" />
                          <Area type="monotone" dataKey="ipd" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorIpd)" />
                          <Area type="monotone" dataKey="emergency" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorEmergency)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-teal-hms" /> Revenue Breakdown (৳)
                    </h2>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
                          <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.4)' }} contentStyle={{ borderRadius: '16px', border: 'none', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' }} />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={45}>
                            {revenueData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={[ "#10B981", "#3B82F6", "#0694A2", "#7E3AF2", "#9CA3AF" ][index]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Third Row: Pending Lab Results & Low Stock Medicines */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pending Lab Results */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 overflow-hidden hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-teal-hms animate-pulse" />
                        Pending Lab Results
                      </h2>
                      <Link href="/lab" className="text-xs font-bold text-teal-hms hover:underline">View All</Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Patient</th>
                            <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Diagnostic Test</th>
                            <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3.5"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { patient: "Zubair Ahmed", test: "Complete Blood Count", time: "2h ago", status: "Processing", color: "blue" },
                            { patient: "Lina Khan", test: "Lipid Profile (Cholesterols)", time: "3h ago", status: "Pending Queue", color: "amber" },
                            { patient: "Saiful Islam", test: "RBS (Diabetes Sugar)", time: "4h ago", status: "Ready Dispatched", color: "green" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-6 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center text-[9px] font-black uppercase">
                                    {getInitials(row.patient)}
                                  </div>
                                  <span className="text-xs font-bold text-gray-900 group-hover:text-teal-hms transition-colors">{row.patient}</span>
                                </div>
                              </td>
                              <td className="px-6 py-3.5 text-xs text-gray-600 font-medium">{row.test}</td>
                              <td className="px-6 py-3.5 text-xs text-gray-400 font-bold">{row.time}</td>
                              <td className="px-6 py-3.5">
                                <span className={cn(
                                  "px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider",
                                  row.color === "blue" && "bg-medical-blue/10 text-medical-blue border-medical-blue/20",
                                  row.color === "amber" && "bg-warning-amber/10 text-warning-amber border-warning-amber/20",
                                  row.color === "green" && "bg-medical-green/10 text-medical-green border-medical-green/20"
                                )}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 text-right">
                                <Link href="/lab" className="text-xs font-black text-medical-green hover:underline">View</Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Low Stock Medicines */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 overflow-hidden hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                        <Pill className="w-5 h-5 text-warning-amber" />
                        Low Stock Medications
                      </h2>
                      <Link href="/pharmacy" className="text-xs font-bold text-warning-amber hover:underline">Inventory</Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Medicine Name</th>
                            <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Available</th>
                            <th className="px-6 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Reorder Level</th>
                            <th className="px-6 py-3.5"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { name: "Napa Extend (500mg)", stock: 450, reorder: 1000, category: "Tablet" },
                            { name: "Ciprocin (250mg)", stock: 120, reorder: 500, category: "Capsule" },
                            { name: "Sergel (20mg)", stock: 80, reorder: 400, category: "Capsule" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 transition-colors bg-red-50/5 group">
                              <td className="px-6 py-3.5">
                                <p className="text-xs font-bold text-gray-900">{row.name}</p>
                                <p className="text-[9px] text-gray-500 font-medium">{row.category}</p>
                              </td>
                              <td className="px-6 py-3.5">
                                <span className="text-xs font-black text-emergency-red bg-red-50 border border-red-100 px-2 py-0.5 rounded">{row.stock} Units</span>
                              </td>
                              <td className="px-6 py-3.5 text-xs text-gray-500 font-bold">{row.reorder} Units</td>
                              <td className="px-6 py-3.5 text-right">
                                <Link 
                                  href="/pharmacy"
                                  className="bg-medical-green text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all inline-block"
                                >
                                  Restock
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Dynamic Recent Activities Feed */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/40 hover:shadow-2xl hover:border-gray-200/80 transition-all duration-300">
                  <h2 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-medical-blue animate-pulse" /> Recent Activities
                  </h2>
                  
                  <div className="space-y-6 relative">
                    {[
                      { type: "admission", text: "New patient admitted to ICU (Bed 04)", time: "10 mins ago", color: "purple" },
                      { type: "emergency", text: "Emergency alert: Ambulance incoming in 5 mins", time: "25 mins ago", color: "red", pulse: true },
                      { type: "discharge", text: "Patient Abir Hossain discharged from General Ward", time: "1 hour ago", color: "blue" },
                      { type: "registration", text: "New doctor Dr. Anika joined Cardiology dept", time: "2 hours ago", color: "green" },
                    ].map((activity, i) => (
                      <div key={i} className="flex gap-4 relative group">
                        {i !== 3 && <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-gray-100 group-hover:bg-gray-200 transition-colors" />}
                        
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 relative transition-transform duration-300 group-hover:scale-110",
                          activity.color === "purple" && "bg-purple-hms/10 text-purple-hms",
                          activity.color === "red" && "bg-emergency-red/10 text-emergency-red",
                          activity.color === "blue" && "bg-medical-blue/10 text-medical-blue",
                          activity.color === "green" && "bg-medical-green/10 text-medical-green",
                        )}>
                          
                          {/* Heartbeat Pulsar Wave */}
                          {activity.pulse && (
                            <span className="w-6 h-6 bg-red-400 rounded-full animate-ping opacity-35 absolute pointer-events-none" />
                          )}
                          
                          <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", 
                            activity.color === "purple" && "bg-purple-hms",
                            activity.color === "red" && "bg-emergency-red",
                            activity.color === "blue" && "bg-medical-blue",
                            activity.color === "green" && "bg-medical-green",
                          )} />
                        </div>
                        
                        <div className="bg-gray-50/20 group-hover:bg-gray-50/50 p-2.5 rounded-xl flex-1 border border-transparent group-hover:border-gray-100 transition-all duration-300">
                          <p className="text-xs font-bold text-gray-900 leading-snug">{activity.text}</p>
                          <p className="text-[10px] text-gray-400 mt-1 font-bold">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </>
          )}
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
