import { Schema, model, models } from 'mongoose';
import { LAB_STATUS, LAB_PRIORITY } from '@/lib/enums';

const LabOrderSchema = new Schema({
  orderId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  orderedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  prescription: { type: Schema.Types.ObjectId, ref: 'Prescription' },
  admission: { type: Schema.Types.ObjectId, ref: 'IPDAdmission' },
  orderDate: { type: Date, required: true, default: Date.now },
  priority: { type: String, enum: LAB_PRIORITY, default: 'routine' },

  tests: [{
    testId: { type: Schema.Types.ObjectId, ref: 'LabTest' },
    testName: String,
    testCode: String,
    price: Number,
    status: { type: String, enum: LAB_STATUS, default: 'pending' },
    sampleType: String,
    sampleCollectedAt: Date,
    collectedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],

  results: [{
    testId: { type: Schema.Types.ObjectId, ref: 'LabTest' },
    parameters: [{
      name: String,
      value: String,
      unit: String,
      normalRange: String,
      flag: { type: String, enum: ['normal', 'high', 'low', 'critical'] }
    }],
    interpretation: String,
    resultDate: Date,
    enteredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],

  overallStatus: { type: String, enum: LAB_STATUS, default: 'pending' },
  reportUrl: { type: String },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  notes: { type: String },
  totalAmount: { type: Number }
}, { timestamps: true });

export default models.LabOrder || model('LabOrder', LabOrderSchema);
