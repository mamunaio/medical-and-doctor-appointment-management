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
  Loader2
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
        
        <main className="p-6 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/dashboard" className="p-2 hover:bg-white rounded-xl transition-all">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Patient Profile</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Core Info */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl border border-border-hms p-8 text-center shadow-sm">
                <div className="w-32 h-32 bg-gray-100 rounded-3xl mx-auto mb-6 border-4 border-gray-50 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{patient.name}</h3>
                <p className="text-xs font-black text-medical-blue tracking-widest uppercase mb-6">{patient.patientId}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Age</p>
                    <p className="text-lg font-black text-gray-900">{patient.age || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Blood</p>
                    <p className="text-lg font-black text-emergency-red">{patient.bloodGroup}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-border-hms p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Contact Information</h4>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-medical-blue rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Phone</p>
                    <p className="text-sm font-bold text-gray-900">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                    <p className="text-sm font-bold text-gray-900">{patient.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Location</p>
                    <p className="text-sm font-bold text-gray-900">{patient.address?.village || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle/Right - Medical History & Activities */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-border-hms p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                    <Activity className="w-5 h-5 text-medical-green" />
                    Clinical History
                  </h4>
                  <button className="text-[10px] font-black text-medical-green uppercase tracking-widest border-2 border-medical-green/20 px-4 py-2 rounded-xl hover:bg-medical-green hover:text-white transition-all">New Entry</button>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-6 relative">
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-100"></div>
                    <div className="w-10 h-10 bg-medical-green text-white rounded-xl flex items-center justify-center relative z-10 shrink-0 shadow-lg shadow-medical-green/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl flex-1 border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-black text-gray-900 uppercase text-xs">Initial Registration</h5>
                        <span className="text-[10px] font-bold text-gray-400">{new Date(patient.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">Patient registered successfully into the HMS system. No clinical data available yet.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-border-hms p-6 shadow-sm">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-medical-blue" />
                    Recent Prescriptions
                  </h4>
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No prescriptions found</p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl border border-border-hms p-6 shadow-sm">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-orange-500" />
                    Laboratory Reports
                  </h4>
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No lab reports found</p>
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
