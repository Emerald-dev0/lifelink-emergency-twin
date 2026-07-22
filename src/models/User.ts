import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  passwordHash: string;
  twinId?: string;
  twinStatus: 'pending' | 'connected' | 'disconnected' | 'error';
  emergencyId?: string;
  role: 'patient' | 'responder' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    passwordHash: { type: String, required: true },
    twinId: { type: String },
    twinStatus: { type: String, enum: ['pending', 'connected', 'disconnected', 'error'], default: 'pending' },
    emergencyId: { type: String },
    role: { type: String, enum: ['patient', 'responder', 'admin'], default: 'patient' },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ twinId: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
