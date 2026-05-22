"use client";

import React, { useEffect, useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Activity, 
  FileText, 
  Clock,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Pill,
  Stethoscope,
  HeartPulse,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { use } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function PatientDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!id || !token) return;
    fetch(`/api/patients/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.patient) {
          setPatient(data.data.patient);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-light-bg items-center justify-center">
        <Loader2 className="w-12 h-12 text-medical-green animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex min-h-screen bg-light-bg">
        <HMSSidebar />
        <div className="flex-1 flex flex-col">
          <HMSHeader title="Patient Profile" />
          <main className="p-6 flex flex-col items-center justify-center gap-4 min-h-[500px]">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Patient not found or unauthorized access</p>
            <Link href="/patients" className="bg-medical-green text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
              Back to Patient List
            </Link>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Patient Profile" />
        
        <main className="p-4 lg:p-8 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/patients" className="p-2.5 bg-white border border-gray-200 hover:border-medical-green hover:text-medical-green rounded-xl transition-all shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Patient Overview</h2>
              <p className="text-sm text-gray-500 font-medium">Detailed clinical and administrative profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Core Info */}
            <div className="xl:col-span-1 space-y-6">
              {/* Identity Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-medical-blue/10 to-medical-green/10"></div>
                
                <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 border-4 border-white shadow-xl relative z-10 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1 relative z-10">{patient.name}</h3>
                <p className="text-xs font-black text-medical-blue tracking-widest uppercase mb-6 relative z-10">{patient.patientId}</p>
                
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
                    <p className="text-sm font-black text-gray-900">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Blood Group</p>
                    <p className="text-xl font-black text-emergency-red">{patient.bloodGroup || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
                <h4 className="text-xs font-black text-medical-blue uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Contact Details
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-50 text-medical-blue rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                      <p className="text-sm font-bold text-gray-900">{patient.phone || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-bold text-gray-900 break-all">{patient.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-bold text-gray-900">{patient.address?.village || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div className="bg-gradient-to-br from-medical-blue/5 to-transparent rounded-3xl border border-medical-blue/10 p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-medical-blue uppercase tracking-widest border-b border-medical-blue/10 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Insurance Coverage
                </h4>
                {patient.insurance && patient.insurance.providerName ? (
                  <div className="space-y-4 pt-2">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Provider</p>
                      <p className="text-base font-black text-gray-900">{patient.insurance.providerName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Policy Number</p>
                      <p className="text-sm font-bold text-medical-blue bg-white px-3 py-1.5 rounded-lg inline-block border border-gray-100">{patient.insurance.policyNumber || "N/A"}</p>
                    </div>
                    {patient.insurance.validity && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Valid Until</p>
                        <p className="text-sm font-bold text-gray-900">{new Date(patient.insurance.validity).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-400 uppercase">No Insurance Info</p>
                  </div>
                )}
              </div>
            </div>

            {/* Middle/Right - Medical History & Activities */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Medical History Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                    <HeartPulse className="w-6 h-6 text-emergency-red" />
                    Core Medical History
                  </h4>
                  <button className="text-xs font-bold text-white bg-medical-blue px-4 py-2 rounded-xl shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                    Edit History
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Allergies */}
                  <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 text-red-100"><AlertTriangle className="w-16 h-16" /></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" /> Allergies
                      </p>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                        {patient.medicalHistory?.allergies || "No known allergies reported."}
                      </p>
                    </div>
                  </div>

                  {/* Chronic Diseases */}
                  <div className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 text-orange-100"><Activity className="w-16 h-16" /></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Chronic Diseases
                      </p>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                        {patient.medicalHistory?.chronicDiseases || "No chronic diseases reported."}
                      </p>
                    </div>
                  </div>

                  {/* Past Surgeries */}
                  <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 text-blue-100"><Stethoscope className="w-16 h-16" /></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-medical-blue uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Stethoscope className="w-3 h-3" /> Past Surgeries
                      </p>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                        {patient.medicalHistory?.pastSurgeries || "No past surgeries recorded."}
                      </p>
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div className="bg-green-50/50 border border-green-100 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute -right-2 -top-2 text-green-100"><Pill className="w-16 h-16" /></div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-medical-green uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Pill className="w-3 h-3" /> Current Medications
                      </p>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                        {patient.medicalHistory?.currentMedications || "No active medications."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Timeline */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                    <Activity className="w-5 h-5 text-medical-green" />
                    Clinical Timeline
                  </h4>
                  <button className="text-[10px] font-black text-medical-green uppercase tracking-widest border-2 border-medical-green/20 px-4 py-2 rounded-xl hover:bg-medical-green hover:text-white transition-all">New Entry</button>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-6 relative">
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gradient-to-b from-medical-green to-transparent"></div>
                    <div className="w-10 h-10 bg-medical-green text-white rounded-xl flex items-center justify-center relative z-10 shrink-0 shadow-lg shadow-medical-green/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl flex-1 border border-gray-100 hover:border-medical-green/30 transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-black text-gray-900 uppercase text-xs">Initial Registration</h5>
                        <span className="text-[10px] font-bold text-medical-green bg-green-50 px-3 py-1 rounded-full">{new Date(patient.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Patient successfully registered into the HMS system. Initial clinical profiling completed.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:border-medical-blue/30 transition-colors cursor-pointer">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3 group-hover:text-medical-blue transition-colors">
                    <FileText className="w-5 h-5 text-medical-blue" />
                    Recent Prescriptions
                  </h4>
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-100 mx-auto mb-3 group-hover:text-medical-blue/20 transition-colors" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No prescriptions found</p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:border-orange-500/30 transition-colors cursor-pointer">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3 group-hover:text-orange-500 transition-colors">
                    <Activity className="w-5 h-5 text-orange-500" />
                    Laboratory Reports
                  </h4>
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-100 mx-auto mb-3 group-hover:text-orange-500/20 transition-colors" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No lab reports found</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
