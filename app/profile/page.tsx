"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { toast } from "react-hot-toast";
import { 
  User, 
  Shield, 
  Clock, 
  Settings, 
  Camera, 
  ShieldAlert,
  Smartphone,
  Globe,
  CheckCircle2,
  KeyRound,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"overview" | "edit" | "security" | "history">("overview");

  // Edit Profile States
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "+880 1711-000000",
    address: user?.address || "Block C, Banani, Dhaka, Bangladesh"
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Security States
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // File Upload Refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    // Simulate API Call
    setTimeout(() => {
      updateUser({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      });
      setIsSavingProfile(false);
      toast.success("Profile updated successfully!");
    }, 800);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSavingPassword(false);
      setPasswords({ current: "", new: "", confirm: "" });
      toast.success("Password changed securely!");
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar') => {
    const file = e.target.files?.[0];
    if (file) {
      // Create object URL for preview or upload directly
      toast.success(`${type === 'cover' ? 'Cover' : 'Profile'} picture updated!`);
    }
  };

  const toggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    toast.success(`Two-Factor Authentication ${!is2FAEnabled ? 'Enabled' : 'Disabled'}`);
  };

  // Mock historical data
  const loginHistory = [
    { id: 1, device: "MacBook Pro M2", location: "Dhaka, Bangladesh", ip: "103.24.55.12", time: "Just now", current: true },
    { id: 2, device: "iPhone 14 Pro Max", location: "Dhaka, Bangladesh", ip: "103.24.55.12", time: "2 hours ago", current: false },
    { id: 3, device: "Windows PC (Chrome)", location: "Chittagong, Bangladesh", ip: "118.17.44.8", time: "Yesterday", current: false },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <HMSSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HMSHeader title="Profile Settings" />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Hidden File Inputs */}
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />

            {/* Header Banner */}
            <div className="relative mb-16 group/banner cursor-pointer" onClick={() => coverInputRef.current?.click()}>
              <div className="absolute inset-0 bg-medical-blue rounded-3xl shadow-lg overflow-hidden transition-all">
                {/* Default Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Cover Photo Edit Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/banner:opacity-100 transition-opacity flex items-start justify-end p-4">
                  <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/30 shadow-sm">
                    <Camera className="w-4 h-4" /> Edit Cover
                  </button>
                </div>
              </div>
              <div className="h-32 lg:h-48 w-full pointer-events-none"></div> {/* Spacer for height */}
              
              <div className="absolute -bottom-12 left-8 flex items-end gap-6 z-10" onClick={(e) => e.stopPropagation()}>
                <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white border-4 border-[#F8FAFC] shadow-xl overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "User")}`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 lg:px-8">
              
              {/* Profile Sidebar Navigation */}
              <div className="lg:col-span-1 space-y-2">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-gray-900">{user?.name || "Dr. Sarah Johnson"}</h2>
                  <p className="text-sm font-bold text-gray-500">{user?.email || "doctor@injaazh.com"}</p>
                  <div className="mt-2 inline-block bg-medical-green/10 text-medical-green text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    {user?.role || "Hospital Staff"}
                  </div>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: "overview", icon: User, label: "Overview" },
                    { id: "edit", icon: Settings, label: "Edit Profile" },
                    { id: "security", icon: Shield, label: "Security & 2FA" },
                    { id: "history", icon: Clock, label: "Login History" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                        activeTab === tab.id 
                          ? "bg-medical-blue text-white shadow-md shadow-medical-blue/20" 
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                
                {/* 1. Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                        <User className="w-5 h-5 text-medical-blue" /> Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                          <p className="text-sm font-bold text-gray-900">{user?.name || "Dr. Sarah Johnson"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                          <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            {user?.email || "doctor@injaazh.com"}
                            <CheckCircle2 className="w-4 h-4 text-medical-green" />
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                          <p className="text-sm font-bold text-gray-900">{profileData.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Department</p>
                          <p className="text-sm font-bold text-gray-900">Cardiology</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm">
                      <h3 className="text-sm font-black text-emergency-red uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" /> Emergency Contact
                      </h3>
                      <div className="flex items-center justify-between bg-white p-4 rounded-2xl">
                        <div>
                          <p className="text-sm font-bold text-gray-900">Dr. Akram Hossain</p>
                          <p className="text-xs text-gray-500 font-medium">Brother • +880 1811-000000</p>
                        </div>
                        <button className="text-xs font-black text-emergency-red hover:underline uppercase tracking-wider transition-all hover:opacity-80" onClick={() => toast("Emergency contact update requested", { icon: "🚑" })}>Update</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Edit Profile Tab */}
                {activeTab === "edit" && (
                  <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                      <Settings className="w-5 h-5 text-medical-blue" /> Update Profile
                    </h3>
                    <form className="space-y-6" onSubmit={handleUpdateProfile}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                          <input 
                            type="text" 
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none transition-all font-bold text-gray-800" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                          <input 
                            type="text" 
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none transition-all font-bold text-gray-800" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Residential Address</label>
                          <textarea 
                            rows={3} 
                            value={profileData.address}
                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none transition-all font-bold text-gray-800 resize-none"
                          ></textarea>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                        <button type="button" onClick={() => setActiveTab("overview")} className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                        <button 
                          type="submit" 
                          disabled={isSavingProfile}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-medical-blue hover:bg-blue-700 shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSavingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                          {isSavingProfile ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 3. Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                        <KeyRound className="w-5 h-5 text-medical-blue" /> Change Password
                      </h3>
                      <form className="space-y-5 max-w-md" onSubmit={handleUpdatePassword}>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={passwords.current}
                            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none transition-all font-bold" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none transition-all font-bold" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none transition-all font-bold" 
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={isSavingPassword}
                          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-medical-blue hover:bg-blue-700 shadow-md transition-all mt-4 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSavingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                          {isSavingPassword ? "Updating Securely..." : "Update Password"}
                        </button>
                      </form>
                    </div>

                    <div className="bg-gray-900 p-6 lg:p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-medical-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
                        <div>
                          <h3 className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2 text-medical-green">
                            <Shield className="w-5 h-5" /> Two-Factor Authentication (2FA)
                          </h3>
                          <p className="text-sm text-gray-400 font-medium max-w-md">Add an extra layer of security to your account. We will send a verification code to your phone every time you log in.</p>
                        </div>
                        <button 
                          onClick={toggle2FA}
                          className={cn(
                            "shrink-0 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 justify-center",
                            is2FAEnabled 
                              ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                              : "bg-medical-green hover:bg-green-500 text-white shadow-medical-green/20"
                          )}
                        >
                          {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. History Tab */}
                {activeTab === "history" && (
                  <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-5 h-5 text-medical-blue" /> Login History
                      </h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Past 30 Days</span>
                    </div>
                    
                    <div className="space-y-4">
                      {loginHistory.map((log) => (
                        <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors gap-4">
                          <div className="flex items-center gap-4">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", log.current ? "bg-medical-green/10 text-medical-green" : "bg-gray-100 text-gray-500")}>
                              {log.device.includes("iPhone") ? <Smartphone className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                {log.device}
                                {log.current && <span className="bg-medical-green text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">Active Now</span>}
                              </p>
                              <p className="text-[11px] text-gray-500 font-medium mt-1">{log.location} • IP: {log.ip}</p>
                            </div>
                          </div>
                          <div className="sm:text-right shrink-0">
                            <p className="text-sm font-bold text-gray-700">{log.time}</p>
                            {!log.current && <button className="text-[10px] font-black text-emergency-red hover:underline uppercase tracking-widest mt-1 transition-opacity">Revoke Access</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
