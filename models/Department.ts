import { Schema, model, models } from 'mongoose';

const DepartmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, unique: true, required: true },
  description: { type: String },
  headDoctor: { type: Schema.Types.ObjectId, ref: 'User' },
  floor: { type: String },
  roomNumbers: [String],
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  color: { type: String },
  icon: { type: String }
}, { timestamps: true });

export default models.Department || model('Department', DepartmentSchema);
