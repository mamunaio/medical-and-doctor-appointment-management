"use client";

import React, { useEffect, useState, useRef } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus,
  Loader2,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CalendarPlus,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Link from "next/link";

export default function PatientList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { token, user } = useAuthStore();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPatients = async (query = "") => {
    if (!token) return;
    setLoading(true);
    const res = await fetch(`/api/patients?search=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      setPatients(data.data || []);
    } else {
      setPatients([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchPatients();
    }
  }, [token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients(search);
  };

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Patient Management" />
        
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
              <Users className="w-6 h-6 text-medical-green" />
              Patient List
            </h2>
            <Link href="/patients/register" className="bg-medical-green text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-medical-green/20 hover:scale-105 transition-all flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> New Registration
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
              <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Name, ID or Phone..." 
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-medical-green/10 focus:border-medical-green outline-none transition-all" 
                />
              </form>
              <div className="flex gap-2">
                <button className="bg-white text-gray-600 px-5 py-3 rounded-2xl text-xs font-bold border border-gray-200 flex items-center gap-2 hover:border-medical-green hover:text-medical-green transition-all shadow-sm">
                  <Filter className="w-4 h-4" /> Filter Options
                </button>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]" ref={dropdownRef}>
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Patient Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Demographics</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Contact Info</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Last Visit</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <Loader2 className="w-10 h-10 text-medical-green animate-spin mx-auto mb-4" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Patients...</p>
                      </td>
                    </tr>
                  ) : patients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-24 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-8 border-white shadow-sm">
                          <Users className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">No Patients Found</h3>
                        <p className="text-sm font-medium text-gray-500">Try adjusting your search criteria or register a new patient.</p>
                      </td>
                    </tr>
                  ) : (
                    patients.map((p, i) => (
                      <tr key={p._id} className="hover:bg-gray-50/80 transition-colors group relative">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <Link href={`/patients/${p._id}`} className="text-sm font-black text-gray-900 group-hover:text-medical-green transition-colors">{p.name}</Link>
                              <p className="text-[10px] font-black text-medical-blue uppercase tracking-widest mt-0.5">{p.patientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-700 uppercase bg-gray-100 px-2 py-1 rounded-md">{p.gender}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase">{p.age || "N/A"}y</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-gray-900">{p.phone}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-0.5">{p.email || "No Email Provided"}</p>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-gray-500">
                            <CalendarPlus className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{p.stats?.lastVisitDate ? new Date(p.stats.lastVisitDate).toLocaleDateString() : "Never visited"}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                            p.isActive ? "bg-green-50 text-medical-green border border-green-100" : "bg-gray-50 text-gray-400 border border-gray-200"
                          )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", p.isActive ? "bg-medical-green" : "bg-gray-400")}></span>
                            {p.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1 relative">
                            <Link href={`/patients/${p._id}`} className="p-2 bg-white border border-gray-200 hover:border-medical-green text-gray-400 hover:text-medical-green rounded-xl transition-all shadow-sm">
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                            
                            {/* Three Dots Button */}
                            <button 
                              onClick={() => setOpenDropdown(openDropdown === p._id ? null : p._id)}
                              className={cn(
                                "p-2 rounded-xl border transition-all shadow-sm",
                                openDropdown === p._id 
                                  ? "bg-gray-100 border-gray-300 text-gray-900" 
                                  : "bg-white border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600"
                              )}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdown === p._id && (
                              <div className="absolute top-full right-8 mt-2 w-56 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <Link href={`/patients/${p._id}`} className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-medical-green flex items-center gap-3 transition-colors">
                                  <Eye className="w-4 h-4" /> View Full Profile
                                </Link>
                                <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-medical-blue flex items-center gap-3 transition-colors">
                                  <CalendarPlus className="w-4 h-4" /> Book Appointment
                                </button>
                                
                                {/* Role Based Access Controls */}
                                {(user?.role === 'super_admin' || user?.role === 'admin') && (
                                  <>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3 transition-colors">
                                      <Edit className="w-4 h-4" /> Edit Details
                                    </button>
                                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                      <Activity className="w-4 h-4" /> Mark Inactive
                                    </button>
                                    <button className="w-full text-left px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors mt-1">
                                      <Trash2 className="w-4 h-4" /> Delete Patient
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
