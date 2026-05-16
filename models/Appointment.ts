import { Schema, model, models } from 'mongoose';
import { APPOINTMENT_STATUS, APPOINTMENT_TYPE, VISIT_TYPE } from '@/lib/enums';

const AppointmentSchema = new Schema({
  appointmentId: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department' },

  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  tokenNumber: { type: Number },
  queuePosition: { type: Number },

  type: { type: String, enum: APPOINTMENT_TYPE, default: 'consultation' },
  status: { type: String, enum: APPOINTMENT_STATUS, default: 'booked' },
  visitType: { type: String, enum: VISIT_TYPE, default: 'opd' },

  chiefComplaint: { type: String },
  notes: { type: String },
  isOnline: { type: Boolean, default: false },
  bookedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  bookedAt: { type: Date, default: Date.now },

  checkInTime: { type: Date },
  consultStartTime: { type: Date },
  consultEndTime: { type: Date },
  waitingMinutes: { type: Number },

  isFollowUp: { type: Boolean, default: false },
  previousAppointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },

  cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
  cancelReason: { type: String },
  cancelledAt: { type: Date },

  smsReminderSent: { type: Boolean, default: false },
  emailReminderSent: { type: Boolean, default: false }
}, { timestamps: true });

export default models.Appointment || model('Appointment', AppointmentSchema);
