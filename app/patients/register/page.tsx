"use client";

import React, { useState } from "react";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  User, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Upload,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  Camera,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Contact Details", icon: MapPin },
  { id: 3, title: "Medical History", icon: Activity },
  { id: 4, title: "Insurance Info", icon: ShieldCheck },
  { id: 5, title: "Confirmation", icon: CheckCircle2 },
];

export default function PatientRegistration() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { token } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    nativeName: "",
    dateOfBirth: "",
    gender: "male",
    bloodGroup: "A+",
    nidNumber: "",
    maritalStatus: "Single",
    phone: "",
    email: "",
    address: {
      division: "",
      district: "",
      thana: "",
      village: ""
    },
    emergencyContact: {
      name: "",
      relation: "Spouse",
      phone: ""
    },
    medicalHistory: {
      allergies: "",
      chronicDiseases: "",
      pastSurgeries: "",
      currentMedications: ""
    },
    insurance: {
      providerName: "",
      policyNumber: "",
      validity: ""
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhotoPreview(imageUrl);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || "Failed to register patient");
      }

      const responseData = await res.json();
      router.push(`/patients/${responseData.data._id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title="Patient Registration" />
        
        <main className="p-6 flex-1 flex flex-col">
          {/* Stepper */}
          <div className="bg-white p-6 rounded-2xl border border-border-hms mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-0"></div>
              {steps.map((step) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all border-4 border-white",
                    currentStep >= step.id ? "bg-medical-green text-white" : "bg-gray-100 text-gray-400"
                  )}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    currentStep >= step.id ? "text-medical-green" : "text-gray-400"
                  )}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl border border-border-hms flex flex-col overflow-hidden">
            <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-bold">{error}</span>
                </div>
              )}

              {currentStep === 1 && (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 group hover:border-medical-green transition-colors cursor-pointer relative overflow-hidden"
                      >
                        {photoPreview ? (
                          <img src={photoPreview} alt="Patient Photo Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Camera className="w-10 h-10 text-gray-300 group-hover:text-medical-green transition-colors" />
                            <span className="text-xs font-bold text-gray-400 group-hover:text-medical-green">Photo Upload</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name (English)</label>
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                            placeholder="John Doe" 
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Name (Native/Local)</label>
                          <input 
                            type="text" 
                            name="nativeName"
                            value={formData.nativeName}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                            placeholder="John Doe" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="date" 
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                          <select 
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all appearance-none"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Blood Group</label>
                          <select 
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all appearance-none"
                          >
                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>O+</option>
                            <option>O-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">NID / Birth Certificate</label>
                          <input 
                            type="text" 
                            name="nidNumber"
                            value={formData.nidNumber}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                            placeholder="123 456 7890" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Marital Status</label>
                          <select 
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all appearance-none"
                          >
                            <option>Single</option>
                            <option>Married</option>
                            <option>Divorced</option>
                            <option>Widowed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="font-bold text-medical-blue uppercase tracking-widest text-xs">Primary Contact</h3>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                            placeholder="01712345678" 
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                            placeholder="john@example.com" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Village / Area</label>
                        <input 
                          type="text" 
                          name="address.village"
                          value={formData.address.village}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all h-12" 
                          placeholder="House 12, Road 5, Block B, Mirpur" 
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="font-bold text-emergency-red uppercase tracking-widest text-xs">Emergency Contact</h3>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contact Person Name</label>
                        <input 
                          type="text" 
                          name="emergencyContact.name"
                          value={formData.emergencyContact.name}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                          placeholder="Jane Doe" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Relationship</label>
                        <select 
                          name="emergencyContact.relation"
                          value={formData.emergencyContact.relation}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all appearance-none"
                        >
                          <option>Spouse</option>
                          <option>Parent</option>
                          <option>Sibling</option>
                          <option>Child</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Emergency Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="tel" 
                            name="emergencyContact.phone"
                            value={formData.emergencyContact.phone}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                            placeholder="01812345678" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="max-w-2xl mx-auto text-center py-12 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-medical-green/10 text-medical-green rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-medical-green/20">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-4">Complete Registration</h2>
                  <p className="text-gray-500 mb-8 text-lg">Please verify the information provided. A unique Patient ID will be generated upon submission.</p>
                  
                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 text-left space-y-6 mb-8 max-h-[400px] overflow-y-auto no-scrollbar">
                    
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-medical-blue mb-3 border-b border-gray-200 pb-2">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase">Patient Name</span>
                          <span className="text-sm text-gray-900 font-bold">{formData.name || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase">Date of Birth</span>
                          <span className="text-sm text-gray-900 font-bold">{formData.dateOfBirth || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase">Blood Group</span>
                          <span className="text-sm text-medical-green font-black">{formData.bloodGroup}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase">Phone Number</span>
                          <span className="text-sm text-gray-900 font-bold">{formData.phone || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-medical-blue mb-3 border-b border-gray-200 pb-2">Medical History</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase">Allergies</span>
                          <span className="text-sm text-gray-900 font-medium">{formData.medicalHistory.allergies || "None reported"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase">Chronic Diseases</span>
                          <span className="text-sm text-gray-900 font-medium">{formData.medicalHistory.chronicDiseases || "None reported"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-medical-blue mb-3 border-b border-gray-200 pb-2">Insurance Info</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase">Provider Name</span>
                          <span className="text-sm text-gray-900 font-bold">{formData.insurance.providerName || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 font-bold uppercase">Policy Number</span>
                          <span className="text-sm text-gray-900 font-bold">{formData.insurance.policyNumber || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold py-4 rounded-xl transition-all">Print Draft</button>
                    <button 
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-[2] bg-medical-green hover:bg-medical-green/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-medical-green/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Registration"}
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Medical History Step */}
              {currentStep === 3 && (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical History</h2>
                  <p className="text-gray-500 mb-8">Please provide accurate medical history to help doctors offer better treatment.</p>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Known Allergies</label>
                      <textarea 
                        name="medicalHistory.allergies"
                        value={formData.medicalHistory.allergies}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all resize-none" 
                        placeholder="E.g., Peanuts, Penicillin (Leave empty if none)" 
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Chronic Diseases</label>
                      <textarea 
                        name="medicalHistory.chronicDiseases"
                        value={formData.medicalHistory.chronicDiseases}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all resize-none" 
                        placeholder="E.g., Diabetes, Hypertension (Leave empty if none)" 
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Past Surgeries / Procedures</label>
                      <textarea 
                        name="medicalHistory.pastSurgeries"
                        value={formData.medicalHistory.pastSurgeries}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all resize-none" 
                        placeholder="E.g., Appendectomy in 2018 (Leave empty if none)" 
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Current Medications</label>
                      <textarea 
                        name="medicalHistory.currentMedications"
                        value={formData.medicalHistory.currentMedications}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all resize-none" 
                        placeholder="E.g., Metformin 500mg daily (Leave empty if none)" 
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Insurance Info Step */}
              {currentStep === 4 && (
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Insurance Information</h2>
                  <p className="text-gray-500 mb-8">Add insurance details to streamline the billing process. Leave blank if not applicable.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Insurance Provider Name</label>
                      <input 
                        type="text" 
                        name="insurance.providerName"
                        value={formData.insurance.providerName}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                        placeholder="E.g., MetLife, Pragati Life Insurance" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Policy Number</label>
                      <input 
                        type="text" 
                        name="insurance.policyNumber"
                        value={formData.insurance.policyNumber}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                        placeholder="POL-123456789" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Validity / Expiry Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="date" 
                          name="insurance.validity"
                          value={formData.insurance.validity}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-medical-green outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border-hms bg-gray-50 flex items-center justify-between">
              <button 
                onClick={prevStep}
                disabled={currentStep === 1 || loading}
                className={cn(
                  "flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all",
                  (currentStep === 1 || loading) ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-200"
                )}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              
              <div className="flex items-center gap-2">
                {steps.map(s => (
                  <div key={s.id} className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentStep === s.id ? "w-8 bg-medical-green" : "bg-gray-200"
                  )}></div>
                ))}
              </div>

              <button 
                onClick={nextStep}
                disabled={currentStep === 5 || loading}
                className={cn(
                  "flex items-center gap-2 font-bold px-8 py-3 rounded-xl transition-all",
                  (currentStep === 5 || loading) ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-medical-green text-white hover:bg-medical-green/90 shadow-lg shadow-medical-green/10"
                )}
              >
                {currentStep === 4 ? "Review Summary" : "Continue"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
