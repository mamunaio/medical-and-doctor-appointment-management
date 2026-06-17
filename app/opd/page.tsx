"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter,
  Loader2,
  ChevronRight,
  Play,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "react-hot-toast";

interface Appointment {
  _id: string;
  appointmentId: string;
  patient: { _id: string; name: string; patientId: string; phone: string; gender: string; bloodGroup?: string };
  doctor: { _id: string; name: string; role: string };
  date: string;
  timeSlot: string;
  tokenNumber?: number;
  status: string;
  chiefComplaint?: string;
  visitType: string;
  isOnline?: boolean;
}

export default function OPD() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("waiting");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data || []);
      } else {
        setAppointments([]);
      }
    } catch {
      toast.error("Failed to fetch appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Status updated successfully");
        fetchAppointments();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const openConsultation = (apt: Appointment) => {
    router.push(`/opd/consultation/${apt._id}`);
  };

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === "waiting") return apt.status === "waiting" || apt.status === "booked";
    if (activeTab === "in_consultation") return apt.status === "in_consultation";
    if (activeTab === "completed") return apt.status === "completed";
    return true;
  }).filter(apt => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      apt.patient?.name?.toLowerCase().includes(q) ||
      apt.appointmentId?.toLowerCase().includes(q) ||
      apt.patient?.patientId?.toLowerCase().includes(q) ||
      apt.doctor?.name?.toLowerCase().includes(q)
    );
  });

  const waitingCount = appointments.filter(a => a.status === "waiting" || a.status === "booked").length;
  const inConsultCount = appointments.filter(a => a.status === "in_consultation").length;
  const completedCount = appointments.filter(a => a.status === "completed").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>Booked</span>;
      case 'waiting':
        return <span className="bg-yellow-50 text-yellow-600 border border-yellow-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>Waiting</span>;
      case 'in_consultation':
        return <span className="bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>In Consultation</span>;
      case 'completed':
        return <span className="bg-green-50 text-medical-green border border-green-100 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-medical-green"></span>Completed</span>;
      default:
        return <span className="bg-gray-50 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="OPD Management" />
        
        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-border-hms p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{waitingCount}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waiting / Queue</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border-hms p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{inConsultCount}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Consultation</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border-hms p-5 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-green-50 text-medical-green rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{completedCount}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed Today</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: "waiting", label: "Waiting Queue", count: waitingCount },
              { id: "in_consultation", label: "In Consultation", count: inConsultCount },
              { id: "completed", label: "Completed", count: completedCount },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2",
                  activeTab === tab.id 
                    ? "bg-medical-blue text-white shadow-md shadow-medical-blue/20" 
                    : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                )}
              >
                {tab.label}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-black",
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Patient, ID or Doctor..." 
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all" 
                />
              </div>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-medical-blue animate-spin" />
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-20">
                  <Stethoscope className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-gray-900 mb-1">No Patients Found</h3>
                  <p className="text-sm font-medium text-gray-500">No patients match the current filter.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredAppointments.map((apt) => (
                    <div key={apt._id} className="p-6 hover:bg-gray-50/80 transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.patient?.name || "Patient"}`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-gray-900">{apt.patient?.name || "Unknown"}</h3>
                            {getStatusBadge(apt.status)}
                          </div>
                          <p className="text-[10px] font-black text-medical-blue uppercase tracking-widest mt-0.5">{apt.appointmentId}</p>
                          <div className="flex items-center gap-4 mt-1.5">
                            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {apt.timeSlot}
                            </span>
                            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" /> {apt.doctor?.name}
                            </span>
                            {apt.tokenNumber && (
                              <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Token #{apt.tokenNumber}</span>
                            )}
                          </div>
                          {apt.chiefComplaint && (
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-md">{apt.chiefComplaint}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {apt.status === "booked" && (
                          <button
                            onClick={() => handleUpdateStatus(apt._id, "waiting")}
                            disabled={actionLoading === apt._id}
                            className="px-4 py-2 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-100 transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {actionLoading === apt._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                            Check-In
                          </button>
                        )}
                        {(apt.status === "waiting" || apt.status === "in_consultation") && (
                          <button
                            onClick={() => openConsultation(apt)}
                            className="px-4 py-2 bg-medical-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md shadow-medical-green/20 hover:scale-105 transition-all flex items-center gap-1.5"
                          >
                            <Play className="w-3 h-3" />
                            {apt.status === "waiting" ? "Start Consultation" : "Continue"}
                          </button>
                        )}
                        {apt.status === "completed" && (
                          <button
                            onClick={() => openConsultation(apt)}
                            className="p-2 bg-gray-100 text-gray-400 hover:text-medical-blue rounded-xl transition-all"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
