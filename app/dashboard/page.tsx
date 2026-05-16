"use client";

import React from "react";
import Link from "next/link";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import StatCard from "@/components/hms/StatCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
  ArrowRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
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
  { name: "Occupied", value: 42, color: "#0E9F6E" },
  { name: "Available", value: 18, color: "#E5E7EB" },
];

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Hospital Overview" />
        
        <main className="p-6 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <StatCard label="Today's Patients" value="148" icon={Users} color="green" trend="+12%" trendUp={true} />
            <StatCard label="Appointments" value="86" icon={Calendar} color="blue" trend="+5%" trendUp={true} />
            <StatCard label="Admitted (IPD)" value="42" icon={Bed} color="purple" trend="+2" trendUp={true} />
            <StatCard label="Available Beds" value="18/60" icon={Activity} color="amber" />
            <StatCard label="Today's Revenue" value="৳1,24,500" icon={TrendingUp} color="teal" trend="+৳8,400" trendUp={true} />
            <StatCard label="Emergency" value="5" icon={AlertTriangle} color="red" trend="+1" trendUp={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left - Appointment Timeline */}
            <div className="bg-white rounded-2xl border border-border-hms flex flex-col">
              <div className="p-6 border-b border-border-hms flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-medical-blue" />
                  Appointment Timeline
                </h2>
                <Link href="/appointments" className="text-sm font-bold text-medical-green hover:underline">View All</Link>
              </div>
              <div className="p-0 overflow-y-auto max-h-[400px] no-scrollbar">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { time: "09:30 AM", patient: "Abul Kashem", doctor: "Dr. Rahman", status: "Waiting", statusColor: "amber" },
                      { time: "10:00 AM", patient: "Fatema Begum", doctor: "Dr. Sarah", status: "In Progress", statusColor: "blue" },
                      { time: "10:30 AM", patient: "Rahim Uddin", doctor: "Dr. Karim", status: "Completed", statusColor: "green" },
                      { time: "11:00 AM", patient: "Sumi Akter", doctor: "Dr. Rahman", status: "Waiting", statusColor: "amber" },
                      { time: "11:30 AM", patient: "Jashim Khan", doctor: "Dr. Sarah", status: "Cancelled", statusColor: "red" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.time}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{row.patient}</p>
                          <p className="text-xs text-gray-500">ID: PAT-24-001</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.doctor}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            row.statusColor === "amber" && "bg-warning-amber/10 text-warning-amber",
                            row.statusColor === "blue" && "bg-medical-blue/10 text-medical-blue",
                            row.statusColor === "green" && "bg-medical-green/10 text-medical-green",
                            row.statusColor === "red" && "bg-emergency-red/10 text-emergency-red"
                          )}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right - Two Stacked Cards */}
            <div className="space-y-6">
              {/* Bed Occupancy */}
              <div className="bg-white p-6 rounded-2xl border border-border-hms flex items-center gap-6">
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 mb-1">Bed Occupancy</h2>
                  <p className="text-xs text-gray-500 mb-4">Real-time status across wards</p>
                  <div className="space-y-3">
                    {[
                      { name: "General Ward", val: "24/30", color: "bg-medical-green" },
                      { name: "ICU", val: "8/10", color: "bg-purple-hms" },
                      { name: "Emergency", val: "5/10", color: "bg-emergency-red" },
                      { name: "Cabin", val: "5/10", color: "bg-medical-blue" },
                    ].map((ward) => (
                      <div key={ward.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", ward.color)}></div>
                          <span className="text-xs font-medium text-gray-600">{ward.name}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900">{ward.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bedData}
                        innerRadius={40}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {bedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center -mt-[78px]">
                    <span className="text-lg font-black text-gray-900">70%</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Surgeries */}
              <div className="bg-white rounded-2xl border border-border-hms overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-border-hms flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Upcoming Surgeries</h2>
                  <span className="bg-medical-green text-white text-[10px] px-2 py-0.5 rounded-full font-bold">3 TODAY</span>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { patient: "Mofizur Rahman", dr: "Dr. Akram (Cardiology)", time: "02:00 PM", room: "OT-2" },
                    { patient: "Nasrin Akter", dr: "Dr. Shaila (Gynae)", time: "04:30 PM", room: "OT-1" },
                    { patient: "Kamal Uddin", dr: "Dr. Zaman (Orthopedics)", time: "06:00 PM", room: "OT-3" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-border-hms group">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-400">ROOM</span>
                        <span className="text-sm font-black text-medical-blue">{s.room.split("-")[1]}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{s.patient}</p>
                        <p className="text-[10px] text-gray-500">{s.dr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900">{s.time}</p>
                        <p className="text-[10px] font-bold text-medical-green">{s.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border-hms">
              <h2 className="font-bold text-gray-900 mb-6">Patient Visit Trend</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visitData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="opd" stroke="#0E9F6E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="ipd" stroke="#1A56DB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} />
                    <Line type="monotone" dataKey="emergency" stroke="#C81E1E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border-hms">
              <h2 className="font-bold text-gray-900 mb-6">Revenue Breakdown (৳)</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                    <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={[ "#0E9F6E", "#1A56DB", "#0694A2", "#7E3AF2", "#9CA3AF" ][index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Lab Results */}
            <div className="bg-white rounded-2xl border border-border-hms overflow-hidden">
              <div className="p-6 border-b border-border-hms flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-teal-hms" />
                  Pending Lab Results
                </h2>
                <Link href="/lab" className="text-sm font-bold text-teal-hms hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Patient</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Test</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { patient: "Zubair Ahmed", test: "Complete Blood Count", time: "2h ago", status: "Processing" },
                      { patient: "Lina Khan", test: "Lipid Profile", time: "3h ago", status: "Pending" },
                      { patient: "Saiful Islam", test: "RBS (Sugar)", time: "4h ago", status: "Ready" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.patient}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.test}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{row.time}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                            row.status === "Processing" && "bg-medical-blue/10 text-medical-blue",
                            row.status === "Pending" && "bg-warning-amber/10 text-warning-amber",
                            row.status === "Ready" && "bg-medical-green/10 text-medical-green"
                          )}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-bold text-medical-green hover:underline">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Medicines */}
            <div className="bg-white rounded-2xl border border-border-hms overflow-hidden">
              <div className="p-6 border-b border-border-hms flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-warning-amber" />
                  Low Stock Medicines
                </h2>
                <Link href="/pharmacy" className="text-sm font-bold text-warning-amber hover:underline">Inventory</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Medicine</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Stock</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Reorder</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { name: "Napa Extend (500mg)", stock: 450, reorder: 1000, category: "Tablet" },
                      { name: "Ciprocin (250mg)", stock: 120, reorder: 500, category: "Capsule" },
                      { name: "Sergel (20mg)", stock: 80, reorder: 400, category: "Capsule" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors bg-warning-amber/5">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{row.name}</p>
                          <p className="text-[10px] text-gray-500">{row.category}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-emergency-red">{row.stock}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{row.reorder}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="bg-medical-green text-white text-[10px] font-bold px-3 py-1 rounded-lg">Order</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-2xl border border-border-hms">
            <h2 className="font-bold text-gray-900 mb-6">Recent Activities</h2>
            <div className="space-y-6">
              {[
                { type: "admission", text: "New patient admitted to ICU (Bed 04)", time: "10 mins ago", color: "purple" },
                { type: "emergency", text: "Emergency alert: Ambulance incoming in 5 mins", time: "25 mins ago", color: "red" },
                { type: "discharge", text: "Patient Abir Hossain discharged from General Ward", time: "1 hour ago", color: "blue" },
                { type: "registration", text: "New doctor Dr. Anika joined Cardiology dept", time: "2 hours ago", color: "green" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== 3 && <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-gray-100"></div>}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10",
                    activity.color === "purple" && "bg-purple-hms/10 text-purple-hms",
                    activity.color === "red" && "bg-emergency-red/10 text-emergency-red",
                    activity.color === "blue" && "bg-medical-blue/10 text-medical-blue",
                    activity.color === "green" && "bg-medical-green/10 text-medical-green",
                  )}>
                    <div className={cn("w-2 h-2 rounded-full", 
                      activity.color === "purple" && "bg-purple-hms",
                      activity.color === "red" && "bg-emergency-red",
                      activity.color === "blue" && "bg-medical-blue",
                      activity.color === "green" && "bg-medical-green",
                    )}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
