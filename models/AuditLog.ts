import { Schema, model, models } from 'mongoose';

const AuditLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  module: { type: String },
  recordId: { type: String },
  oldData: { type: Schema.Types.Mixed },
  newData: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

AuditLogSchema.index({ userId: 1, module: 1, createdAt: -1 });

export default models.AuditLog || model('AuditLog', AuditLogSchema);
