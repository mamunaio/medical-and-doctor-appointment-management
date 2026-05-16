import { Schema, model, models } from 'mongoose';
import { WARD_TYPES, BED_STATUS } from '@/lib/enums';

const BedSchema = new Schema({
  bedNumber: { type: String, required: true },
  ward: { type: String, enum: WARD_TYPES, required: true },
  floor: { type: String },
  department: { type: Schema.Types.ObjectId, ref: 'Department' },
  bedType: { type: String, enum: ['standard', 'icu', 'cabin', 'vip', 'pediatric'] },
  status: { type: String, enum: BED_STATUS, default: 'available' },
  
  currentPatient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  currentAdmission: { type: Schema.Types.ObjectId, ref: 'IPDAdmission' },
  
  features: {
    hasOxygen: { type: Boolean, default: false },
    hasMonitor: { type: Boolean, default: false },
    hasVentilator: { type: Boolean, default: false },
    acAvailable: { type: Boolean, default: false },
    attachedBath: { type: Boolean, default: false }
  },

  dailyRate: { type: Number },
  isActive: { type: Boolean, default: true },
  notes: { type: String }
}, { timestamps: true });

BedSchema.index({ bedNumber: 1, ward: 1 }, { unique: true });

export default models.Bed || model('Bed', BedSchema);
