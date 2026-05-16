import { Schema, model, models } from 'mongoose';
import { GENDER, TRIAGE_LEVELS } from '@/lib/enums';

const EmergencyCaseSchema = new Schema({
  caseId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  
  unknownPatient: { type: Boolean, default: false },
  patientName: { type: String },
  estimatedAge: { type: Number },
  gender: { type: String, enum: GENDER },

  arrivalTime: { type: Date, required: true, default: Date.now },
  arrivalMode: { type: String, enum: ['self', 'ambulance', 'police', 'referred'] },
  broughtBy: { type: String },

  chiefComplaint: { type: String, required: true },
  triageLevel: { type: String, enum: TRIAGE_LEVELS, required: true },
  triageNotes: { type: String },
  triageBy: { type: Schema.Types.ObjectId, ref: 'User' },
  triageTime: { type: Date },

  assignedDoctor: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedBed: { type: Schema.Types.ObjectId, ref: 'Bed' },
  assignedNurse: { type: Schema.Types.ObjectId, ref: 'User' },

  timeline: [{
    time: { type: Date, default: Date.now },
    event: String,
    by: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: String
  }],

  outcome: { type: String, enum: ['treated_discharged', 'admitted_ipd', 'referred', 'deceased', 'absconded'] },
  outcomeTime: { type: Date },
  admission: { type: Schema.Types.ObjectId, ref: 'IPDAdmission' },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default models.EmergencyCase || model('EmergencyCase', EmergencyCaseSchema);
