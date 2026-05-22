"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { toast } from "react-hot-toast";
import { 
  Building2, 
  CreditCard, 
  Users, 
  ListOrdered, 
  Network, 
  Plug, 
  ShieldCheck, 
  Settings, 
  Upload, 
  Save, 
  Link as LinkIcon, 
  Database,
  CloudLightning,
  AlertTriangle,
  Server,
  Fingerprint,
  RefreshCw,
  MessageSquare,
  Mail,
  Smartphone,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "setup" | "billing" | "roles" | "queue" | "departments" | "integrations" | "security" | "preferences";

export default function EnterpriseSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("setup");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings updated successfully!");
    }, 800);
  };

  const handleAction = (message: string) => {
    toast.success(message);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <HMSSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HMSHeader title="Enterprise Settings" />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <Settings className="w-8 h-8 text-medical-blue" />
                  Enterprise Configuration
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Manage global hospital parameters, integrations, and security policies.</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-medical-blue hover:bg-blue-700 shadow-lg shadow-medical-blue/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Saving..." : "Save Global Changes"}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Massive Sidebar Navigation */}
              <div className="w-full lg:w-72 shrink-0 space-y-1 bg-white p-3 rounded-3xl border border-gray-100 shadow-sm sticky top-0">
                {[
                  { id: "setup", icon: Building2, label: "Hospital Setup", desc: "Logo, Info, Currency" },
                  { id: "billing", icon: CreditCard, label: "Billing & Taxes", desc: "Gateways, Tax Rules" },
                  { id: "roles", icon: Users, label: "Roles & ACL", desc: "Access Control Lists" },
                  { id: "queue", icon: ListOrdered, label: "Queue Settings", desc: "Token & Display logic" },
                  { id: "departments", icon: Network, label: "Departments", desc: "Wards & Specialities" },
                  { id: "integrations", icon: Plug, label: "API Integrations", desc: "SMS, Email, WhatsApp" },
                  { id: "security", icon: ShieldCheck, label: "Security & Backup", desc: "Audit logs, DB backup" },
                  { id: "preferences", icon: Settings, label: "System Preferences", desc: "Timezone, Language" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      "w-full flex items-start gap-4 p-3 rounded-2xl text-left transition-all group",
                      activeTab === tab.id 
                        ? "bg-medical-blue text-white shadow-md shadow-medical-blue/20" 
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                      activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-medical-blue"
                    )}>
                      <tab.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold", activeTab === tab.id ? "text-white" : "text-gray-900")}>{tab.label}</p>
                      <p className={cn("text-[10px] font-medium mt-0.5", activeTab === tab.id ? "text-blue-100" : "text-gray-400")}>{tab.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Main Enterprise Content Area */}
              <div className="flex-1 w-full min-w-0">
                
                {/* 1. Hospital Setup */}
                {activeTab === "setup" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                        <Building2 className="w-5 h-5 text-medical-blue" /> Hospital Identity
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-8 mb-8">
                        <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-medical-blue hover:text-medical-blue transition-colors cursor-pointer bg-gray-50">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-[10px] font-bold uppercase text-center px-2">Upload Hospital Logo</span>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Hospital Name</label>
                            <input type="text" defaultValue="Injaazh Global Hospital" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold text-gray-900" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registration / License Number</label>
                            <input type="text" defaultValue="REG-2024-8899210" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold text-gray-900" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Email</label>
                          <input type="email" defaultValue="admin@injaazh.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Emergency Hotline</label>
                          <input type="text" defaultValue="16263" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Address</label>
                          <textarea rows={2} defaultValue="123 Health Avenue, Medical District, City" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold resize-none"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Billing & Payments */}
                {activeTab === "billing" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-medical-blue" /> Financial Configurations
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Base Currency</label>
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold">
                            <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                            <option value="USD">USD ($) - US Dollar</option>
                            <option value="EUR">EUR (€) - Euro</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Default Tax Rate (%)</label>
                          <input type="number" defaultValue="15" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Invoice Prefix</label>
                          <input type="text" defaultValue="INV-INJ-" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold" />
                        </div>
                      </div>

                      <h4 className="text-sm font-black text-gray-900 mb-4">Payment Gateways</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xl">S</div>
                            <div>
                              <p className="font-bold text-gray-900">Stripe Integration</p>
                              <p className="text-xs text-gray-500">Accept international credit cards</p>
                            </div>
                          </div>
                          <button onClick={() => handleAction("Stripe configuration opened")} className="px-4 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">Configure</button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-black text-xl">SSL</div>
                            <div>
                              <p className="font-bold text-gray-900">SSLCommerz</p>
                              <p className="text-xs text-gray-500">Local payment gateway (bKash, Nagad)</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-medical-green/10 text-medical-green text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Roles & ACL */}
                {activeTab === "roles" && (
                  <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-5 h-5 text-medical-blue" /> Access Control List
                      </h3>
                      <button className="px-4 py-2 bg-medical-blue/10 text-medical-blue text-xs font-bold rounded-lg hover:bg-medical-blue/20 transition-colors">
                        + Add New Role
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: "Super Admin", users: 2, access: "Full System Access" },
                        { name: "Senior Doctor", users: 45, access: "Patients, Prescriptions, Wards" },
                        { name: "Receptionist", users: 12, access: "Appointments, Queue, Basic Billing" },
                        { name: "Accountant", users: 4, access: "Billing, Reports, Payroll" }
                      ].map((role, i) => (
                        <div key={i} className="p-4 border border-gray-100 hover:border-medical-blue/30 rounded-2xl transition-all group">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <p className="font-black text-gray-900 text-lg group-hover:text-medical-blue transition-colors">{role.name}</p>
                              <p className="text-xs text-gray-500 mt-1 font-medium"><span className="font-bold text-gray-700">{role.users} Users</span> • {role.access}</p>
                            </div>
                            <button onClick={() => handleAction(`Edit permissions for ${role.name}`)} className="text-xs font-bold text-medical-blue uppercase tracking-wider px-4 py-2 border border-medical-blue/20 rounded-lg hover:bg-blue-50 transition-colors">
                              Edit Permissions
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Integrations */}
                {activeTab === "integrations" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                        <Plug className="w-5 h-5 text-medical-blue" /> API Integrations
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* WhatsApp */}
                        <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 hover:border-green-400 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                              <MessageSquare className="w-6 h-6" />
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded">Connected</span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-lg">WhatsApp Business API</h4>
                          <p className="text-xs text-gray-500 mt-1 mb-4 h-8">Automated appointment reminders and prescriptions via WhatsApp.</p>
                          <button onClick={() => handleAction("Testing WhatsApp Connection...")} className="w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                            <LinkIcon className="w-3 h-3" /> Test Connection
                          </button>
                        </div>

                        {/* SMS */}
                        <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 hover:border-blue-400 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                              <Smartphone className="w-6 h-6" />
                            </div>
                            <span className="px-2 py-1 bg-gray-200 text-gray-500 text-[10px] font-black uppercase rounded">Not Configured</span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-lg">Twilio SMS Gateway</h4>
                          <p className="text-xs text-gray-500 mt-1 mb-4 h-8">Global SMS delivery for OTPs and critical alerts.</p>
                          <button onClick={() => handleAction("Opening Twilio Config...")} className="w-full py-2 bg-medical-blue text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                            Configure Keys
                          </button>
                        </div>

                        {/* Email */}
                        <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50/50 hover:border-purple-400 transition-colors md:col-span-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">SendGrid SMTP</h4>
                                <p className="text-xs text-gray-500">Email delivery engine for reports and invoices.</p>
                              </div>
                            </div>
                            <button onClick={() => handleAction("Email settings opened")} className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                              Manage Settings
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Security & Backup */}
                {activeTab === "security" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gray-900 p-6 lg:p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-medical-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-widest mb-2 flex items-center gap-2 text-blue-400">
                            <Database className="w-6 h-6" /> Automated Cloud Backup
                          </h3>
                          <p className="text-sm text-gray-400 font-medium max-w-md">Your database is automatically backed up to secure AWS S3 buckets every 12 hours.</p>
                          <div className="mt-6 flex items-center gap-4 text-xs font-bold text-gray-300">
                            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-medical-green" /> Encrypted</span>
                            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-medical-green" /> Multi-region</span>
                          </div>
                        </div>
                        <button onClick={() => handleAction("Generating manual backup... This may take a few minutes.")} className="shrink-0 px-6 py-3 bg-medical-blue hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 transition-all">
                          <CloudLightning className="w-5 h-5" /> Generate Manual Backup
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                        <Fingerprint className="w-5 h-5 text-medical-blue" /> Advanced Security Policies
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">Enforce Global 2FA</p>
                            <p className="text-xs text-gray-500 mt-1">Force all staff members to use Two-Factor Authentication.</p>
                          </div>
                          <div className="w-12 h-6 bg-gray-200 rounded-full cursor-pointer relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div></div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                          <div>
                            <p className="font-bold text-gray-900">IP Whitelisting</p>
                            <p className="text-xs text-gray-500 mt-1">Restrict login access strictly to hospital network IP addresses.</p>
                          </div>
                          <button onClick={() => handleAction("IP Config opened")} className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50">Configure IPs</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Queue Management */}
                {activeTab === "queue" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                        <ListOrdered className="w-5 h-5 text-medical-blue" /> Live Queue Settings
                      </h3>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Token Prefix Format</label>
                            <input type="text" defaultValue="TKN-" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold" />
                            <p className="text-[10px] text-gray-400 mt-1">Example: TKN-101, TKN-102</p>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">TV Display Refresh Rate</label>
                            <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold">
                              <option>Real-time (WebSocket)</option>
                              <option>Every 5 Seconds</option>
                              <option>Every 10 Seconds</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                          <div>
                            <p className="font-bold text-gray-900">Voice Announcement</p>
                            <p className="text-xs text-gray-500 mt-1">Automatically announce token numbers on the waiting room TV.</p>
                          </div>
                          <div className="w-12 h-6 bg-medical-green rounded-full cursor-pointer relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Departments */}
                {activeTab === "departments" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                          <Network className="w-5 h-5 text-medical-blue" /> Hospital Departments
                        </h3>
                        <button className="px-4 py-2 bg-medical-blue text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          + Add Department
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Emergency (ER)", "ICU"].map((dept) => (
                          <div key={dept} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-medical-blue/30 transition-colors bg-gray-50/50">
                            <span className="font-bold text-gray-800">{dept}</span>
                            <button className="text-xs text-gray-400 hover:text-emergency-red font-bold transition-colors">Remove</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. System Preferences */}
                {activeTab === "preferences" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2 pb-4 border-b border-gray-50">
                        <Settings className="w-5 h-5 text-medical-blue" /> System Preferences
                      </h3>
                      <div className="space-y-6 max-w-lg">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">System Language</label>
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold text-gray-800">
                            <option value="en">English (US)</option>
                            <option value="bn">Bengali (BD)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Timezone</label>
                          <select className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-blue outline-none font-bold text-gray-800">
                            <option value="asia-dhaka">(GMT+06:00) Asia/Dhaka</option>
                            <option value="utc">(GMT+00:00) UTC</option>
                          </select>
                        </div>
                      </div>
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
