"use client";

import React, { useState } from "react";
import { 
  X, 
  AlertTriangle, 
  Ambulance, 
  ShieldAlert, 
  UserPlus, 
  Activity, 
  BellRing, 
  Trash2,
  CheckCircle2,
  Clock,
  Heart
} from "lucide-react";
import { useEmergencyStore } from "@/lib/store/useEmergencyStore";
import { cn } from "@/lib/utils";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const { 
    activeSiren, 
    triggerSiren, 
    clearSiren, 
    addIntake, 
    intakes, 
    removeIntake 
  } = useEmergencyStore();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [complaint, setComplaint] = useState("");
  const [priority, setPriority] = useState<"Critical" | "Urgent" | "Stable" | "Minor">("Critical");
  const [bay, setBay] = useState("Red Trauma Bay 01");
  const [isUnconscious, setIsUnconscious] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  if (!isOpen) return null;

  const handleUnconsciousToggle = () => {
    const nextState = !isUnconscious;
    setIsUnconscious(nextState);
    if (nextState) {
      setName(`Unidentified ${gender} Patient`);
      setAge("~30");
      setComplaint("Trauma case, unresponsive");
      setPriority("Critical");
      setBay("Red Trauma Bay 01");
    } else {
      setName("");
      setAge("");
      setComplaint("");
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGender = e.target.value;
    setGender(newGender);
    if (isUnconscious) {
      setName(`Unidentified ${newGender} Patient`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !complaint) return;

    addIntake({
      name,
      age,
      gender,
      complaint,
      priority,
      bay
    });

    setToastMessage(`🚨 EMERGENCY INTAKE DISPATCHED: ${name} is assigned to ${bay}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);

    // Reset Form
    if (!isUnconscious) {
      setName("");
      setAge("");
      setComplaint("");
    } else {
      // Re-randomize or keep
      const nextId = Math.floor(Math.random() * 1000);
      setName(`Unidentified ${gender} Patient #${nextId}`);
    }
  };

  const triggerIncomingSimulation = (type: string, eta: string) => {
    triggerSiren(type, eta);
    setToastMessage(`🔊 AMBULANCE SIREN ALARM ACTIVATED: Incoming ${type} - ETA ${eta}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-red-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner Headers */}
        <div className="bg-gradient-to-r from-emergency-red to-red-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                Emergency Command & Triage Portal
                {activeSiren && (
                  <span className="bg-white text-emergency-red text-[10px] px-2 py-0.5 rounded-full font-black animate-ping">SIREN ON</span>
                )}
              </h2>
              <p className="text-xs text-white/80">Trauma Bay Management • Live Intake & ambulance Siren Control</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Toast Alert inside modal */}
        {showToast && (
          <div className="bg-gray-900 text-white px-6 py-3 text-sm font-black tracking-wide flex items-center justify-between border-b border-gray-800 animate-in slide-in-from-top duration-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emergency-red animate-ping shrink-0"></span>
              {toastMessage}
            </span>
            <button onClick={() => setShowToast(false)} className="text-white/40 hover:text-white text-xs font-bold uppercase ml-4">Dismiss</button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Triage Register Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emergency-red" />
                Trauma Triage Intake Register
              </h3>
              <label className="flex items-center gap-2 bg-red-50 text-emergency-red px-3 py-1 rounded-full cursor-pointer hover:bg-red-100 transition-colors border border-red-100/50">
                <input 
                  type="checkbox" 
                  checked={isUnconscious} 
                  onChange={handleUnconsciousToggle}
                  className="w-3.5 h-3.5 rounded text-emergency-red focus:ring-emergency-red" 
                />
                <span className="text-[10px] font-black uppercase tracking-wider">Unconscious Patient</span>
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Patient Name / Identifier</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUnconscious}
                  placeholder={isUnconscious ? `Unidentified ${gender} Patient` : "e.g. John Doe"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emergency-red outline-none transition-all placeholder:text-gray-400 font-bold disabled:bg-gray-100 disabled:text-gray-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Age</label>
                  <input 
                    type="text" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 45"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emergency-red outline-none transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Gender</label>
                  <select 
                    value={gender}
                    onChange={handleGenderChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emergency-red outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Triage Priority Selector Card Grid */}
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Triage Priority Level</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {(['Critical', 'Urgent', 'Stable', 'Minor'] as const).map((lvl) => {
                    const active = priority === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPriority(lvl)}
                        className={cn(
                          "py-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all",
                          lvl === 'Critical' && (active ? "bg-emergency-red text-white border-emergency-red shadow-lg shadow-emergency-red/20 scale-105" : "bg-white border-red-100 text-emergency-red hover:bg-red-50"),
                          lvl === 'Urgent' && (active ? "bg-warning-amber text-white border-warning-amber shadow-lg shadow-warning-amber/20 scale-105" : "bg-white border-amber-100 text-warning-amber hover:bg-amber-50"),
                          lvl === 'Stable' && (active ? "bg-medical-blue text-white border-medical-blue shadow-lg shadow-medical-blue/20 scale-105" : "bg-white border-blue-100 text-medical-blue hover:bg-blue-50"),
                          lvl === 'Minor' && (active ? "bg-medical-green text-white border-medical-green shadow-lg shadow-medical-green/20 scale-105" : "bg-white border-green-100 text-medical-green hover:bg-green-50"),
                        )}
                      >
                        <Heart className={cn("w-4 h-4 mb-1", active && "fill-current animate-pulse")} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{lvl}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Chief Complaint / Diagnosis</label>
                  <input 
                    type="text" 
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder="e.g. Chest pain, bleeding"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emergency-red outline-none transition-all placeholder:text-gray-400 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Bay / Room Assignment</label>
                  <select
                    value={bay}
                    onChange={(e) => setBay(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emergency-red outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="Red Trauma Bay 01">Red Trauma Bay 01</option>
                    <option value="Red Trauma Bay 02">Red Trauma Bay 02</option>
                    <option value="Yellow Room 01">Yellow Room 01</option>
                    <option value="Yellow Room 02">Yellow Room 02</option>
                    <option value="Green Triage Bed 08">Green Triage Bed 08</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emergency-red hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-emergency-red/20 transition-all flex items-center justify-center gap-2 group"
              >
                <UserPlus className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
                Dispatch Trauma Team Now
              </button>
            </form>
          </div>

          {/* Right Column: Simulation Suite & Real-Time Log */}
          <div className="space-y-6 lg:border-l lg:border-gray-100 lg:pl-8">
            <div>
              <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm flex items-center gap-2 pb-3 border-b border-gray-100">
                <BellRing className="w-5 h-5 text-emergency-red" />
                Live Incident Simulation Control
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => triggerIncomingSimulation("Road Accident / Multiple Trauma", "3 mins")}
                className="flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 border border-red-100 rounded-2xl transition-all group text-center"
              >
                <Ambulance className="w-8 h-8 text-emergency-red mb-2 animate-bounce group-hover:scale-110 transition-all" />
                <span className="text-xs font-black text-emergency-red uppercase tracking-wider">Ambulance Siren</span>
                <span className="text-[9px] text-red-500 font-bold mt-1">Simulate inbound trauma (ETA 3m)</span>
              </button>

              <button
                onClick={() => triggerIncomingSimulation("Severe Cardiac Arrest", "1 min")}
                className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl transition-all group text-center"
              >
                <Activity className="w-8 h-8 text-warning-amber mb-2 animate-pulse group-hover:scale-110 transition-all" />
                <span className="text-xs font-black text-warning-amber uppercase tracking-wider">Cardiac Code Red</span>
                <span className="text-[9px] text-amber-600 font-bold mt-1">ETA 1m • Urgent Defibrillator</span>
              </button>
            </div>

            {activeSiren && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emergency-red animate-ping"></div>
                  <div>
                    <p className="text-xs font-black text-emergency-red uppercase">SIREN SIREN SIREN SIREN SIREN SIREN SIREN SIREN SIREN SIREN</p>
                    <p className="text-[10px] text-red-600 font-black">Active Alert: Incoming ambulance with critical trauma case!</p>
                  </div>
                </div>
                <button 
                  onClick={clearSiren}
                  className="bg-white border border-red-200 text-emergency-red hover:bg-red-50 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors"
                >
                  Clear Siren
                </button>
              </div>
            )}

            {/* Active Trauma Log */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Active Triage Log ({intakes.length})</span>
                <span className="text-[9px] bg-red-100 text-emergency-red px-2 py-0.5 rounded-full font-black uppercase">Live Updates</span>
              </div>
              
              <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
                {intakes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">No active emergency entries yet.</div>
                ) : (
                  intakes.map((log) => (
                    <div key={log.id} className="bg-white p-3.5 rounded-xl border border-gray-100 flex items-center justify-between group hover:border-red-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2.5 h-2.5 rounded-full shrink-0",
                          log.priority === 'Critical' && "bg-emergency-red animate-ping",
                          log.priority === 'Urgent' && "bg-warning-amber",
                          log.priority === 'Stable' && "bg-medical-blue",
                          log.priority === 'Minor' && "bg-medical-green",
                        )}></div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 flex items-center gap-2">
                            {log.name}
                            <span className="text-[9px] text-gray-400 font-medium">({log.id})</span>
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {log.complaint} • <span className="font-bold text-gray-700">{log.bay}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-black text-gray-900">{log.time}</p>
                          <p className="text-[9px] font-bold text-gray-400 italic">{log.status}</p>
                        </div>
                        <button 
                          onClick={() => removeIntake(log.id)}
                          className="p-1.5 text-gray-300 hover:text-emergency-red hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
