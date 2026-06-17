import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const patientSchema = z.object({
  name: z.string().min(2),
  nativeName: z.string().optional(),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']),
  bloodGroup: z.string().optional(),
  nidNumber: z.string().optional(),
  maritalStatus: z.string().optional(),
  address: z.object({
    division: z.string().optional(),
    district: z.string().optional(),
    thana: z.string().optional(),
    village: z.string().optional(),
  }).optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    relation: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  medicalHistory: z.object({
    allergies: z.string().optional(),
    chronicDiseases: z.string().optional(),
    pastSurgeries: z.string().optional(),
    currentMedications: z.string().optional(),
  }).optional(),
  insurance: z.object({
    providerName: z.string().optional(),
    policyNumber: z.string().optional(),
    validity: z.string().optional().or(z.literal('')),
  }).optional(),
});

export const appointmentSchema = z.object({
  patient: z.string(),
  doctor: z.string(),
  department: z.string().optional(),
  date: z.string(),
  timeSlot: z.string(),
  type: z.string().optional(),
  visitType: z.string().optional(),
  chiefComplaint: z.string().optional(),
});

export const validateRequest = (schema: z.ZodSchema, data: any) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { data: result.data, error: null };
  } else {
    return { data: null, error: result.error.issues };
  }
};

export const medicalRecordSchema = z.object({
  patient: z.string().min(1, "Patient is required"),
  appointment: z.string().optional(),
  doctor: z.string().min(1, "Doctor is required"),
  department: z.string().optional(),
  visitType: z.enum(['opd', 'ipd', 'emergency']).optional(),
  visitDate: z.string().min(1, "Visit date is required"),

  vitals: z.object({
    bloodPressure: z.object({
      systolic: z.number().optional(),
      diastolic: z.number().optional(),
    }).optional(),
    pulse: z.number().optional(),
    temperature: z.number().optional(),
    weight: z.number().optional(),
    height: z.number().optional(),
    bmi: z.number().optional(),
    oxygenSat: z.number().optional(),
    respiratoryRate: z.number().optional(),
  }).optional(),

  chiefComplaint: z.string().optional(),
  historyOfPresentIllness: z.string().optional(),
  physicalExamination: z.string().optional(),
  systemicExamination: z.string().optional(),

  primaryDiagnosis: z.object({
    icdCode: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  secondaryDiagnoses: z.array(z.object({
    icdCode: z.string().optional(),
    description: z.string().optional(),
  })).optional(),

  treatmentPlan: z.string().optional(),
  advice: z.array(z.string()).optional(),
  dietAdvice: z.string().optional(),
  followUpDate: z.string().optional().or(z.literal('')),
  followUpNotes: z.string().optional(),

  referral: z.object({
    isReferred: z.boolean().optional(),
    referredTo: z.string().optional(),
    referredDept: z.string().optional(),
    reason: z.string().optional(),
  }).optional(),

  admittedToIPD: z.boolean().optional(),
  ipdAdmission: z.string().optional(),
});

export const prescriptionSchema = z.object({
  patient: z.string().min(1, "Patient is required"),
  doctor: z.string().min(1, "Doctor is required"),
  medicalRecord: z.string().optional(),
  appointment: z.string().optional(),
  prescriptionDate: z.string().min(1, "Prescription date is required"),
  diagnosis: z.string().optional(),

  medicines: z.array(z.object({
    medicineName: z.string().min(1, "Medicine name is required"),
    genericName: z.string().optional(),
    medicineId: z.string().optional(),
    dose: z.string().optional(),
    frequency: z.string().optional(),
    duration: z.string().optional(),
    timing: z.enum(['before_meal', 'after_meal', 'with_meal', 'bedtime']).optional(),
    route: z.enum(['oral', 'topical', 'injection', 'inhalation']).optional(),
    instructions: z.string().optional(),
    quantity: z.number().optional(),
  })).optional(),

  labTests: z.array(z.string()).optional(),
  radiologyOrders: z.array(z.object({
    testName: z.string(),
    instructions: z.string().optional(),
  })).optional(),

  generalAdvice: z.array(z.string()).optional(),
  dietAdvice: z.string().optional(),
  activityAdvice: z.string().optional(),
  customAdvice: z.string().optional(),

  followUpDate: z.string().optional().or(z.literal('')),
  followUpBring: z.array(z.string()).optional(),
});
