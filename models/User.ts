import mongoose, { Schema, model, models } from 'mongoose';
import { ROLES, GENDER, BLOOD_GROUPS } from '@/lib/enums';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  passwordHash: { type: String },
  avatarUrl: { type: String },
  role: { type: String, enum: ROLES, default: 'patient' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },

  dateOfBirth: { type: Date },
  gender: { type: String, enum: GENDER },
  bloodGroup: { type: String, enum: BLOOD_GROUPS },
  nidNumber: { type: String },
  religion: { type: String },
  maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'] },
  nationality: { type: String, default: 'Bangladeshi' },

  presentAddress: {
    division: String,
    district: String,
    thana: String,
    village: String,
    postCode: String
  },
  permanentAddress: {
    division: String,
    district: String,
    thana: String,
    village: String,
    postCode: String
  },

  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },

  doctorProfile: {
    bmdcNumber: { type: String, unique: true, sparse: true },
    specialization: [String],
    designation: String,
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    qualifications: [{ degree: String, institute: String, year: Number }],
    experience: { type: Number },
    consultationFee: { type: Number },
    schedule: [{
      day: { type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
      startTime: String,
      endTime: String,
      maxPatients: Number,
      isAvailable: { type: Boolean, default: true }
    }],
    slotDuration: { type: Number, default: 20 },
    rating: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    leaveDates: [Date]
  },

  staffProfile: {
    employeeId: String,
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    designation: String,
    joinDate: Date,
    shift: { type: String, enum: ['morning', 'evening', 'night'] }
  },

  resetPasswordToken: String,
  resetPasswordExpiry: Date,
  lastLogin: Date
}, { timestamps: true });

export default models.User || model('User', UserSchema);
