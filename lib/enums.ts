export const ROLES = ['super_admin', 'admin', 'doctor', 'nurse', 'receptionist', 'patient'] as const;
export type Role = typeof ROLES[number];

export const GENDER = ['male', 'female', 'other'] as const;
export type Gender = typeof GENDER[number];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = typeof BLOOD_GROUPS[number];

export const APPOINTMENT_STATUS = ['booked', 'waiting', 'in_consultation', 'completed', 'cancelled', 'no_show'] as const;
export type AppointmentStatus = typeof APPOINTMENT_STATUS[number];

export const APPOINTMENT_TYPE = ['consultation', 'follow_up', 'procedure', 'emergency'] as const;
export type AppointmentType = typeof APPOINTMENT_TYPE[number];

export const VISIT_TYPE = ['opd', 'ipd', 'emergency'] as const;
export type VisitType = typeof VISIT_TYPE[number];

export const BED_STATUS = ['available', 'occupied', 'cleaning', 'reserved', 'maintenance'] as const;
export type BedStatus = typeof BED_STATUS[number];

export const WARD_TYPES = ['general', 'cabin', 'icu', 'ccu', 'emergency', 'nicu', 'vip'] as const;
export type WardType = typeof WARD_TYPES[number];

export const LAB_STATUS = ['pending', 'sample_collected', 'processing', 'ready', 'delivered'] as const;
export type LabStatus = typeof LAB_STATUS[number];

export const LAB_PRIORITY = ['routine', 'urgent', 'stat'] as const;
export type LabPriority = typeof LAB_PRIORITY[number];

export const INVOICE_STATUS = ['unpaid', 'partial', 'paid', 'cancelled', 'refunded'] as const;
export type InvoiceStatus = typeof INVOICE_STATUS[number];

export const PAYMENT_METHODS = ['cash', 'card', 'bkash', 'nagad', 'insurance'] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

export const TRIAGE_LEVELS = ['critical', 'urgent', 'semi_urgent', 'non_urgent'] as const;
export type TriageLevel = typeof TRIAGE_LEVELS[number];

export const MEDICINE_CATEGORIES = ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler', 'other'] as const;
export type MedicineCategory = typeof MEDICINE_CATEGORIES[number];

export const CLAIM_STATUS = ['draft', 'submitted', 'processing', 'approved', 'rejected', 'paid'] as const;
export type ClaimStatus = typeof CLAIM_STATUS[number];
