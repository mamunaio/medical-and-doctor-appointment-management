import { Schema, model, models } from 'mongoose';
import { PAYMENT_METHODS } from '@/lib/enums';

const PharmacyDispenseSchema = new Schema({
  dispenseId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  prescription: { type: Schema.Types.ObjectId, ref: 'Prescription' },
  dispensedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  dispenseDate: { type: Date, required: true, default: Date.now },

  items: [{
    medicine: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    medicineName: String,
    batchNumber: String,
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],

  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: PAYMENT_METHODS },
  isPaid: { type: Boolean, default: false },
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
  notes: { type: String }
}, { timestamps: true });

export default models.PharmacyDispense || model('PharmacyDispense', PharmacyDispenseSchema);
