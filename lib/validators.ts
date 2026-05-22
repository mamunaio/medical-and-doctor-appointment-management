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
  patientId: z.string(),
  doctorId: z.string(),
  date: z.string(),
  timeSlot: z.string(),
  type: z.string().optional(),
  chiefComplaint: z.string().optional(),
});

export const validateRequest = (schema: z.ZodSchema, data: any) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { data: result.data, error: null };
  } else {
    return { data: null, error: result.error.errors };
  }
};
