"use client";

import React from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bed, 
  Activity, 
  Star, 
  Download, 
  FileSpreadsheet, 
  FileText,
  Calendar,
  ChevronRight
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
  Pie,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";

const patientTrend = [
  { month: "Jan", count: 4200 },
  { month: "Feb", count: 3800 },
  { month: "Mar", count: 5100 },
  { month: "Apr", count: 4800 },
  { month: "May", count: 5400 },
  { month: "Jun", count: 6200 },
];

const revenueByDept = [
  { name: "OPD", value: 1200000 },
  { name: "IPD", value: 2800000 },
  { name: "Lab", value: 850000 },
  { name: "Pharmacy", value: 1500000 },
  { name: "Radiology", value: 450000 },
];

const diseaseDist = [
  { name: "Fever/Viral", value: 400 },
  { name: "Cardiac", value: 250 },
  { name: "Orthopedic", value: 180 },
  { name: "Gynae", value: 300 },
  { name: "Surgery", value: 120 },
];

const COLORS = ["#0E9F6E", "#1A56DB", "#7E3AF2", "#0694A2", "#C81E1E"];

export default function Reports() {
  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Reports & Analytics" />
        
        <main className="p-6 space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: "OPD Count", val: "4,520", icon: Users, color: "green" },
              { label: "IPD Admissions", val: "840", icon: Bed, color: "purple" },
              { label: "Revenue", val: "৳58.5L", icon: TrendingUp, color: "teal" },
              { label: "Bed Occupancy", val: "84%", icon: Activity, color: "blue" },
              { label: "Avg Stay", val: "4.2 days", icon: Calendar, color: "amber" },
              { label: "Satisfaction", val: "4.8/5", icon: Star, color: "red" },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-border-hms shadow-sm group hover:shadow-lg transition-all">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                  kpi.color === "green" && "bg-medical-green/10 text-medical-green",
                  kpi.color === "blue" && "bg-medical-blue/10 text-medical-blue",
                  kpi.color === "purple" && "bg-purple-hms/10 text-purple-hms",
                  kpi.color === "teal" && "bg-teal-hms/10 text-teal-hms",
                  kpi.color === "amber" && "bg-warning-amber/10 text-warning-amber",
                  kpi.color === "red" && "bg-emergency-red/10 text-emergency-red",
                )}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                <p className="text-xl font-black text-gray-900">{kpi.val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Trend Line Chart */}
            <div className="bg-white p-8 rounded-3xl border border-border-hms shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Users className="w-5 h-5 text-medical-green" />
                Patient Visit Trend (12 Months)
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patientTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="count" stroke="#0E9F6E" strokeWidth={4} dot={{ r: 6, strokeWidth: 3, fill: "#fff" }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Bar Chart */}
            <div className="bg-white p-8 rounded-3xl border border-border-hms shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-hms" />
                Revenue by Department (৳)
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByDept} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#374151", fontWeight: "bold" }} width={80} />
                    <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                      {revenueByDept.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Disease Distribution Pie Chart */}
            <div className="bg-white p-8 rounded-3xl border border-border-hms shadow-sm flex flex-col">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Disease Distribution</h3>
              <div className="flex-1 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={diseaseDist} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {diseaseDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Export Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Daily OPD Report", desc: "Detailed patient visit list with doctor & fees", format: "PDF, XLSX" },
                { title: "Monthly Revenue Summary", desc: "Dept-wise income, discounts & net profit", format: "PDF" },
                { title: "Medicine Consumption", desc: "High volume medicine stock usage report", format: "XLSX" },
                { title: "Bed Occupancy Analysis", desc: "Ward-wise bed utilization metrics", format: "PDF, CSV" },
              ].map((report, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-border-hms shadow-sm flex flex-col justify-between group hover:border-medical-blue transition-all">
                  <div>
                    <h4 className="text-lg font-black text-gray-900 mb-2">{report.title}</h4>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">{report.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{report.format}</span>
                    <div className="flex gap-2">
                      <button className="p-2 bg-medical-blue/10 text-medical-blue rounded-xl hover:bg-medical-blue hover:text-white transition-all">
                        <FileSpreadsheet className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-medical-green/10 text-medical-green rounded-xl hover:bg-medical-green hover:text-white transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
