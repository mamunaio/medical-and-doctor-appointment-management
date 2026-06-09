"use client";

import React, { useEffect, useState, useRef } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Loader2,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Clock,
  User,
  Stethoscope,
  XCircle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Link from "next/link";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
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

  const fetchAppointments = async (query = "") => {
    if (!token) return;
    setLoading(true);
    // You can extend the API to support text search if needed. For now, we'll fetch all and filter locally, or pass date/search params if backend supports it.
    // The current API supports ?date= and ?doctorId= but we'll fetch all for simplicity and show the latest.
    try {
      const res = await fetch(`/api/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        // Simple local filter for demonstration
        let filteredData = data.data || [];
        if (query) {
          const lowerQuery = query.toLowerCase();
          filteredData = filteredData.filter((app: any) => 
            app.patient?.name?.toLowerCase().includes(lowerQuery) ||
            app.doctor?.name?.toLowerCase().includes(lowerQuery) ||
            app.appointmentId?.toLowerCase().includes(lowerQuery)
          );
        }
        setAppointments(filteredData);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments(search);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Booked</span>;
      case 'checked-in':
        return <span className="bg-yellow-50 text-yellow-600 border border-yellow-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>Checked In</span>;
      case 'completed':
        return <span className="bg-green-50 text-medical-green border border-green-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-medical-green"></span>Completed</span>;
      case 'cancelled':
        return <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>Cancelled</span>;
      default:
        return <span className="bg-gray-50 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Appointments" />
        
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
              <Calendar className="w-6 h-6 text-medical-blue" />
              Appointment Scheduling
            </h2>
            <Link href="/appointments/book" className="bg-medical-blue text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-medical-blue/20 hover:scale-105 transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" /> Book Appointment
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
                  placeholder="Search by Patient, Doctor or ID..." 
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all" 
                />
              </form>
              <div className="flex gap-2">
                <button className="bg-white text-gray-600 px-5 py-3 rounded-2xl text-xs font-bold border border-gray-200 flex items-center gap-2 hover:border-medical-blue hover:text-medical-blue transition-all shadow-sm">
                  <Filter className="w-4 h-4" /> Filter Options
                </button>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]" ref={dropdownRef}>
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Patient</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Schedule</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Doctor</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <Loader2 className="w-10 h-10 text-medical-blue animate-spin mx-auto mb-4" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Appointments...</p>
                      </td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-24 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-8 border-white shadow-sm">
                          <Calendar className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">No Appointments Found</h3>
                        <p className="text-sm font-medium text-gray-500">Try adjusting your search criteria or book a new appointment.</p>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((app, i) => (
                      <tr key={app._id} className="hover:bg-gray-50/80 transition-colors group relative">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.patient?.name || "Patient"}`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <Link href={`/patients/${app.patient?._id}`} className="text-sm font-black text-gray-900 group-hover:text-medical-blue transition-colors">{app.patient?.name || "Unknown Patient"}</Link>
                              <p className="text-[10px] font-black text-medical-blue uppercase tracking-widest mt-0.5">{app.appointmentId || "No ID"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold">{new Date(app.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs font-bold">{app.timeSlot}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-900">{app.doctor?.name || "Unassigned"}</span>
                          </div>
                          {app.doctor?.role && <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{app.doctor.role}</p>}
                        </td>
                        <td className="px-8 py-5">
                           <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            app.type === 'consultation' ? "bg-gray-100 text-gray-600" : "bg-purple-50 text-purple-600"
                          )}>
                            {app.type || 'consultation'}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1 relative">
                            <Link href={`/appointments/${app._id}`} className="p-2 bg-white border border-gray-200 hover:border-medical-blue text-gray-400 hover:text-medical-blue rounded-xl transition-all shadow-sm">
                              <Eye className="w-4 h-4" />
                            </Link>
                            
                            {/* Three Dots Button */}
                            <button 
                              onClick={() => setOpenDropdown(openDropdown === app._id ? null : app._id)}
                              className={cn(
                                "p-2 rounded-xl border transition-all shadow-sm",
                                openDropdown === app._id 
                                  ? "bg-gray-100 border-gray-300 text-gray-900" 
                                  : "bg-white border-gray-200 hover:border-gray-300 text-gray-400 hover:text-gray-600"
                              )}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdown === app._id && (
                              <div className="absolute top-full right-8 mt-2 w-48 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {(user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'receptionist') && (
                                  <>
                                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-green-50 hover:text-medical-green flex items-center gap-3 transition-colors">
                                      <CheckCircle2 className="w-4 h-4" /> Mark Checked-in
                                    </button>
                                    <button className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
                                      <Edit className="w-4 h-4" /> Reschedule
                                    </button>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button className="w-full text-left px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors mt-1">
                                      <XCircle className="w-4 h-4" /> Cancel Appointment
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
