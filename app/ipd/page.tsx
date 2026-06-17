"use client";

import React, { useState, useEffect, useCallback } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  Bed, Users, UserPlus, LogOut, Search, Filter, MoreVertical,
  Activity, Plus, ArrowRight, ShieldAlert, ChevronRight, Loader2,
  CheckCircle2, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "react-hot-toast";

const tabs = [
  { id: "admissions", label: "Admitted Patients", icon: Users },
  { id: "beds", label: "Bed Management", icon: Bed },
  { id: "new", label: "New Admission", icon: UserPlus },
];

export default function IPDManagement() {
  const { token, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("admissions");
  
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All Wards");

  // New Admission Form State
  const [formData, setFormData] = useState({
    patient: "",
    ward: "General Ward",
    bed: "",
    admittingDoctor: "",
    admissionType: "planned",
    admissionDiagnosis: ""
  });

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [admissionsRes, bedsRes, patientsRes, doctorsRes] = await Promise.all([
        fetch("/api/ipd-admissions", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/beds", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/patients", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/doctors", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const [admData, bedData, patData, docData] = await Promise.all([
        admissionsRes.json(),
        bedsRes.json(),
        patientsRes.json(),
        doctorsRes.json()
      ]);

      if (admData.success) setAdmissions(admData.data || []);
      if (bedData.success) setBeds(bedData.data || []);
      if (patData.success) setPatients(patData.data || []);
      if (docData.success) setDoctors(docData.data || []);

    } catch (err) {
      toast.error("Failed to fetch IPD data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived state for beds
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === "occupied").length;
  const availableBeds = beds.filter(b => b.status === "available").length;
  const cleaningBeds = beds.filter(b => b.status === "cleaning" || b.status === "maintenance").length;

  // Filter admissions
  const filteredAdmissions = admissions.filter(adm => {
    if (wardFilter !== "All Wards" && adm.ward !== wardFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return adm.patient?.name?.toLowerCase().includes(q) || 
             adm.patient?.patientId?.toLowerCase().includes(q);
    }
    return true;
  });

  // Unique wards for filter
  const uniqueWards = Array.from(new Set(beds.map(b => b.ward)));
  const wardsToDisplay = uniqueWards.length > 0 ? uniqueWards : ["General Ward", "ICU", "Cabin", "Emergency"];

  // Available beds for dropdown based on selected ward
  const availableBedsForWard = beds.filter(b => b.status === "available" && b.ward === formData.ward);

  const handleAdmissionSubmit = async () => {
    if (!token) return;
    if (!formData.patient || !formData.bed || !formData.admittingDoctor) {
      toast.error("Please select Patient, Bed, and Admitting Doctor.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/ipd-admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          // If the admitting doctor is not the current user, the API currently overwrites it with user.userId
          // We pass it anyway, in case API gets updated to accept admittingDoctor from body.
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Patient admitted successfully!");
        setFormData({
          patient: "",
          ward: "General Ward",
          bed: "",
          admittingDoctor: "",
          admissionType: "planned",
          admissionDiagnosis: ""
        });
        setActiveTab("admissions");
        fetchData();
      } else {
        toast.error(data.message || "Failed to admit patient");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDischarge = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to discharge this patient?")) return;
    
    setActionLoading(id);
    try {
      const res = await fetch(`/api/ipd-admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "discharged" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Patient discharged successfully");
        fetchData();
      } else {
        toast.error(data.message || "Failed to discharge patient");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="IPD (Inpatient) Management" />
        
        <main className="p-6">
          <div className="bg-white p-2 rounded-2xl border border-border-hms flex gap-2 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 min-w-[150px] flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-purple-hms text-white shadow-lg shadow-purple-hms/20" 
                    : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "admissions" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white rounded-2xl border border-border-hms overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border-hms flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search admitted patients..." 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-hms outline-none" 
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={wardFilter}
                      onChange={(e) => setWardFilter(e.target.value)}
                      className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-purple-hms outline-none"
                    >
                      <option value="All Wards">All Wards</option>
                      {wardsToDisplay.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => setActiveTab("new")}
                      className="bg-purple-hms text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-purple-hms/20 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Admit Patient
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                  {loading ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="w-8 h-8 text-purple-hms animate-spin" />
                    </div>
                  ) : filteredAdmissions.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-bold">No admitted patients found.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient / ID</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bed / Ward</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Doctor</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Admit Date</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Diagnosis</th>
                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredAdmissions.map((row) => (
                          <tr key={row._id} className="hover:bg-gray-50 transition-all group">
                            <td className="px-6 py-5">
                              <p className="text-sm font-bold text-gray-900">{row.patient?.name}</p>
                              <p className="text-[10px] text-gray-400 font-medium">ID: {row.patient?.patientId}</p>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-black text-purple-hms">{row.bed?.bedNumber}</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase">{row.ward}</p>
                            </td>
                            <td className="px-6 py-5 text-sm font-bold text-gray-600">{row.admittingDoctor?.name}</td>
                            <td className="px-6 py-5 text-sm text-gray-500">
                              {new Date(row.admissionDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-5 text-sm font-medium text-gray-600 max-w-xs truncate">
                              {row.admissionDiagnosis || "N/A"}
                            </td>
                            <td className="px-6 py-5">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                row.status === "admitted" && "bg-blue-50 text-blue-600 border border-blue-100",
                                row.status === "discharged" && "bg-gray-100 text-gray-500",
                                row.status === "transferred" && "bg-orange-50 text-orange-600",
                              )}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              {row.status === "admitted" && (
                                <button 
                                  onClick={() => handleDischarge(row._id)}
                                  disabled={actionLoading === row._id}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1 ml-auto"
                                >
                                  {actionLoading === row._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <LogOut className="w-3 h-3" />}
                                  Discharge
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "beds" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total Beds", val: totalBeds.toString(), color: "gray" },
                  { label: "Occupied", val: occupiedBeds.toString(), color: "red" },
                  { label: "Available", val: availableBeds.toString(), color: "green" },
                  { label: "Cleaning/Maint.", val: cleaningBeds.toString(), color: "amber" },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-border-hms flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                      <p className="text-3xl font-black text-gray-900">{s.val}</p>
                    </div>
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      s.color === "red" && "bg-emergency-red/10 text-emergency-red",
                      s.color === "green" && "bg-medical-green/10 text-medical-green",
                      s.color === "amber" && "bg-warning-amber/10 text-warning-amber",
                      s.color === "gray" && "bg-gray-100 text-gray-500",
                    )}>
                      <Bed className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>

              {wardsToDisplay.map(ward => {
                const wardBeds = beds.filter(b => b.ward === ward);
                if (wardBeds.length === 0) return null;

                return (
                  <div key={ward} className="bg-white p-8 rounded-2xl border border-border-hms shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Visual Floor Plan - {ward}</h3>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-medical-green"></div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emergency-red"></div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Occupied</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-warning-amber"></div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Cleaning/Maintenance</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                      {wardBeds.map((bed) => {
                        const isAvailable = bed.status === "available";
                        const isOccupied = bed.status === "occupied";
                        
                        return (
                          <div 
                            key={bed._id} 
                            className={cn(
                              "aspect-[4/3] rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all relative group",
                              isAvailable ? "border-medical-green/20 bg-medical-green/5 text-medical-green hover:bg-medical-green/10" :
                              isOccupied ? "border-emergency-red/20 bg-emergency-red/5 text-emergency-red hover:bg-emergency-red/10" :
                              "border-warning-amber/20 bg-warning-amber/5 text-warning-amber hover:bg-warning-amber/10"
                            )}
                          >
                            <Bed className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase">{bed.bedNumber}</span>
                            
                            {isOccupied && bed.currentPatient && (
                              <div className="absolute inset-0 bg-black/80 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-1 text-center transition-opacity z-10">
                                <p className="text-[8px] text-white font-bold uppercase truncate w-full px-1">Occupied</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {beds.length === 0 && !loading && (
                <div className="bg-white p-20 text-center rounded-2xl border border-gray-100 shadow-sm">
                  <Bed className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-bold">No beds found in the system. Add beds to see the floor plan.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "new" && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-border-hms p-10 animate-in slide-in-from-bottom-4 duration-500 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Inpatient Admission</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Select Patient</label>
                    <select 
                      value={formData.patient}
                      onChange={e => setFormData(p => ({ ...p, patient: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-purple-hms appearance-none outline-none"
                    >
                      <option value="">-- Select Patient --</option>
                      {patients.map(p => (
                        <option key={p._id} value={p._id}>{p.name} ({p.patientId})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Ward Type</label>
                      <select 
                        value={formData.ward}
                        onChange={e => setFormData(p => ({ ...p, ward: e.target.value, bed: "" }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-purple-hms appearance-none outline-none"
                      >
                        {wardsToDisplay.map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Available Bed</label>
                      <select 
                        value={formData.bed}
                        onChange={e => setFormData(p => ({ ...p, bed: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-purple-hms appearance-none outline-none"
                        disabled={availableBedsForWard.length === 0}
                      >
                        <option value="">-- Select Bed --</option>
                        {availableBedsForWard.map(b => (
                          <option key={b._id} value={b._id}>{b.bedNumber}</option>
                        ))}
                      </select>
                      {availableBedsForWard.length === 0 && <p className="text-[10px] text-red-500 mt-1 font-bold">No beds available</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Admitting Doctor</label>
                    <select 
                      value={formData.admittingDoctor}
                      onChange={e => setFormData(p => ({ ...p, admittingDoctor: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-purple-hms appearance-none outline-none"
                    >
                      <option value="">-- Select Doctor --</option>
                      {doctors.map(d => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Admission Type</label>
                    <div className="flex gap-2">
                      {["emergency", "planned", "transfer"].map(type => (
                        <button 
                          key={type} 
                          onClick={() => setFormData(p => ({ ...p, admissionType: type }))}
                          className={cn(
                            "flex-1 py-3 rounded-xl border text-xs font-bold transition-all uppercase tracking-wider",
                            formData.admissionType === type 
                              ? "bg-purple-hms text-white border-purple-hms shadow-md" 
                              : "border-gray-200 text-gray-600 hover:border-purple-hms hover:text-purple-hms"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-widest">Primary Diagnosis</label>
                    <textarea 
                      value={formData.admissionDiagnosis}
                      onChange={e => setFormData(p => ({ ...p, admissionDiagnosis: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-hms h-32 resize-none outline-none" 
                      placeholder="Reason for admission..."
                    ></textarea>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleAdmissionSubmit}
                disabled={submitting}
                className="w-full mt-10 bg-purple-hms text-white font-black py-4 rounded-xl shadow-lg shadow-purple-hms/20 hover:scale-[1.01] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Confirm Admission
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
