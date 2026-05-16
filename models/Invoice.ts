import { Schema, model, models } from 'mongoose';
import { INVOICE_STATUS, PAYMENT_METHODS } from '@/lib/enums';

const InvoiceSchema = new Schema({
  invoiceId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  admission: { type: Schema.Types.ObjectId, ref: 'IPDAdmission' },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  invoiceDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date },

  items: [{
    serviceType: { type: String, enum: ['consultation', 'lab', 'medicine', 'room', 'procedure', 'nursing', 'radiology', 'other'] },
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    referenceId: String
  }],

  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  discountNote: { type: String },
  taxAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },

  status: { type: String, enum: INVOICE_STATUS, default: 'unpaid' },
  payments: [{
    amount: { type: Number, required: true },
    method: { type: String, enum: PAYMENT_METHODS },
    transactionId: String,
    receivedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    receivedAt: { type: Date, default: Date.now },
    notes: String
  }],
  totalPaid: { type: Number, default: 0 },
  balanceDue: { type: Number },

  insurance: {
    claimId: { type: Schema.Types.ObjectId, ref: 'InsuranceClaim' },
    coveredAmount: { type: Number, default: 0 }
  },

  generatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
}, { timestamps: true });

export default models.Invoice || model('Invoice', InvoiceSchema);
