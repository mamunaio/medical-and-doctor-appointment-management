import React from "react";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { notFound } from "next/navigation";
import HMSHeader from "@/components/hms/HMSHeader";
import HMSSidebar from "@/components/hms/HMSSidebar";
import { Calendar, Clock, User, Stethoscope, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AppointmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const appointment = await Appointment.findById(id)
    .populate("patient", "name patientId phone gender dateOfBirth bloodGroup")
    .populate("doctor", "name role department")
    .lean();

  if (!appointment) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'checked-in': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'in-consultation': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'completed': return 'bg-green-50 text-medical-green border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Appointment Details" />
        
        <main className="p-6 max-w-5xl mx-auto w-full space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/appointments" className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-medical-blue hover:border-medical-blue rounded-xl transition-all shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
              Appointment #{appointment.appointmentId}
            </h2>
            <span className={cn("px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border", getStatusColor(appointment.status))}>
              {appointment.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Patient & Doc Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border-4 border-white shadow-sm shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.patient?.name || "Patient"}`} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-gray-900">{appointment.patient?.name}</h3>
                  <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest">{appointment.patient?.patientId}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-bold text-gray-900">{appointment.patient?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender / Age</p>
                      <p className="text-sm font-bold text-gray-900 capitalize">
                        {appointment.patient?.gender || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Group</p>
                      <p className="text-sm font-bold text-red-500">{appointment.patient?.bloodGroup || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-medical-blue" /> Chief Complaint & Notes
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Chief Complaint</p>
                    <p className="text-sm font-medium text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {appointment.chiefComplaint || "No chief complaint provided."}
                    </p>
                  </div>
                  {appointment.notes && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Internal Notes</p>
                      <p className="text-sm font-medium text-gray-900 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Schedule & Doctor Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-50 pb-4">Schedule Details</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-bold text-gray-900">{new Date(appointment.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 text-medical-green rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Slot</p>
                      <p className="text-sm font-bold text-gray-900">{appointment.timeSlot}</p>
                    </div>
                  </div>
                  {(appointment.tokenNumber || appointment.queuePosition) && (
                    <div className="pt-2">
                      <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center border border-gray-100">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Token Number</span>
                        <span className="text-lg font-black text-medical-blue">#{appointment.tokenNumber || appointment.queuePosition}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-50 pb-4">Assigned Doctor</h4>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{appointment.doctor?.name || "Unassigned"}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{appointment.doctor?.role || "Doctor"}</p>
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
