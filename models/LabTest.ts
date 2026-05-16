import { Schema, model, models } from 'mongoose';

const LabTestSchema = new Schema({
  testName: { type: String, required: true },
  testCode: { type: String, unique: true, required: true },
  category: { type: String },
  department: { type: String },
  sampleType: [String],
  price: { type: Number, required: true },
  tat: { type: Number },
  
  parameters: [{
    name: String,
    unit: String,
    normalRange: {
      male: String,
      female: String,
      child: String
    },
    criticalLow: Number,
    criticalHigh: Number
  }],

  preparation: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default models.LabTest || model('LabTest', LabTestSchema);
