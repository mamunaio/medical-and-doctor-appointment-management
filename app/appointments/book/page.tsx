"use client";

import React, { useEffect, useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope, 
  Building2, 
  Save, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  Video,
  Hospital,
  RefreshCw,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BookAppointment() {
  const router = useRouter();
  const { token } = useAuthStore();
  
  const [patients, setPatients] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    departmentId: "",
    doctorId: "",
    date: "",
    timeSlot: "",
    type: "consultation",
    visitType: "opd",
    chiefComplaint: "",
  });

  const timeSlots = [
    "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00",
    "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "12:30 - 13:00",
    "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00",
    "16:00 - 16:30", "16:30 - 17:00", "17:00 - 17:30", "17:30 - 18:00",
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [patientsRes, deptsRes, docsRes] = await Promise.all([
          fetch("/api/patients", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/departments", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/doctors", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const patientsData = await patientsRes.json();
        const deptsData = await deptsRes.json();
        const docsData = await docsRes.json();

        if (patientsData.success) setPatients(patientsData.data || []);
        if (deptsData.success) setDepartments(deptsData.data || []);
        if (docsData.success) setDoctors(docsData.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter doctors by selected department
  const filteredDoctors = formData.departmentId 
    ? doctors.filter(doc => doc.doctorProfile?.department?._id === formData.departmentId || doc.doctorProfile?.department === formData.departmentId)
    : doctors;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient: formData.patientId,
          doctor: formData.doctorId,
          department: formData.departmentId || undefined,
          date: formData.date,
          timeSlot: formData.timeSlot,
          type: formData.type,
          visitType: formData.visitType,
          chiefComplaint: formData.chiefComplaint,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/appointments");
      } else {
        setError(data.message || "Failed to book appointment");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPatient = patients.find(p => p._id === formData.patientId);
  const selectedDoctor = doctors.find(d => d._id === formData.doctorId);
  const selectedDept = departments.find(d => d._id === formData.departmentId);

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <HMSHeader title="Book Appointment" />
        
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1400px] mx-auto w-full">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/appointments" className="p-3 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 text-gray-500 hover:text-medical-blue hover:border-medical-blue transition-all hover:-translate-x-1">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                  <CalendarIcon className="w-8 h-8 text-medical-blue" />
                  Appointment Wizard
                </h2>
                <p className="text-sm font-bold text-gray-400 mt-1">Select preferences to book a new appointment</p>
              </div>
            </div>

            {error && (
              <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center p-32 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <Loader2 className="w-12 h-12 text-medical-blue animate-spin mb-4" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Initializing Wizard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                
                {/* Left Column: Form Controls */}
                <div className="flex-1 space-y-8">
                  
                  {/* Section 1: Patient & Department */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 border-b border-gray-100 pb-4">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-medical-blue flex items-center justify-center text-xs">1</span>
                      Primary Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <User className="w-4 h-4 text-medical-blue" /> Select Patient
                        </label>
                        <select
                          required
                          value={formData.patientId}
                          onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-sm font-bold text-gray-700 focus:bg-white focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all appearance-none cursor-pointer hover:border-medical-blue/50"
                        >
                          <option value="" disabled>Choose a patient...</option>
                          {patients.map(p => (
                            <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-medical-blue" /> Department
                        </label>
                        <select
                          value={formData.departmentId}
                          onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value, doctorId: "" }))}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-sm font-bold text-gray-700 focus:bg-white focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all appearance-none cursor-pointer hover:border-medical-blue/50"
                        >
                          <option value="">Any Department</option>
                          {departments.map(d => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Doctor Selection Grid */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 border-b border-gray-100 pb-4">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-medical-blue flex items-center justify-center text-xs">2</span>
                      Select Doctor
                    </h3>
                    
                    {filteredDoctors.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                        <Stethoscope className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-500">No doctors available in this department.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredDoctors.map(doc => {
                          const isSelected = formData.doctorId === doc._id;
                          return (
                            <div 
                              key={doc._id}
                              onClick={() => setFormData(prev => ({ ...prev, doctorId: doc._id }))}
                              className={cn(
                                "relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 group hover:-translate-y-1",
                                isSelected 
                                  ? "border-medical-blue bg-blue-50/30 shadow-[0_8px_20px_rgba(var(--medical-blue),0.15)]" 
                                  : "border-gray-100 hover:border-medical-blue/30 bg-white"
                              )}
                            >
                              {isSelected && (
                                <div className="absolute top-3 right-3 text-medical-blue animate-in zoom-in">
                                  <CheckCircle2 className="w-5 h-5 fill-current text-white" />
                                </div>
                              )}
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200 group-hover:border-medical-blue/30 transition-colors">
                                  <img src={doc.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-black text-gray-900 group-hover:text-medical-blue transition-colors leading-tight">Dr. {doc.name}</h4>
                                  <p className="text-[10px] font-bold text-medical-blue uppercase tracking-wider mt-1 bg-medical-blue/5 inline-block px-2 py-0.5 rounded-md">
                                    {doc.doctorProfile?.department?.name || "General"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Section 3: Date & Time */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 border-b border-gray-100 pb-4">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-medical-blue flex items-center justify-center text-xs">3</span>
                      Schedule
                    </h3>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-medical-blue" /> Select Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-sm font-bold text-gray-700 focus:bg-white focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all cursor-text hover:border-medical-blue/50"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-4 h-4 text-medical-blue" /> Available Time Slots
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {timeSlots.map(slot => {
                            const isSelected = formData.timeSlot === slot;
                            return (
                              <div
                                key={slot}
                                onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                                className={cn(
                                  "py-3 px-2 text-center rounded-xl border-2 cursor-pointer transition-all text-xs font-bold",
                                  isSelected
                                    ? "bg-medical-blue border-medical-blue text-white shadow-md shadow-medical-blue/20 scale-[1.02]"
                                    : "bg-white border-gray-100 text-gray-600 hover:border-medical-blue/30 hover:bg-gray-50"
                                )}
                              >
                                {slot}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Type & Modality */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2 border-b border-gray-100 pb-4">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-medical-blue flex items-center justify-center text-xs">4</span>
                      Visit Configuration
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          Appointment Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'consultation', label: 'Consultation', icon: MessageSquare },
                            { id: 'follow-up', label: 'Follow Up', icon: RefreshCw }
                          ].map(t => {
                            const isSelected = formData.type === t.id;
                            const Icon = t.icon;
                            return (
                              <div
                                key={t.id}
                                onClick={() => setFormData(prev => ({ ...prev, type: t.id }))}
                                className={cn(
                                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                                  isSelected
                                    ? "border-medical-blue bg-blue-50/30 text-medical-blue"
                                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                                )}
                              >
                                <Icon className={cn("w-6 h-6", isSelected ? "text-medical-blue" : "text-gray-400")} />
                                <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          Visit Modality
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'opd', label: 'In-Person', icon: Hospital },
                            { id: 'online', label: 'Video Call', icon: Video }
                          ].map(t => {
                            const isSelected = formData.visitType === t.id;
                            const Icon = t.icon;
                            return (
                              <div
                                key={t.id}
                                onClick={() => setFormData(prev => ({ ...prev, visitType: t.id }))}
                                className={cn(
                                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                                  isSelected
                                    ? "border-medical-blue bg-blue-50/30 text-medical-blue"
                                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                                )}
                              >
                                <Icon className={cn("w-6 h-6", isSelected ? "text-medical-blue" : "text-gray-400")} />
                                <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-gray-100">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        Chief Complaint / Notes (Optional)
                      </label>
                      <textarea
                        value={formData.chiefComplaint}
                        onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                        rows={3}
                        placeholder="Briefly describe the reason for visit..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-sm font-bold text-gray-700 focus:bg-white focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="h-10"></div> {/* Bottom padding */}
                </div>

                {/* Right Column: Live Summary Sidebar */}
                <div className="w-full lg:w-96 shrink-0">
                  <div className="sticky top-6 bg-white rounded-3xl border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="p-6 bg-medical-blue text-white">
                      <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                        Booking Summary
                      </h3>
                      <p className="text-blue-100 text-xs font-medium mt-1">Review details before confirmation</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      
                      {/* Patient Summary */}
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Patient</p>
                        {selectedPatient ? (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPatient.name}`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{selectedPatient.name}</p>
                              <p className="text-xs font-medium text-gray-500">{selectedPatient.phone}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-gray-400 italic">No patient selected</p>
                        )}
                      </div>

                      <div className="h-px bg-gray-100"></div>

                      {/* Doctor Summary */}
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Doctor</p>
                        {selectedDoctor ? (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                              <img src={selectedDoctor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoctor.name}`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">Dr. {selectedDoctor.name}</p>
                              <p className="text-[10px] font-bold text-medical-blue uppercase tracking-wider">{selectedDept?.name || selectedDoctor.doctorProfile?.department?.name || 'General'}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-gray-400 italic">No doctor selected</p>
                        )}
                      </div>

                      <div className="h-px bg-gray-100"></div>

                      {/* Schedule Summary */}
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Schedule</p>
                        {formData.date || formData.timeSlot ? (
                          <div className="space-y-2">
                            {formData.date && (
                              <div className="flex items-center gap-2 text-gray-900">
                                <CalendarIcon className="w-4 h-4 text-medical-blue" />
                                <span className="text-sm font-bold">{new Date(formData.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </div>
                            )}
                            {formData.timeSlot && (
                              <div className="flex items-center gap-2 text-gray-900">
                                <Clock className="w-4 h-4 text-medical-blue" />
                                <span className="text-sm font-bold">{formData.timeSlot}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-gray-400 italic">Not scheduled yet</p>
                        )}
                      </div>

                      <div className="h-px bg-gray-100"></div>

                      {/* Modality Summary */}
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visit Type</p>
                          <p className="text-xs font-bold text-gray-900 mt-0.5 uppercase tracking-wide">{formData.type.replace("-", " ")}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modality</p>
                          <p className="text-xs font-bold text-medical-blue mt-0.5 uppercase tracking-wide flex items-center justify-end gap-1">
                            {formData.visitType === 'online' ? <Video className="w-3 h-3" /> : <Hospital className="w-3 h-3" />}
                            {formData.visitType}
                          </p>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button 
                        type="submit" 
                        disabled={submitting || !formData.patientId || !formData.doctorId || !formData.date || !formData.timeSlot}
                        className="w-full bg-medical-blue text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-medical-blue/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            Confirm Booking <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                </div>

              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
