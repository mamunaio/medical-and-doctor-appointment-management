import { Schema, model, models } from 'mongoose';
import { CLAIM_STATUS } from '@/lib/enums';

const InsuranceClaimSchema = new Schema({
  claimId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  
  insurance: {
    provider: { type: String, required: true },
    policyNumber: { type: String, required: true },
    memberName: String,
    expiryDate: Date
  },

  claimAmount: { type: Number, required: true },
  approvedAmount: { type: Number },
  rejectionReason: String,
  
  status: { type: String, enum: CLAIM_STATUS, default: 'draft' },
  submittedAt: { type: Date },
  processedAt: { type: Date },
  paidAt: { type: Date },

  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
}, { timestamps: true });

export default models.InsuranceClaim || model('InsuranceClaim', InsuranceClaimSchema);
