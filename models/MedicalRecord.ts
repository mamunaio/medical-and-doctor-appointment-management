import { Schema, model, models } from 'mongoose';
import { VISIT_TYPE } from '@/lib/enums';

const MedicalRecordSchema = new Schema({
  recordId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department' },
  visitType: { type: String, enum: VISIT_TYPE },
  visitDate: { type: Date, required: true },

  vitals: {
    bloodPressure: { systolic: Number, diastolic: Number },
    pulse: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    bmi: Number,
    oxygenSat: Number,
    respiratoryRate: Number,
    recordedAt: Date,
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },

  chiefComplaint: { type: String },
  historyOfPresentIllness: { type: String },
  physicalExamination: { type: String },
  systemicExamination: { type: String },

  primaryDiagnosis: {
    icdCode: String,
    description: String
  },
  secondaryDiagnoses: [{
    icdCode: String,
    description: String
  }],

  treatmentPlan: { type: String },
  advice: [String],
  dietAdvice: { type: String },
  followUpDate: { type: Date },
  followUpNotes: { type: String },

  referral: {
    isReferred: { type: Boolean, default: false },
    referredTo: { type: Schema.Types.ObjectId, ref: 'User' },
    referredDept: { type: Schema.Types.ObjectId, ref: 'Department' },
    reason: String
  },

  admittedToIPD: { type: Boolean, default: false },
  ipdAdmission: { type: Schema.Types.ObjectId, ref: 'IPDAdmission' }
}, { timestamps: true });

export default models.MedicalRecord || model('MedicalRecord', MedicalRecordSchema);
