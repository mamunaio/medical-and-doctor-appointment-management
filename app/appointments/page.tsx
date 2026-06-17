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
  CheckCircle2,
  Bell,
  MessageSquare,
  UserX,
  FileEdit,
  Printer,
  FileText,
  Video,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = useState<any>(null);
  const [cancelData, setCancelData] = useState<any>(null);
  const [noteData, setNoteData] = useState<any>(null);
  const [quickNote, setQuickNote] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const { token, user } = useAuthStore();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (!target.closest('.action-dropdown-container')) {
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh or optimistically update
        toast.success("Appointment updated successfully");
        fetchAppointments(search);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
      setOpenDropdown(null);
    }
  };

  const handleCancelSubmit = async () => {
    if (!cancelData) return;
    await handleUpdateStatus(cancelData._id, 'cancelled');
    setCancelData(null);
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !rescheduleData) return;
    setActionLoading(rescheduleData._id);
    try {
      const res = await fetch(`/api/appointments/${rescheduleData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          date: newDate, 
          timeSlot: newTime,
          status: 'booked' // Reset status to booked if rescheduling
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRescheduleData(null);
        setNewDate("");
        setNewTime("");
        toast.success("Appointment rescheduled successfully");
        fetchAppointments(search);
      } else {
        toast.error(data.message || "Failed to reschedule");
      }
    } catch (error) {
      console.error("Reschedule error:", error);
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendReminder = async (id: string) => {
    // In a real app, you'd call an API to send SMS/Email and update the DB flag
    toast.success("Reminder sent successfully to patient!");
    setOpenDropdown(null);
  };

  const handleSaveNote = async () => {
    if (!token || !noteData) return;
    setActionLoading(noteData._id);
    try {
      const res = await fetch(`/api/appointments/${noteData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: quickNote }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Note saved successfully");
        fetchAppointments(search);
        setNoteData(null);
      } else {
        toast.error(data.message || "Failed to save note");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = (actionType: string) => {
    if (selectedIds.length === 0) return;
    if (actionType === 'remind') {
      toast.success(`Sent reminders to ${selectedIds.length} patients.`);
    } else if (actionType === 'cancel') {
      toast.success(`Cancelled ${selectedIds.length} appointments.`);
    }
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAppointments.length && filteredAppointments.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAppointments.map(a => a._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Booked</span>;
      case 'waiting':
        return <span className="bg-yellow-50 text-yellow-600 border border-yellow-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>Checked In</span>;
      case 'in_consultation':
        return <span className="bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>In Consultation</span>;
      case 'completed':
        return <span className="bg-green-50 text-medical-green border border-green-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-medical-green"></span>Completed</span>;
      case 'cancelled':
        return <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>Cancelled</span>;
      case 'no_show':
        return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>No Show</span>;
      default:
        return <span className="bg-gray-50 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>{status}</span>;
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (activeTab === "active") {
      return app.status !== "completed" && app.status !== "cancelled";
    }
    if (activeTab === "today") {
      const today = new Date().toDateString();
      return new Date(app.date).toDateString() === today;
    }
    if (activeTab === "completed") {
      return app.status === "completed";
    }
    if (activeTab === "telehealth") {
      return app.isOnline === true;
    }
    
    if (filterStatus !== "all" && app.status !== filterStatus) {
      return false;
    }
    
    if (filterDate) {
      const appDate = new Date(app.date).toISOString().split('T')[0];
      if (appDate !== filterDate) return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterDate("");
    setShowFilters(false);
  };

  const hasActiveFilters = filterStatus !== "all" || filterDate !== "";

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

          {/* Smart Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: "active", label: "Active Queue" },
              { id: "today", label: "Today's Queue" },
              { id: "telehealth", label: "Telehealth" },
              { id: "completed", label: "Completed" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all",
                  activeTab === tab.id 
                    ? "bg-medical-blue text-white shadow-md shadow-medical-blue/20" 
                    : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                )}
              >
                {tab.label}
              </button>
            ))}
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
              <div className="flex gap-2 relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "px-5 py-3 rounded-2xl text-xs font-bold border flex items-center gap-2 transition-all shadow-sm",
                    hasActiveFilters || showFilters
                      ? "bg-medical-blue text-white border-medical-blue hover:bg-blue-700"
                      : "bg-white text-gray-600 border-gray-200 hover:border-medical-blue hover:text-medical-blue"
                  )}
                >
                  <Filter className="w-4 h-4" /> 
                  Filter Options
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-red-400 absolute top-2 right-2 border border-white"></span>
                  )}
                </button>

                {showFilters && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 z-40 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label>
                        <select 
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all"
                        >
                          <option value="all">All Statuses</option>
                          <option value="booked">Booked</option>
                          <option value="waiting">Checked-in (Waiting)</option>
                          <option value="in_consultation">In Consultation</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Specific Date</label>
                        <input 
                          type="date" 
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button 
                        onClick={clearFilters}
                        className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
                      >
                        Clear
                      </button>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="flex-1 px-4 py-2 bg-medical-blue hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-medical-blue/20 transition-all"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="bg-blue-50/50 px-6 py-3 border-b border-blue-100 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
                <span className="text-sm font-bold text-blue-800">
                  {selectedIds.length} appointment{selectedIds.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleBulkAction('remind')}
                    className="px-4 py-2 bg-white text-medical-blue border border-blue-200 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-50 transition-all flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> Bulk Remind
                  </button>
                  <button 
                    onClick={() => handleBulkAction('cancel')}
                    className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold shadow-sm hover:bg-red-50 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Bulk Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-5 w-10 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.length === filteredAppointments.length && filteredAppointments.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-medical-blue focus:ring-medical-blue"
                      />
                    </th>
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
                      <td colSpan={7} className="px-6 py-20 text-center">
                        <Loader2 className="w-10 h-10 text-medical-blue animate-spin mx-auto mb-4" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Appointments...</p>
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-24 text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-8 border-white shadow-sm">
                          <Calendar className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">No Appointments Found</h3>
                        <p className="text-sm font-medium text-gray-500">Try adjusting your search criteria or book a new appointment.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app, i) => (
                      <tr key={app._id} className="hover:bg-gray-50/80 transition-colors group relative">
                        <td className="px-6 py-5 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.includes(app._id)}
                            onChange={() => toggleSelect(app._id)}
                            className="w-4 h-4 rounded border-gray-300 text-medical-blue focus:ring-medical-blue"
                          />
                        </td>
                        <td className="px-8 py-5 relative group/patient">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.patient?.name || "Patient"}`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <Link href={`/patients/${app.patient?._id}`} className="text-sm font-black text-gray-900 group-hover:text-medical-blue transition-colors">{app.patient?.name || "Unknown Patient"}</Link>
                              <p className="text-[10px] font-black text-medical-blue uppercase tracking-widest mt-0.5">{app.appointmentId || "No ID"}</p>
                            </div>
                          </div>

                          {/* Hover Card */}
                          <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-gray-100 p-4 z-[60] opacity-0 invisible group-hover/patient:opacity-100 group-hover/patient:visible transition-all duration-200">
                            <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-3">
                              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                {app.patient?.name?.charAt(0) || "P"}
                              </div>
                              <div>
                                <p className="text-sm font-black text-gray-900">{app.patient?.name}</p>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{app.patient?.gender || "Unknown"} • {app.patient?.bloodGroup || "N/A"}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-400">Phone</span>
                                <span className="font-bold text-gray-700">{app.patient?.phone || "N/A"}</span>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-400">Last Visit</span>
                                <span className="font-bold text-gray-700">Unknown</span>
                              </div>
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
                          {app.tokenNumber && (
                            <div className="mt-1.5 inline-block bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black text-gray-500 uppercase tracking-widest">
                              Token: #{app.tokenNumber}
                            </div>
                          )}
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
                          <div className="action-dropdown-container flex items-center justify-end gap-1 relative">
                            {/* Inline Quick Actions */}
                            {app.status === 'booked' && (
                              <button 
                                onClick={() => handleUpdateStatus(app._id, 'waiting')}
                                disabled={actionLoading === app._id}
                                className="px-3 py-1.5 mr-2 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-yellow-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                              >
                                {actionLoading === app._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Check-In
                              </button>
                            )}
                            {app.status === 'waiting' && (user?.role === 'doctor' || user?.role === 'super_admin') && (
                              <button 
                                onClick={() => handleUpdateStatus(app._id, 'in_consultation')}
                                disabled={actionLoading === app._id}
                                className="px-3 py-1.5 mr-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                              >
                                {actionLoading === app._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Stethoscope className="w-3 h-3" />} Start Consult
                              </button>
                            )}
                            {app.status === 'in_consultation' && (user?.role === 'doctor' || user?.role === 'super_admin') && (
                              <button 
                                onClick={() => handleUpdateStatus(app._id, 'completed')}
                                disabled={actionLoading === app._id}
                                className="px-3 py-1.5 mr-2 bg-green-50 text-medical-green border border-green-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                              >
                                {actionLoading === app._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />} Complete
                              </button>
                            )}

                            <Link href={`/appointments/${app._id}`} className="p-2 bg-white border border-gray-200 hover:border-medical-blue text-gray-400 hover:text-medical-blue rounded-xl transition-all shadow-sm">
                              <Eye className="w-4 h-4" />
                            </Link>
                            
                            {app.status !== 'cancelled' && (
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
                            )}

                            {/* Dropdown Menu */}
                            {openDropdown === app._id && (
                              <div className="absolute top-full right-8 mt-2 w-48 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {(user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'receptionist') && (
                                  <>
                                    {/* 1. Options for Booked / Waiting / No Show */}
                                    {(app.status === 'booked' || app.status === 'waiting' || app.status === 'no_show') && (
                                      <>
                                        {(app.status === 'booked' || app.status === 'waiting') && (
                                          <>
                                            <button 
                                              onClick={() => handleUpdateStatus(app._id, 'waiting')}
                                              disabled={actionLoading === app._id || app.status === 'waiting'}
                                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-green-50 hover:text-medical-green flex items-center gap-3 transition-colors disabled:opacity-50"
                                            >
                                              {actionLoading === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Mark Checked-in
                                            </button>
                                            <button 
                                              onClick={() => handleUpdateStatus(app._id, 'no_show')}
                                              disabled={actionLoading === app._id}
                                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-3 transition-colors disabled:opacity-50"
                                            >
                                              <UserX className="w-4 h-4" /> Mark as No-Show
                                            </button>
                                            <button 
                                              onClick={() => handleSendReminder(app._id)}
                                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 flex items-center gap-3 transition-colors"
                                            >
                                              <Bell className="w-4 h-4" /> Send Reminder
                                            </button>
                                          </>
                                        )}
                                        <button 
                                          onClick={() => {
                                            setRescheduleData(app);
                                            setNewDate(app.date.split('T')[0]);
                                            setNewTime(app.timeSlot);
                                            setOpenDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                                        >
                                          <Edit className="w-4 h-4" /> Reschedule
                                        </button>
                                        <div className="h-px bg-gray-100 my-1"></div>
                                        <button 
                                          onClick={() => {
                                            setCancelData(app);
                                            setOpenDropdown(null);
                                          }}
                                          disabled={actionLoading === app._id}
                                          className="w-full text-left px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors disabled:opacity-50"
                                        >
                                          {actionLoading === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Cancel Appointment
                                        </button>
                                      </>
                                    )}

                                    {/* 2. Options for Completed */}
                                    {app.status === 'completed' && (
                                      <>
                                        <button 
                                          onClick={() => {
                                            toast.success("Generating Prescription PDF...");
                                            setOpenDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-medical-blue flex items-center gap-3 transition-colors"
                                        >
                                          <FileText className="w-4 h-4" /> Print Prescription
                                        </button>
                                        <button 
                                          onClick={() => {
                                            toast.success("Generating Invoice...");
                                            setOpenDropdown(null);
                                          }}
                                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-green-50 hover:text-medical-green flex items-center gap-3 transition-colors"
                                        >
                                          <Printer className="w-4 h-4" /> Print Invoice
                                        </button>
                                        <div className="h-px bg-gray-100 my-1"></div>
                                        <Link 
                                          href={`/appointments/book?patientId=${app.patient?._id}`}
                                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-3 transition-colors"
                                        >
                                          <RefreshCw className="w-4 h-4" /> Book Follow-up
                                        </Link>
                                      </>
                                    )}

                                    {/* 3. Global / Common Options (except cancelled) */}
                                    {app.status !== 'cancelled' && (
                                      <>
                                        {(app.status === 'booked' || app.status === 'waiting' || app.status === 'in_consultation' || app.status === 'no_show') && (
                                          <button 
                                            onClick={() => {
                                              setNoteData(app);
                                              setQuickNote(app.notes || "");
                                              setOpenDropdown(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center gap-3 transition-colors border-t border-gray-100"
                                          >
                                            <FileEdit className="w-4 h-4" /> Add Quick Note
                                          </button>
                                        )}
                                        {app.isOnline && (app.status === 'booked' || app.status === 'waiting' || app.status === 'in_consultation') && (
                                          <button 
                                            onClick={() => {
                                              toast.success("Joining Telehealth Call...");
                                              setOpenDropdown(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-3 transition-colors border-t border-blue-50"
                                          >
                                            <Video className="w-4 h-4" /> Join Telehealth Call
                                          </button>
                                        )}
                                      </>
                                    )}
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

      {/* Reschedule Modal */}
      {rescheduleData && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleData(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">New Date</label>
                <input 
                  type="date" 
                  required
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">New Time Slot</label>
                <input 
                  type="time" 
                  required
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setRescheduleData(null)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={actionLoading === rescheduleData._id}
                  className="flex-1 py-3 px-4 bg-medical-blue text-white rounded-xl font-bold text-sm shadow-lg shadow-medical-blue/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === rescheduleData._id && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelData && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Cancel Appointment?</h3>
              <p className="text-sm font-medium text-gray-500">
                Are you sure you want to cancel the appointment for <span className="font-bold text-gray-900">{cancelData.patient?.name}</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setCancelData(null)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Go Back
              </button>
              <button 
                type="button" 
                onClick={handleCancelSubmit}
                disabled={actionLoading === cancelData._id}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === cancelData._id && <Loader2 className="w-4 h-4 animate-spin" />}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Note Modal */}
      {noteData && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">Quick Note</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">For {noteData.patient?.name}</p>
              </div>
              <button onClick={() => setNoteData(null)} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Internal Note / Complaint</label>
                <textarea 
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Enter details..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all h-32 resize-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <button 
                type="button" 
                onClick={handleSaveNote}
                disabled={actionLoading === noteData._id}
                className="w-full py-3.5 px-4 bg-medical-blue text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-medical-blue/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading === noteData._id ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
