"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import HMSSidebar from "@/components/hms/HMSSidebar";
import HMSHeader from "@/components/hms/HMSHeader";
import { 
  User, 
  Activity, 
  Plus, 
  Search, 
  FileText, 
  FlaskConical, 
  Bed, 
  AlertCircle,
  Save,
  Printer,
  ChevronDown,
  History,
  Info,
  Loader2,
  X,
  ChevronLeft,
  Check,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Patient {
  _id: string;
  name: string;
  patientId: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  medicalHistory?: { allergies?: string; chronicDiseases?: string; pastSurgeries?: string; currentMedications?: string };
}

interface Appointment {
  _id: string;
  appointmentId: string;
  patient: Patient;
  doctor: { _id: string; name: string; role: string };
  department?: { _id: string; name: string };
  date: string;
  timeSlot: string;
  tokenNumber?: number;
  status: string;
  chiefComplaint?: string;
  visitType: string;
}

interface MedicalRecord {
  _id: string;
  recordId: string;
  vitals: {
    bloodPressure?: { systolic?: number; diastolic?: number };
    pulse?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    oxygenSat?: number;
    respiratoryRate?: number;
  };
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  physicalExamination?: string;
  systemicExamination?: string;
  primaryDiagnosis?: { icdCode?: string; description?: string };
  secondaryDiagnoses?: { icdCode?: string; description?: string }[];
  treatmentPlan?: string;
  advice?: string[];
  dietAdvice?: string;
  followUpDate?: string;
  followUpNotes?: string;
  referral?: { isReferred?: boolean; referredTo?: string; reason?: string };
  admittedToIPD?: boolean;
}

interface Prescription {
  _id: string;
  prescriptionId: string;
  prescriptionDate: string;
  diagnosis?: string;
  medicines?: any[];
  doctor: { name: string };
}

const getAge = (dob: string) => {
  if (!dob) return "";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age}y`;
};

export default function OPDConsultation() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  const { token, user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [existingRecord, setExistingRecord] = useState<MedicalRecord | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [savingVitals, setSavingVitals] = useState(false);

  const [vitals, setVitals] = useState({
    systolic: "",
    diastolic: "",
    pulse: "",
    temperature: "",
    weight: "",
    height: "",
    oxygenSat: "",
    respiratoryRate: "",
  });

  const [consultation, setConsultation] = useState({
    chiefComplaint: "",
    historyOfPresentIllness: "",
    physicalExamination: "",
    primaryDiagnosisCode: "",
    primaryDiagnosisDesc: "",
    secondaryDiagnoses: [] as { icdCode: string; description: string }[],
    treatmentPlan: "",
    advice: "",
    dietAdvice: "",
    followUpDate: "",
    followUpNotes: "",
  });

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showLabOrderModal, setShowLabOrderModal] = useState(false);
  const [showRadiologyOrderModal, setShowRadiologyOrderModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [availableBeds, setAvailableBeds] = useState<any[]>([]);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [selectedBed, setSelectedBed] = useState("");
  const [admissionWard, setAdmissionWard] = useState("");
  const [admissionType, setAdmissionType] = useState("planned");
  const [admissionDiagnosis, setAdmissionDiagnosis] = useState("");
  const [savingAdmission, setSavingAdmission] = useState(false);

  const [newMedicine, setNewMedicine] = useState({
    medicineName: "",
    dose: "",
    frequency: "",
    duration: "",
    timing: "after_meal" as const,
    route: "oral" as const,
    instructions: "",
  });

  const [prescriptionDiagnosis, setPrescriptionDiagnosis] = useState("");
  const [prescriptionAdvice, setPrescriptionAdvice] = useState("");
  const [prescriptionFollowUp, setPrescriptionFollowUp] = useState("");
  const [savingPrescription, setSavingPrescription] = useState(false);

  const [labTestsCatalog, setLabTestsCatalog] = useState<any[]>([]);
  const [labTestSearch, setLabTestSearch] = useState("");
  const [selectedLabTests, setSelectedLabTests] = useState<any[]>([]);
  const [labOrderPriority, setLabOrderPriority] = useState("routine");
  const [labOrderNotes, setLabOrderNotes] = useState("");
  const [savingLabOrder, setSavingLabOrder] = useState(false);
  const [loadingLabTests, setLoadingLabTests] = useState(false);

  const [radiologyStudies, setRadiologyStudies] = useState<{ testName: string; modality: string; bodyPart: string; instructions: string; contrast: boolean }[]>([]);
  const [radiologyPriority, setRadiologyPriority] = useState("routine");
  const [radiologyClinicalHistory, setRadiologyClinicalHistory] = useState("");
  const [radiologyReason, setRadiologyReason] = useState("");
  const [radiologyNotes, setRadiologyNotes] = useState("");
  const [savingRadiology, setSavingRadiology] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token || !appointmentId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?date=`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const apt = data.data?.find((a: any) => a._id === appointmentId || a.appointmentId === appointmentId);
        if (apt) {
          setAppointment(apt);
          setPatient(apt.patient);
          if (apt.chiefComplaint) {
            setConsultation(prev => ({ ...prev, chiefComplaint: apt.chiefComplaint }));
          }

          try {
            const recRes = await fetch(`/api/consultations?appointmentId=${apt._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const recData = await recRes.json();
            if (recData.success && recData.data?.length > 0) {
              const rec = recData.data[0];
              setExistingRecord(rec);
              if (rec.vitals) {
                setVitals({
                  systolic: rec.vitals.bloodPressure?.systolic?.toString() || "",
                  diastolic: rec.vitals.bloodPressure?.diastolic?.toString() || "",
                  pulse: rec.vitals.pulse?.toString() || "",
                  temperature: rec.vitals.temperature?.toString() || "",
                  weight: rec.vitals.weight?.toString() || "",
                  height: rec.vitals.height?.toString() || "",
                  oxygenSat: rec.vitals.oxygenSat?.toString() || "",
                  respiratoryRate: rec.vitals.respiratoryRate?.toString() || "",
                });
              }
              setConsultation({
                chiefComplaint: rec.chiefComplaint || "",
                historyOfPresentIllness: rec.historyOfPresentIllness || "",
                physicalExamination: rec.physicalExamination || "",
                primaryDiagnosisCode: rec.primaryDiagnosis?.icdCode || "",
                primaryDiagnosisDesc: rec.primaryDiagnosis?.description || "",
                secondaryDiagnoses: rec.secondaryDiagnoses || [],
                treatmentPlan: rec.treatmentPlan || "",
                advice: rec.advice?.join(", ") || "",
                dietAdvice: rec.dietAdvice || "",
                followUpDate: rec.followUpDate ? new Date(rec.followUpDate).toISOString().split("T")[0] : "",
                followUpNotes: rec.followUpNotes || "",
              });
            }
          } catch {}

          try {
            const rxRes = await fetch(`/api/prescriptions?appointmentId=${apt._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const rxData = await rxRes.json();
            if (rxData.success) setPrescriptions(rxData.data || []);
          } catch {}
        }
      }
    } catch {
      toast.error("Failed to load consultation data");
    } finally {
      setLoading(false);
    }
  }, [token, appointmentId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveVitals = async () => {
    if (!token || !appointment || !patient) return;
    setSavingVitals(true);
    try {
      const payload: any = {
        patient: patient._id,
        appointment: appointment._id,
        doctor: user?.id || "",
        visitType: appointment.visitType || "opd",
        visitDate: new Date().toISOString(),
        vitals: {
          bloodPressure: {
            systolic: vitals.systolic ? Number(vitals.systolic) : undefined,
            diastolic: vitals.diastolic ? Number(vitals.diastolic) : undefined,
          },
          pulse: vitals.pulse ? Number(vitals.pulse) : undefined,
          temperature: vitals.temperature ? Number(vitals.temperature) : undefined,
          weight: vitals.weight ? Number(vitals.weight) : undefined,
          height: vitals.height ? Number(vitals.height) : undefined,
          oxygenSat: vitals.oxygenSat ? Number(vitals.oxygenSat) : undefined,
          respiratoryRate: vitals.respiratoryRate ? Number(vitals.respiratoryRate) : undefined,
        },
        chiefComplaint: consultation.chiefComplaint,
      };

      if (existingRecord) {
        const res = await fetch(`/api/consultations/${existingRecord._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ vitals: payload.vitals }),
        });
        const data = await res.json();
        if (data.success) toast.success("Vitals updated successfully");
        else toast.error(data.message || "Failed to update vitals");
      } else {
        const res = await fetch("/api/consultations", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setExistingRecord(data.data);
          toast.success("Vitals saved successfully");
        } else {
          toast.error(data.message || "Failed to save vitals");
        }
      }
    } catch {
      toast.error("An error occurred while saving vitals");
    } finally {
      setSavingVitals(false);
    }
  };

  const handleSaveConsultation = async () => {
    if (!token || !appointment || !patient) return;
    setSaving(true);
    try {
      const payload: any = {
        patient: patient._id,
        appointment: appointment._id,
        doctor: user?.id || "",
        visitType: appointment.visitType || "opd",
        visitDate: new Date().toISOString(),
        chiefComplaint: consultation.chiefComplaint,
        historyOfPresentIllness: consultation.historyOfPresentIllness,
        physicalExamination: consultation.physicalExamination,
        primaryDiagnosis: {
          icdCode: consultation.primaryDiagnosisCode,
          description: consultation.primaryDiagnosisDesc,
        },
        secondaryDiagnoses: consultation.secondaryDiagnoses,
        treatmentPlan: consultation.treatmentPlan,
        advice: consultation.advice ? consultation.advice.split(",").map((a: string) => a.trim()).filter(Boolean) : [],
        dietAdvice: consultation.dietAdvice,
        followUpDate: consultation.followUpDate || undefined,
        followUpNotes: consultation.followUpNotes,
        vitals: {
          bloodPressure: {
            systolic: vitals.systolic ? Number(vitals.systolic) : undefined,
            diastolic: vitals.diastolic ? Number(vitals.diastolic) : undefined,
          },
          pulse: vitals.pulse ? Number(vitals.pulse) : undefined,
          temperature: vitals.temperature ? Number(vitals.temperature) : undefined,
          weight: vitals.weight ? Number(vitals.weight) : undefined,
          height: vitals.height ? Number(vitals.height) : undefined,
          oxygenSat: vitals.oxygenSat ? Number(vitals.oxygenSat) : undefined,
          respiratoryRate: vitals.respiratoryRate ? Number(vitals.respiratoryRate) : undefined,
        },
      };

      if (existingRecord) {
        const res = await fetch(`/api/consultations/${existingRecord._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setExistingRecord(data.data);
          toast.success("Consultation record updated successfully");
        } else {
          toast.error(data.message || "Failed to update record");
        }
      } else {
        const res = await fetch("/api/consultations", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setExistingRecord(data.data);
          toast.success("Consultation record saved successfully");
        } else {
          toast.error(data.message || "Failed to save record");
        }
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSecondaryDiagnosis = () => {
    if (consultation.primaryDiagnosisCode && consultation.primaryDiagnosisDesc) {
      setConsultation(prev => ({
        ...prev,
        secondaryDiagnoses: [...prev.secondaryDiagnoses, { icdCode: prev.primaryDiagnosisCode, description: prev.primaryDiagnosisDesc }],
        primaryDiagnosisCode: "",
        primaryDiagnosisDesc: "",
      }));
    }
  };

  const handleRemoveSecondaryDiagnosis = (index: number) => {
    setConsultation(prev => ({
      ...prev,
      secondaryDiagnoses: prev.secondaryDiagnoses.filter((_, i) => i !== index),
    }));
  };

  const handleSavePrescription = async () => {
    if (!token || !appointment || !patient) return;
    setSavingPrescription(true);
    try {
      const payload = {
        patient: patient._id,
        doctor: user?.id || "",
        medicalRecord: existingRecord?._id || undefined,
        appointment: appointment._id,
        prescriptionDate: new Date().toISOString(),
        diagnosis: prescriptionDiagnosis,
        medicines: [],
        generalAdvice: prescriptionAdvice ? [prescriptionAdvice] : [],
        followUpDate: prescriptionFollowUp || undefined,
      };

      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Prescription saved successfully");
        setShowPrescriptionModal(false);
        setPrescriptionDiagnosis("");
        setPrescriptionAdvice("");
        setPrescriptionFollowUp("");
        fetchData();
      } else {
        toast.error(data.message || "Failed to save prescription");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSavingPrescription(false);
    }
  };

  const fetchLabTests = async (search = "") => {
    if (!token) return;
    setLoadingLabTests(true);
    try {
      const url = search ? `/api/lab-tests?search=${encodeURIComponent(search)}` : "/api/lab-tests";
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setLabTestsCatalog(data.data || []);
    } catch {} finally {
      setLoadingLabTests(false);
    }
  };

  const handleOpenLabOrder = () => {
    setShowLabOrderModal(true);
    setLabTestSearch("");
    setSelectedLabTests([]);
    setLabOrderPriority("routine");
    setLabOrderNotes("");
    fetchLabTests();
  };

  const handleAddLabTest = (test: any) => {
    if (selectedLabTests.find((t) => t.testCode === test.testCode)) return;
    setSelectedLabTests((prev) => [...prev, test]);
  };

  const handleRemoveLabTest = (testCode: string) => {
    setSelectedLabTests((prev) => prev.filter((t) => t.testCode !== testCode));
  };

  const handleSaveLabOrder = async () => {
    if (!token || !patient || selectedLabTests.length === 0) {
      toast.error("Please select at least one test");
      return;
    }
    setSavingLabOrder(true);
    try {
      const res = await fetch("/api/lab-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          patient: patient._id,
          tests: selectedLabTests.map((t) => ({
            testId: t._id,
            testName: t.testName,
            testCode: t.testCode,
            price: t.price,
            sampleType: t.sampleType?.[0],
          })),
          priority: labOrderPriority,
          notes: labOrderNotes || undefined,
          prescription: prescriptions[0]?._id || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Lab order placed successfully");
        setShowLabOrderModal(false);
      } else {
        toast.error(data.message || "Failed to place lab order");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSavingLabOrder(false);
    }
  };

  const handleOpenRadiologyOrder = () => {
    setShowRadiologyOrderModal(true);
    setRadiologyStudies([{ testName: "", modality: "xray", bodyPart: "", instructions: "", contrast: false }]);
    setRadiologyPriority("routine");
    setRadiologyClinicalHistory("");
    setRadiologyReason("");
    setRadiologyNotes("");
  };

  const handleAddRadiologyStudy = () => {
    setRadiologyStudies((prev) => [...prev, { testName: "", modality: "xray", bodyPart: "", instructions: "", contrast: false }]);
  };

  const handleUpdateRadiologyStudy = (index: number, field: string, value: any) => {
    setRadiologyStudies((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleRemoveRadiologyStudy = (index: number) => {
    setRadiologyStudies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveRadiologyOrder = async () => {
    if (!token || !patient) return;
    const validStudies = radiologyStudies.filter((s) => s.testName.trim());
    if (validStudies.length === 0) {
      toast.error("Please add at least one study");
      return;
    }
    setSavingRadiology(true);
    try {
      const res = await fetch("/api/radiology-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          patient: patient._id,
          appointment: appointment?._id,
          studies: validStudies,
          priority: radiologyPriority,
          clinicalHistory: radiologyClinicalHistory || undefined,
          reasonForExam: radiologyReason || undefined,
          notes: radiologyNotes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Radiology order placed successfully");
        setShowRadiologyOrderModal(false);
      } else {
        toast.error(data.message || "Failed to place radiology order");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSavingRadiology(false);
    }
  };

  const handleOpenAdmitModal = () => {
    setShowAdmitModal(true);
    setSelectedBed("");
    setAdmissionWard("");
    setAdmissionType("planned");
    setAdmissionDiagnosis(consultation.primaryDiagnosisDesc || "");
    fetchAvailableBeds();
  };

  const fetchAvailableBeds = async () => {
    if (!token) return;
    setLoadingBeds(true);
    try {
      const res = await fetch("/api/beds?availableOnly=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAvailableBeds(data.data || []);
    } catch {} finally {
      setLoadingBeds(false);
    }
  };

  const handleSaveAdmission = async () => {
    if (!token || !patient || !selectedBed) {
      toast.error("Please select a bed");
      return;
    }
    setSavingAdmission(true);
    try {
      const res = await fetch("/api/ipd-admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          patient: patient._id,
          bed: selectedBed,
          ward: admissionWard || undefined,
          admissionType,
          admissionDiagnosis: admissionDiagnosis || undefined,
          department: appointment?.department?._id || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Patient admitted to IPD successfully");
        setShowAdmitModal(false);
      } else {
        toast.error(data.message || "Failed to admit patient");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSavingAdmission(false);
    }
  };

  const handleCompleteAppointment = async () => {
    if (!token || !appointment) return;
    try {
      const res = await fetch(`/api/appointments/${appointment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "completed" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Appointment completed successfully");
        router.push("/opd");
      } else {
        toast.error(data.message || "Failed to complete appointment");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-light-bg">
        <HMSSidebar />
        <div className="flex-1 flex flex-col">
          <HMSHeader title="Loading..." />
          <main className="p-6 flex items-center justify-center flex-1">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-medical-blue animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading consultation data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!appointment || !patient) {
    return (
      <div className="flex min-h-screen bg-light-bg">
        <HMSSidebar />
        <div className="flex-1 flex flex-col">
          <HMSHeader title="Consultation Not Found" />
          <main className="p-6 flex items-center justify-center flex-1">
            <div className="text-center">
              <Stethoscope className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-2">Appointment Not Found</h3>
              <p className="text-sm font-medium text-gray-500 mb-6">The appointment you are looking for does not exist.</p>
              <Link href="/opd" className="bg-medical-blue text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-medical-blue/20 hover:scale-105 transition-all inline-flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back to OPD
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const age = getAge(patient.dateOfBirth);

  return (
    <div className="flex min-h-screen bg-light-bg">
      <HMSSidebar />
      <div className="flex-1 flex flex-col">
        <HMSHeader title={`OPD Consultation - ${appointment.appointmentId}`} />
        
        <main className="p-6 flex flex-col xl:flex-row gap-6">
          {/* Left Column - Patient Quick Info */}
          <div className="w-full xl:w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-border-hms overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border-hms flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 p-1 border border-gray-100 mb-4">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} 
                    className="w-full h-full rounded-xl object-cover"
                    alt="Patient"
                  />
                </div>
                <h2 className="text-lg font-black text-gray-900">{patient.name}</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{patient.patientId}</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold rounded-full">{age} / {patient.gender?.charAt(0).toUpperCase()}</span>
                  {patient.bloodGroup && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded-full">{patient.bloodGroup}</span>
                  )}
                </div>
              </div>

              {patient.medicalHistory?.allergies && (
                <div className="p-4 bg-emergency-red/5 border-b border-emergency-red/10 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-emergency-red shrink-0" />
                  <p className="text-[10px] font-bold text-emergency-red leading-tight">Allergy: {patient.medicalHistory.allergies}</p>
                </div>
              )}

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Patient Vitals</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Systolic</label>
                      <input type="number" value={vitals.systolic} onChange={e => setVitals(p => ({ ...p, systolic: e.target.value }))} className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="120" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Diastolic</label>
                      <input type="number" value={vitals.diastolic} onChange={e => setVitals(p => ({ ...p, diastolic: e.target.value }))} className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="80" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Pulse</label>
                      <input type="number" value={vitals.pulse} onChange={e => setVitals(p => ({ ...p, pulse: e.target.value }))} className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="72" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Temp</label>
                      <input type="number" step="0.1" value={vitals.temperature} onChange={e => setVitals(p => ({ ...p, temperature: e.target.value }))} className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="98.6" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Weight (kg)</label>
                      <input type="number" step="0.1" value={vitals.weight} onChange={e => setVitals(p => ({ ...p, weight: e.target.value }))} className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="65" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Height (cm)</label>
                      <input type="number" value={vitals.height} onChange={e => setVitals(p => ({ ...p, height: e.target.value }))} className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="165" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">O2 Sat</label>
                      <input type="number" value={vitals.oxygenSat} onChange={e => setVitals(p => ({ ...p, oxygenSat: e.target.value }))} className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="98" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Resp Rate</label>
                      <input type="number" value={vitals.respiratoryRate} onChange={e => setVitals(p => ({ ...p, respiratoryRate: e.target.value }))} className="w-full bg-gray-50 border-none rounded-lg py-2 px-3 text-xs font-bold focus:ring-1 focus:ring-medical-green" placeholder="16" />
                    </div>
                  </div>
                  <button 
                    onClick={handleSaveVitals} 
                    disabled={savingVitals}
                    className="w-full mt-4 bg-gray-100 text-gray-600 text-[10px] font-black py-2 rounded-lg hover:bg-gray-200 transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {savingVitals ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    Save Vitals
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border-hms shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Patient Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Phone</span>
                  <span className="text-xs font-bold text-gray-700">{patient.phone || "N/A"}</span>
                </div>
                {patient.medicalHistory?.chronicDiseases && (
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Chronic</span>
                    <span className="text-xs font-bold text-gray-700">{patient.medicalHistory.chronicDiseases}</span>
                  </div>
                )}
                {patient.medicalHistory?.currentMedications && (
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Medications</span>
                    <span className="text-xs font-bold text-gray-700">{patient.medicalHistory.currentMedications}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Column - Consultation Form */}
          <div className="flex-1 min-w-0 space-y-6">
            <div className="bg-white rounded-2xl border border-border-hms shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-border-hms flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-medical-green" />
                  <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm">Consultation Record</h2>
                  {existingRecord && (
                    <span className="px-2 py-0.5 bg-medical-green/10 text-medical-green text-[10px] font-black rounded-full border border-medical-green/20">
                      {existingRecord.recordId}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href="/opd" className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors" title="Back to OPD">
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-280px)] no-scrollbar">
                <div>
                  <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Chief Complaint</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-medical-green transition-all outline-none min-h-[100px] resize-none"
                    placeholder="Enter patient complaints here..."
                    value={consultation.chiefComplaint}
                    onChange={e => setConsultation(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">History of Present Illness</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-medical-green transition-all outline-none min-h-[80px] resize-none"
                    placeholder="Detailed history of the current illness..."
                    value={consultation.historyOfPresentIllness}
                    onChange={e => setConsultation(prev => ({ ...prev, historyOfPresentIllness: e.target.value }))}
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Physical Examination</label>
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-medical-green transition-all outline-none min-h-[120px] resize-none"
                      placeholder="Examination findings..."
                      value={consultation.physicalExamination}
                      onChange={e => setConsultation(prev => ({ ...prev, physicalExamination: e.target.value }))}
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Clinical Diagnosis</label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <input type="text" className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-green" placeholder="ICD Code" value={consultation.primaryDiagnosisCode} onChange={e => setConsultation(prev => ({ ...prev, primaryDiagnosisCode: e.target.value }))} />
                      <input type="text" className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-green" placeholder="Diagnosis description" value={consultation.primaryDiagnosisDesc} onChange={e => setConsultation(prev => ({ ...prev, primaryDiagnosisDesc: e.target.value }))} />
                    </div>
                    <button onClick={handleAddSecondaryDiagnosis} className="w-full mb-3 bg-gray-100 text-gray-600 text-[10px] font-black py-2 rounded-lg hover:bg-gray-200 transition-all uppercase tracking-widest flex items-center justify-center gap-1">
                      <Plus className="w-3 h-3" /> Add to Diagnoses
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {consultation.primaryDiagnosisDesc && (
                        <span className="bg-medical-green/10 text-medical-green px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-medical-green/20">
                          {consultation.primaryDiagnosisCode} - {consultation.primaryDiagnosisDesc}
                          <button onClick={() => setConsultation(prev => ({ ...prev, primaryDiagnosisCode: "", primaryDiagnosisDesc: "" }))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                      )}
                      {consultation.secondaryDiagnoses.map((d, i) => (
                        <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100">
                          {d.icdCode} - {d.description}
                          <button onClick={() => handleRemoveSecondaryDiagnosis(i)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Treatment Plan & Advice</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-medical-green transition-all outline-none min-h-[100px] resize-none"
                    placeholder="Treatment plan, medications and other notes..."
                    value={consultation.treatmentPlan}
                    onChange={e => setConsultation(prev => ({ ...prev, treatmentPlan: e.target.value }))}
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">General Advice</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-green" placeholder="Comma-separated advice" value={consultation.advice} onChange={e => setConsultation(prev => ({ ...prev, advice: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Diet Advice</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-green" placeholder="Diet recommendations" value={consultation.dietAdvice} onChange={e => setConsultation(prev => ({ ...prev, dietAdvice: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Follow-up Date</label>
                    <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-green" value={consultation.followUpDate} onChange={e => setConsultation(prev => ({ ...prev, followUpDate: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wider">Follow-up Notes</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-green" placeholder="Instructions for follow-up" value={consultation.followUpNotes} onChange={e => setConsultation(prev => ({ ...prev, followUpNotes: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border-hms bg-gray-50/50 flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-400 italic">
                  {existingRecord ? "Record found - editing existing" : "New record - will be created on save"}
                </p>
                <div className="flex gap-3">
                  <Link href="/opd" className="px-6 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-xs font-black uppercase hover:bg-gray-100 transition-all flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Link>
                  <button 
                    onClick={handleSaveConsultation} 
                    disabled={saving}
                    className="px-8 py-2.5 rounded-xl bg-medical-green text-white text-xs font-black uppercase shadow-lg shadow-medical-green/20 hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {existingRecord ? "Update Record" : "Save Record"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="w-full xl:w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-2xl border border-border-hms shadow-sm p-4 space-y-3">
              <button 
                onClick={() => setShowPrescriptionModal(true)}
                className="w-full bg-medical-blue text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-medical-blue/20 flex items-center justify-center gap-3 hover:bg-medical-blue/90 transition-all"
              >
                <FileText className="w-5 h-5" /> Write Prescription
              </button>
              <button 
                onClick={handleOpenLabOrder}
                className="w-full bg-teal-hms/10 text-teal-hms py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-teal-hms/20 flex items-center justify-center gap-3 hover:bg-teal-hms hover:text-white transition-all"
              >
                <FlaskConical className="w-5 h-5" /> Order Lab Test
              </button>
              <button 
                onClick={handleOpenRadiologyOrder}
                className="w-full bg-purple-hms/10 text-purple-hms py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-purple-hms/20 flex items-center justify-center gap-3 hover:bg-purple-hms hover:text-white transition-all"
              >
                <Activity className="w-5 h-5" /> Order Radiology
              </button>
              <button 
                onClick={handleOpenAdmitModal}
                className="w-full bg-emergency-red/10 text-emergency-red py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-emergency-red/20 flex items-center justify-center gap-3 hover:bg-emergency-red hover:text-white transition-all"
              >
                <Bed className="w-5 h-5" /> Admit to IPD
              </button>
              <button 
                onClick={handleCompleteAppointment}
                className="w-full bg-medical-green/10 text-medical-green py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-medical-green/20 flex items-center justify-center gap-3 hover:bg-medical-green hover:text-white transition-all"
              >
                <Check className="w-5 h-5" /> Complete Consultation
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-border-hms shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border-hms bg-gray-50 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Prescriptions</h3>
                <span className="text-[10px] font-bold text-gray-400">{prescriptions.length}</span>
              </div>
              <div className="p-4 space-y-4">
                {prescriptions.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No prescriptions yet</p>
                ) : (
                  prescriptions.map((p) => (
                    <div key={p._id} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-medical-blue/10 transition-colors">
                          <FileText className="w-4 h-4 text-gray-400 group-hover:text-medical-blue" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{new Date(p.prescriptionDate).toLocaleDateString()}</p>
                          <p className="text-[10px] text-gray-500">{p.prescriptionId}</p>
                        </div>
                      </div>
                      <Printer className="w-4 h-4 text-gray-300 group-hover:text-gray-600" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-hms shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border-hms bg-gray-50">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Appointment Info</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Token</span>
                  <span className="text-sm font-black text-medical-blue">#{appointment.tokenNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Date</span>
                  <span className="text-xs font-bold text-gray-700">{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Time</span>
                  <span className="text-xs font-bold text-gray-700">{appointment.timeSlot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Doctor</span>
                  <span className="text-xs font-bold text-gray-700">{appointment.doctor?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">Write Prescription</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">For {patient.name}</p>
              </div>
              <button onClick={() => setShowPrescriptionModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Diagnosis</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all" placeholder="Diagnosis from consultation" value={prescriptionDiagnosis} onChange={e => setPrescriptionDiagnosis(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">General Advice</label>
                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all h-20 resize-none" placeholder="Advice for the patient" value={prescriptionAdvice} onChange={e => setPrescriptionAdvice(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Follow-up Date</label>
                <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-medical-blue/10 focus:border-medical-blue outline-none transition-all" value={prescriptionFollowUp} onChange={e => setPrescriptionFollowUp(e.target.value)} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPrescriptionModal(false)} className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">Cancel</button>
              <button 
                onClick={handleSavePrescription} 
                disabled={savingPrescription}
                className="flex-1 py-3 px-4 bg-medical-blue text-white rounded-xl font-bold text-sm shadow-lg shadow-medical-blue/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingPrescription ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lab Order Modal */}
      {showLabOrderModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">Order Lab Tests</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">For {patient.name}</p>
              </div>
              <button onClick={() => setShowLabOrderModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Priority</label>
                <div className="flex gap-2">
                  {["routine", "urgent", "stat"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setLabOrderPriority(p)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                        labOrderPriority === p
                          ? p === "urgent" ? "bg-red-50 text-red-600 border-red-200"
                            : p === "stat" ? "bg-orange-50 text-orange-600 border-orange-200"
                            : "bg-teal-hms/10 text-teal-hms border-teal-hms/20"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Tests */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Search Tests</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={labTestSearch}
                    onChange={(e) => {
                      setLabTestSearch(e.target.value);
                      fetchLabTests(e.target.value);
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-teal-hms/10 focus:border-teal-hms outline-none transition-all"
                    placeholder="Search by test name or code..."
                  />
                </div>
              </div>

              {/* Available Tests */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Available Tests</label>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
                  {loadingLabTests ? (
                    <div className="p-4 text-center"><Loader2 className="w-5 h-5 text-teal-hms animate-spin mx-auto" /></div>
                  ) : labTestsCatalog.length === 0 ? (
                    <p className="p-4 text-xs text-gray-400 text-center">No tests found</p>
                  ) : (
                    labTestsCatalog.map((test) => (
                      <button
                        key={test.testCode}
                        onClick={() => handleAddLabTest(test)}
                        disabled={selectedLabTests.some((t) => t.testCode === test.testCode)}
                        className={cn(
                          "w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left disabled:opacity-40",
                          selectedLabTests.some((t) => t.testCode === test.testCode) && "bg-teal-hms/5"
                        )}
                      >
                        <div>
                          <p className="text-xs font-bold text-gray-900">{test.testName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{test.testCode} • {test.category || "General"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-teal-hms">৳{test.price}</span>
                          {selectedLabTests.some((t) => t.testCode === test.testCode) ? (
                            <Check className="w-4 h-4 text-teal-hms" />
                          ) : (
                            <Plus className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Selected Tests */}
              {selectedLabTests.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Selected Tests ({selectedLabTests.length})</label>
                  <div className="space-y-2">
                    {selectedLabTests.map((test) => (
                      <div key={test.testCode} className="flex items-center justify-between bg-teal-hms/5 border border-teal-hms/10 rounded-xl px-4 py-2.5">
                        <div>
                          <p className="text-xs font-bold text-gray-900">{test.testName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{test.testCode}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-teal-hms">৳{test.price}</span>
                          <button onClick={() => handleRemoveLabTest(test.testCode)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
                      <span className="text-sm font-black text-teal-hms">৳{selectedLabTests.reduce((sum, t) => sum + (t.price || 0), 0)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Notes (Optional)</label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-teal-hms/10 focus:border-teal-hms outline-none transition-all h-20 resize-none"
                  placeholder="Special instructions for lab..."
                  value={labOrderNotes}
                  onChange={(e) => setLabOrderNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowLabOrderModal(false)} className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">Cancel</button>
              <button
                onClick={handleSaveLabOrder}
                disabled={savingLabOrder || selectedLabTests.length === 0}
                className="flex-1 py-3 px-4 bg-teal-hms text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-hms/20 hover:bg-teal-hms/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingLabOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
                Place Order ({selectedLabTests.length} tests)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Radiology Order Modal */}
      {showRadiologyOrderModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">Order Radiology Study</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">For {patient.name}</p>
              </div>
              <button onClick={() => setShowRadiologyOrderModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Priority</label>
                <div className="flex gap-2">
                  {["routine", "urgent", "stat"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setRadiologyPriority(p)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                        radiologyPriority === p
                          ? p === "urgent" ? "bg-red-50 text-red-600 border-red-200"
                            : p === "stat" ? "bg-orange-50 text-orange-600 border-orange-200"
                            : "bg-purple-hms/10 text-purple-hms border-purple-hms/20"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical History */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Clinical History</label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-purple-hms/10 focus:border-purple-hms outline-none transition-all h-16 resize-none"
                  placeholder="Relevant clinical history..."
                  value={radiologyClinicalHistory}
                  onChange={(e) => setRadiologyClinicalHistory(e.target.value)}
                />
              </div>

              {/* Reason for Exam */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Reason for Exam</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-purple-hms/10 focus:border-purple-hms outline-none transition-all"
                  placeholder="Clinical indication..."
                  value={radiologyReason}
                  onChange={(e) => setRadiologyReason(e.target.value)}
                />
              </div>

              {/* Studies */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Studies</label>
                  <button onClick={handleAddRadiologyStudy} className="text-[10px] font-black text-purple-hms uppercase tracking-widest hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Study
                  </button>
                </div>
                <div className="space-y-3">
                  {radiologyStudies.map((study, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Study {index + 1}</span>
                        {radiologyStudies.length > 1 && (
                          <button onClick={() => handleRemoveRadiologyStudy(index)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-hms/10 focus:border-purple-hms outline-none"
                          placeholder="Study name (e.g. Chest X-Ray)"
                          value={study.testName}
                          onChange={(e) => handleUpdateRadiologyStudy(index, "testName", e.target.value)}
                        />
                        <select
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-hms/10 focus:border-purple-hms outline-none"
                          value={study.modality}
                          onChange={(e) => handleUpdateRadiologyStudy(index, "modality", e.target.value)}
                        >
                          <option value="xray">X-Ray</option>
                          <option value="ultrasound">Ultrasound</option>
                          <option value="ct">CT Scan</option>
                          <option value="mri">MRI</option>
                          <option value="mammography">Mammography</option>
                          <option value="fluoroscopy">Fluoroscopy</option>
                          <option value="dexa">DEXA</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-hms/10 focus:border-purple-hms outline-none"
                          placeholder="Body part / region"
                          value={study.bodyPart}
                          onChange={(e) => handleUpdateRadiologyStudy(index, "bodyPart", e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-hms/10 focus:border-purple-hms outline-none"
                          placeholder="Special instructions"
                          value={study.instructions}
                          onChange={(e) => handleUpdateRadiologyStudy(index, "instructions", e.target.value)}
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={study.contrast}
                          onChange={(e) => handleUpdateRadiologyStudy(index, "contrast", e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-hms focus:ring-purple-hms"
                        />
                        <span className="text-xs font-bold text-gray-600">Contrast Required</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Additional Notes</label>
                <textarea
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-purple-hms/10 focus:border-purple-hms outline-none transition-all h-16 resize-none"
                  placeholder="Any additional notes..."
                  value={radiologyNotes}
                  onChange={(e) => setRadiologyNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowRadiologyOrderModal(false)} className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">Cancel</button>
              <button
                onClick={handleSaveRadiologyOrder}
                disabled={savingRadiology}
                className="flex-1 py-3 px-4 bg-purple-hms text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-hms/20 hover:bg-purple-hms/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingRadiology ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                Place Order ({radiologyStudies.filter((s) => s.testName.trim()).length} studies)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IPD Admission Modal */}
      {showAdmitModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900">Admit to IPD</h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">For {patient.name}</p>
              </div>
              <button onClick={() => setShowAdmitModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Admission Type */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Admission Type</label>
                <div className="flex gap-2">
                  {["emergency", "planned", "transfer"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setAdmissionType(t)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all",
                        admissionType === t
                          ? t === "emergency" ? "bg-red-50 text-red-600 border-red-200"
                            : t === "transfer" ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-emergency-red/10 text-emergency-red border-emergency-red/20"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Admission Diagnosis</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-emergency-red/10 focus:border-emergency-red outline-none transition-all"
                  placeholder="Diagnosis for admission..."
                  value={admissionDiagnosis}
                  onChange={(e) => setAdmissionDiagnosis(e.target.value)}
                />
              </div>

              {/* Ward Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Filter by Ward</label>
                <div className="flex gap-2 flex-wrap">
                  {["", "general", "cabin", "icu", "ccu", "vip"].map((w) => (
                    <button
                      key={w}
                      onClick={() => {
                        setAdmissionWard(w);
                        if (token) {
                          setLoadingBeds(true);
                          const url = w ? `/api/beds?availableOnly=true&ward=${w}` : "/api/beds?availableOnly=true";
                          fetch(url, { headers: { Authorization: `Bearer ${token}` } })
                            .then((r) => r.json())
                            .then((d) => { if (d.success) setAvailableBeds(d.data || []); })
                            .catch(() => {})
                            .finally(() => setLoadingBeds(false));
                        }
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
                        admissionWard === w
                          ? "bg-emergency-red/10 text-emergency-red border-emergency-red/20"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      {w || "All"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Beds */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Available Beds ({availableBeds.length})
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100">
                  {loadingBeds ? (
                    <div className="p-4 text-center"><Loader2 className="w-5 h-5 text-emergency-red animate-spin mx-auto" /></div>
                  ) : availableBeds.length === 0 ? (
                    <p className="p-4 text-xs text-gray-400 text-center">No available beds found</p>
                  ) : (
                    availableBeds.map((bed) => (
                      <button
                        key={bed._id}
                        onClick={() => setSelectedBed(bed._id)}
                        className={cn(
                          "w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left",
                          selectedBed === bed._id && "bg-emergency-red/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black",
                            selectedBed === bed._id ? "bg-emergency-red text-white" : "bg-gray-100 text-gray-500"
                          )}>
                            <Bed className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{bed.bedNumber}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{bed.ward} • {bed.bedType || "Standard"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {bed.dailyRate && <p className="text-xs font-black text-gray-700">৳{bed.dailyRate}/day</p>}
                          {selectedBed === bed._id && <Check className="w-4 h-4 text-emergency-red ml-auto" />}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdmitModal(false)} className="flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">Cancel</button>
              <button
                onClick={handleSaveAdmission}
                disabled={savingAdmission || !selectedBed}
                className="flex-1 py-3 px-4 bg-emergency-red text-white rounded-xl font-bold text-sm shadow-lg shadow-emergency-red/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingAdmission ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bed className="w-4 h-4" />}
                Confirm Admission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
