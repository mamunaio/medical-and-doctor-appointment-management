import { Schema, model, models } from 'mongoose';

const PrescriptionSchema = new Schema({
  prescriptionId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicalRecord: { type: Schema.Types.ObjectId, ref: 'MedicalRecord' },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  prescriptionDate: { type: Date, required: true },

  diagnosis: { type: String },

  medicines: [{
    medicineName: { type: String, required: true },
    genericName: String,
    medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine' },
    dose: String,
    frequency: String,
    duration: String,
    timing: { type: String, enum: ['before_meal', 'after_meal', 'with_meal', 'bedtime'] },
    route: { type: String, enum: ['oral', 'topical', 'injection', 'inhalation'] },
    instructions: String,
    quantity: Number
  }],

  labTests: [{ type: Schema.Types.ObjectId, ref: 'LabOrder' }],
  radiologyOrders: [{
    testName: String,
    instructions: String
  }],

  generalAdvice: [String],
  dietAdvice: String,
  activityAdvice: String,
  customAdvice: String,

  followUpDate: Date,
  followUpBring: [String],

  isDispensed: { type: Boolean, default: false },
  dispensedAt: Date,
  dispensedBy: { type: Schema.Types.ObjectId, ref: 'User' },

  interactions: [String]
}, { timestamps: true });

export default models.Prescription || model('Prescription', PrescriptionSchema);
