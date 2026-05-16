import { Schema, model, models } from 'mongoose';
import { GENDER, BLOOD_GROUPS } from '@/lib/enums';

const PatientSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', sparse: true },
  patientId: { type: String, unique: true, required: true },

  name: { type: String, required: true },
  nativeName: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  dateOfBirth: { type: Date },
  age: { type: Number },
  gender: { type: String, enum: GENDER, required: true },
  bloodGroup: { type: String, enum: BLOOD_GROUPS },
  photo: { type: String },
  nidNumber: { type: String },

  address: {
    division: String,
    district: String,
    thana: String,
    village: String
  },

  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },

  allergies: [String],
  chronicDiseases: [String],
  previousSurgeries: [{
    procedure: String,
    date: Date,
    hospital: String,
    notes: String
  }],
  currentMedications: [{
    medicineName: String,
    dose: String,
    frequency: String,
    startDate: Date
  }],
  familyHistory: [String],
  smoking: { type: Boolean, default: false },
  alcohol: { type: Boolean, default: false },

  insurance: {
    hasInsurance: { type: Boolean, default: false },
    provider: String,
    policyNumber: String,
    expiryDate: Date,
    coverageAmount: Number
  },

  stats: {
    totalVisits: { type: Number, default: 0 },
    totalBilled: { type: Number, default: 0 },
    lastVisitDate: Date,
    registeredBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default models.Patient || model('Patient', PatientSchema);
