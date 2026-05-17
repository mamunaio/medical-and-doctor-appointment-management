"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";

const DEMO_CREDENTIALS: Record<string, { email: string; pass: string; title: string }> = {
  Admin: { email: "admin@injaazh.com", pass: "injaazh_admin", title: "Admin Access Credentials" },
  Doctor: { email: "akram@injaazh.com", pass: "doctor123", title: "Doctor Access Credentials" },
  Nurse: { email: "nurse@injaazh.com", pass: "nurse123", title: "Nurse Access Credentials" },
  Receptionist: { email: "receptionist@injaazh.com", pass: "receptionist123", title: "Receptionist Access Credentials" },
  Patient: { email: "patient@injaazh.com", pass: "patient123", title: "Patient Access Credentials" },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roles = ["Admin", "Doctor", "Nurse", "Receptionist", "Patient"];

  const [mounted, setMounted] = useState(false);
  const [randomStyles, setRandomStyles] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const styles = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      transform: `rotate(${Math.random() * 360}deg)`
    }));
    setRandomStyles(styles);
  }, []);

  // Update credentials and input fields when active role changes
  useEffect(() => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.pass);
    }
  }, [role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save to store
      login(data.data.user, data.data.token);
      
      // Redirect based on role if needed, or just dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-medical-green relative overflow-hidden flex-col items-center justify-center text-white p-12">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {mounted && randomStyles.map((style, i) => (
            <div 
              key={i} 
              className="absolute text-4xl" 
              style={style}
            >
              +
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8 border border-white/30">
            <Activity className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">Injaazh HMS</h1>
          <p className="text-xl font-medium text-white/80">Healthcare, now easier than ever</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Please login to your account</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                  role === r 
                    ? "bg-medical-green text-white border-medical-green shadow-lg shadow-medical-green/20" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-medical-green hover:text-medical-green"
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="bg-medical-blue/5 border border-medical-blue/20 p-4 rounded-xl mb-6">
              <p className="text-[10px] font-black text-medical-blue uppercase tracking-widest mb-1">
                {DEMO_CREDENTIALS[role]?.title || "Access Credentials"}
              </p>
              <p className="text-sm font-bold text-gray-700">Email: <span className="text-medical-blue">{DEMO_CREDENTIALS[role]?.email}</span></p>
              <p className="text-sm font-bold text-gray-700">Password: <span className="text-medical-blue">{DEMO_CREDENTIALS[role]?.pass}</span></p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-medical-green focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-medical-green focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-medical-green focus:ring-medical-green" />
                <span className="text-sm text-gray-600 font-medium">Remember Me</span>
              </label>
              <a href="#" className="text-sm font-bold text-medical-green hover:underline">Forgot Password?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-medical-green hover:bg-medical-green/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-medical-green/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login Now"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Injaazh HMS v2.4.0 — All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
