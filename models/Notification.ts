import { Schema, model, models } from 'mongoose';

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String },
  type: { 
    type: String, 
    enum: ['appointment', 'lab_result', 'prescription', 'billing', 'emergency', 'medicine_low', 'system'] 
  },
  priority: { type: String, enum: ['low', 'normal', 'high', 'critical'], default: 'normal' },
  isRead: { type: Boolean, default: false },
  link: { type: String },
  data: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

NotificationSchema.index({ userId: 1, isRead: 1 });

export default models.Notification || model('Notification', NotificationSchema);
