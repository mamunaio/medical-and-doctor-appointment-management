"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  CreditCard, 
  UserRound, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  PlusCircle,
  Activity,
  Bed,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

const navigation = [
  {
    section: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "PATIENTS",
    items: [
      { name: "Patients", href: "/patients", icon: Users },
      { name: "Registration", href: "/patients/register", icon: PlusCircle },
    ],
  },
  {
    section: "APPOINTMENTS",
    items: [
      { name: "Appointments", href: "/appointments", icon: Calendar },
    ],
  },
  {
    section: "CLINICAL",
    items: [
      { name: "OPD", href: "/opd", icon: Stethoscope },
      { name: "IPD", href: "/ipd", icon: Bed },
      { name: "Emergency", href: "/emergency", icon: AlertTriangle, color: "text-emergency-red" },
    ],
  },
  {
    section: "DIAGNOSTIC",
    items: [
      { name: "Laboratory", href: "/lab", icon: FlaskConical },
    ],
  },
  {
    section: "PHARMACY",
    items: [
      { name: "Inventory", href: "/pharmacy", icon: Pill },
    ],
  },
  {
    section: "FINANCE",
    items: [
      { name: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
  {
    section: "STAFF",
    items: [
      { name: "Doctors", href: "/doctors", icon: UserRound },
    ],
  },
  {
    section: "REPORTS",
    items: [
      { name: "Analytics", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    section: "SETTINGS",
    items: [
      { name: "Hospital Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function HMSSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <aside className="w-60 bg-white border-r border-border-hms h-screen sticky top-0 flex flex-col overflow-y-auto no-scrollbar">
      <div className="p-6 border-b border-border-hms flex items-center gap-3">
        <div className="w-10 h-10 bg-medical-green rounded-lg flex items-center justify-center">
          <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">Injaazh</h1>
          <p className="text-xs text-medical-green font-semibold tracking-wider uppercase">HMS</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.section}>
            <h2 className="text-[10px] font-bold text-gray-400 tracking-widest px-3 mb-2 uppercase">
              {section.section}
            </h2>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                      isActive 
                        ? "bg-medical-green/10 text-medical-green" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "w-5 h-5",
                        item.color || (isActive ? "text-medical-green" : "text-gray-400 group-hover:text-gray-600")
                      )} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border-hms bg-gray-50 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-medical-blue flex items-center justify-center text-white font-bold">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Admin User"}</p>
            <p className="text-[10px] bg-medical-blue/10 text-medical-blue px-2 py-0.5 rounded-full inline-block font-bold uppercase">{user?.role || "ADMIN"}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-emergency-red transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
