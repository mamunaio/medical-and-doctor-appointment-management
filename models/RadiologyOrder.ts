import { Schema, model, models } from 'mongoose';

const RadiologyOrderSchema = new Schema({
  orderId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  orderedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicalRecord: { type: Schema.Types.ObjectId, ref: 'MedicalRecord' },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  orderDate: { type: Date, required: true, default: Date.now },
  priority: { type: String, enum: ['routine', 'urgent', 'stat'], default: 'routine' },

  studies: [{
    testName: { type: String, required: true },
    modality: { type: String, enum: ['xray', 'ultrasound', 'ct', 'mri', 'mammography', 'fluoroscopy', 'dexa', 'other'] },
    bodyPart: String,
    instructions: String,
    contrast: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
    scheduledDate: Date,
    completedDate: Date,
  }],

  clinicalHistory: String,
  reasonForExam: String,
  overallStatus: { type: String, enum: ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  reportUrl: String,
  notes: String,
  totalAmount: Number,
}, { timestamps: true });

export default models.RadiologyOrder || model('RadiologyOrder', RadiologyOrderSchema);
