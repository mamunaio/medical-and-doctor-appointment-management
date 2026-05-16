import { Schema, model, models } from 'mongoose';
import { MEDICINE_CATEGORIES } from '@/lib/enums';

const MedicineSchema = new Schema({
  name: { type: String, required: true },
  genericName: { type: String, required: true },
  brandName: { type: String },
  category: { type: String, enum: MEDICINE_CATEGORIES },
  strength: { type: String },
  form: { type: String },
  manufacturer: { type: String },

  stock: { type: Number, default: 0 },
  unit: { type: String },
  reorderLevel: { type: Number, default: 50 },
  purchasePrice: { type: Number },
  sellingPrice: { type: Number },
  
  batches: [{
    batchNumber: String,
    expiryDate: Date,
    quantity: Number,
    purchaseDate: Date,
    purchasePrice: Number,
    supplier: String
  }],

  drugClass: { type: String },
  contraindications: [String],
  sideEffects: [String],
  interactions: [String],
  storageConditions: { type: String },

  requiresPrescription: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

MedicineSchema.index({ name: 'text', genericName: 'text' });

export default models.Medicine || model('Medicine', MedicineSchema);
