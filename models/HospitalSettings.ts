import { Schema, model, models } from 'mongoose';

const HospitalSettingsSchema = new Schema({
  hospitalName: { type: String, required: true },
  address: { type: String },
  phone: [String],
  email: { type: String },
  website: { type: String },
  logo: { type: String },
  
  billing: {
    taxRate: { type: Number, default: 0 },
    currency: { type: String, default: 'BDT' },
    invoicePrefix: { type: String, default: 'INV' }
  },

  appointment: {
    defaultSlotDuration: { type: Number, default: 20 },
    advanceBookingDays: { type: Number, default: 30 },
    reminderHours: { type: Number, default: 24 },
    autoConfirm: { type: Boolean, default: true }
  },

  sms: {
    isEnabled: { type: Boolean, default: false },
    provider: String,
    apiKey: String,
    senderId: String
  },

  workingHours: {
    weekdays: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    holidays: [Date]
  }
}, { timestamps: true });

export default models.HospitalSettings || model('HospitalSettings', HospitalSettingsSchema);
