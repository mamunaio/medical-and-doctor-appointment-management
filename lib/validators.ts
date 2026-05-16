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
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  bloodGroup: z.string().optional(),
  nidNumber: z.string().optional(),
  address: z.object({
    division: z.string().optional(),
    district: z.string().optional(),
    thana: z.string().optional(),
    village: z.string().optional(),
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
  try {
    return { data: schema.parse(data), error: null };
  } catch (error: any) {
    return { data: null, error: error.errors };
  }
};
