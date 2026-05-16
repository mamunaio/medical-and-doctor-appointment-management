import { Schema, model, models } from 'mongoose';
import { WARD_TYPES } from '@/lib/enums';

const IPDAdmissionSchema = new Schema({
  admissionId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  admittingDoctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department' },
  ward: { type: String, enum: WARD_TYPES },
  bed: { type: Schema.Types.ObjectId, ref: 'Bed', required: true },

  admissionDate: { type: Date, required: true },
  admissionType: { type: String, enum: ['emergency', 'planned', 'transfer'] },
  admissionDiagnosis: { type: String },
  admittedBy: { type: Schema.Types.ObjectId, ref: 'User' },

  dischargeDate: { type: Date },
  dischargeDiagnosis: { type: String },
  dischargeCondition: { type: String, enum: ['recovered', 'improved', 'referred', 'absconded', 'death'] },
  dischargeInstructions: { type: String },
  followUpAdvice: { type: String },
  medicinesToContinue: [String],
  isDischargedBy: { type: Schema.Types.ObjectId, ref: 'User' },

  attendingDoctors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  primaryNurse: { type: Schema.Types.ObjectId, ref: 'User' },

  status: { type: String, enum: ['admitted', 'discharged', 'transferred', 'deceased'], default: 'admitted' },

  totalDays: { type: Number },
  totalBilled: { type: Number },

  progressNotes: [{
    date: { type: Date, default: Date.now },
    note: String,
    doctor: { type: Schema.Types.ObjectId, ref: 'User' },
    vitals: Object
  }]
}, { timestamps: true });

export default models.IPDAdmission || model('IPDAdmission', IPDAdmissionSchema);
