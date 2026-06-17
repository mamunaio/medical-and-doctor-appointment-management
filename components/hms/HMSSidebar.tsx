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
      { name: "Emergency", href: "/emergency", icon: AlertTriangle, color: "text-emergency-red hover:text-white" },
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

  // Helper to extract initials for profile card
  const getInitials = (name?: string) => {
    if (!name) return "US";
    const cleaned = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, "");
    const parts = cleaned.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase();
  };

  // Filter navigation sections and items based on role
  const filteredNavigation = navigation
    .map((section) => {
      // 1. Check if section is completely hidden for this role
      if (user?.role === "patient") {
        if (!["OVERVIEW", "APPOINTMENTS"].includes(section.section)) return null;
      }
      if (user?.role === "nurse") {
        if (["APPOINTMENTS", "FINANCE", "STAFF", "REPORTS", "SETTINGS"].includes(section.section)) return null;
      }
      if (user?.role === "receptionist") {
        if (["DIAGNOSTIC", "PHARMACY", "STAFF", "REPORTS", "SETTINGS"].includes(section.section)) return null;
      }
      if (user?.role === "doctor") {
        if (["PHARMACY", "FINANCE", "STAFF", "SETTINGS"].includes(section.section)) return null;
      }

      // 2. Filter specific items within the section
      const items = section.items.filter((item) => {
        if (item.href === "/patients/register") {
          // Only Admin/Super Admin and Receptionist can register new patients
          return ["super_admin", "admin", "receptionist"].includes(user?.role || "");
        }
        return true;
      });

      if (items.length === 0) return null;

      return {
        ...section,
        items,
      };
    })
    .filter(Boolean) as typeof navigation;

  return (
    <aside className="w-60 bg-white border-r border-border-hms h-screen sticky top-0 flex flex-col overflow-y-auto no-scrollbar shadow-xl shadow-gray-100/50">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-border-hms flex items-center gap-3 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-10 h-10 bg-gradient-to-tr from-medical-green to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-medical-green/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Activity className="text-white w-5 h-5 animate-pulse relative z-10" />
        </div>
        <div>
          <h1 className="text-base font-black text-gray-900 leading-none tracking-tight">Injaazh</h1>
          <p className="text-[10px] text-medical-green font-black tracking-widest uppercase mt-1">HMS Desk</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {filteredNavigation.map((section) => (
          <div key={section.section} className="space-y-1.5">
            <h2 className="text-[9px] font-black text-gray-400 tracking-widest px-3 uppercase mb-1 flex items-center gap-1.5 opacity-80">
              <span className="w-1 h-1 bg-gray-300 rounded-full" /> {section.section}
            </h2>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (
                  pathname.startsWith(item.href + "/") && 
                  !filteredNavigation.flatMap(s => s.items).some(other => other.href.length > item.href.length && (pathname === other.href || pathname.startsWith(other.href + "/")))
                );
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 group relative overflow-hidden border border-transparent",
                      isActive 
                        ? "bg-medical-green/5 text-medical-green border-medical-green/10 shadow-sm shadow-medical-green/5 font-black" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {/* Active Left-Border Glow Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-medical-green to-teal-600 rounded-r-full shadow shadow-medical-green/40" />
                    )}

                    <div className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                      <item.icon className={cn(
                        "w-4 h-4 transition-all duration-300 group-hover:scale-110",
                        item.color || (isActive ? "text-medical-green" : "text-gray-400 group-hover:text-gray-600")
                      )} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3 h-3 text-medical-green animate-in fade-in duration-300" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile Container */}
      <div className="p-4 border-t border-border-hms bg-gray-50/50 mt-auto">
        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-medical-blue to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-medical-blue/20 shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900 truncate leading-tight">{user?.name || "Admin User"}</p>
            <p className="text-[9px] bg-medical-blue/5 text-medical-blue border border-medical-blue/10 px-2 py-0.5 rounded-full inline-block font-black uppercase tracking-wider scale-90 -ml-1 mt-1 leading-none">
              {user?.role === "super_admin" ? "Super Admin" : user?.role || "ADMIN"}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-emergency-red transition-all duration-300 hover:scale-110 p-1 rounded-lg hover:bg-red-50 shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
