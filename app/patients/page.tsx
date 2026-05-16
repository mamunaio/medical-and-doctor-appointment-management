"use client";

import React, { useEffect, useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  UserPlus,
  Loader2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PatientList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPatients = async (query = "") => {
    setLoading(true);
    const res = await fetch(`/api/patients?search=${query}`);
    const data = await res.json();
    setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatients(search);
  };

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Patient Management" />
        
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
              <Users className="w-6 h-6 text-medical-green" />
              Patient List
            </h2>
            <Link href="/patients/register" className="bg-medical-green text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-medical-green/20 hover:scale-105 transition-all flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> New Registration
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-border-hms overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border-hms flex flex-col md:flex-row md:items-center justify-between gap-4">
              <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Name, ID or Phone..." 
                  className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-medical-green" 
                />
              </form>
              <div className="flex gap-2">
                <button className="bg-gray-50 text-gray-500 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-100 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Gender / Age</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Visit</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Loader2 className="w-8 h-8 text-medical-green animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : patients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                        No patients found
                      </td>
                    </tr>
                  ) : (
                    patients.map((p, i) => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-all group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{p.name}</p>
                              <p className="text-[10px] font-black text-medical-blue uppercase tracking-widest">{p.patientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-gray-600 uppercase">{p.gender} / {p.age || "N/A"}y</span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-gray-900">{p.phone}</p>
                          <p className="text-[10px] text-gray-400">{p.email || "No Email"}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs text-gray-500 font-medium">{p.stats?.lastVisitDate ? new Date(p.stats.lastVisitDate).toLocaleDateString() : "Never visited"}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            p.isActive ? "bg-medical-green/10 text-medical-green" : "bg-gray-100 text-gray-400"
                          )}>
                            {p.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/patients/${p._id}`} className="p-2 hover:bg-medical-green/10 text-gray-400 hover:text-medical-green rounded-lg transition-all">
                              <ChevronRight className="w-5 h-5" />
                            </Link>
                            <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
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
