import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyIdentity extends Document {
  userId: mongoose.Types.ObjectId;
  identifier: string;
  bloodType?: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContacts: Array<{ name: string; relationship: string; phone: string; email?: string }>;
  permissions: string[];
  isActive: boolean;
  lastSynced?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyIdentitySchema = new Schema<IEmergencyIdentity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    identifier: { type: String, required: true, unique: true },
    bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    allergies: [{ type: String }],
    medications: [{ type: String }],
    conditions: [{ type: String }],
    emergencyContacts: [{
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    }],
    permissions: [{ type: String }],
    isActive: { type: Boolean, default: true },
    lastSynced: { type: Date },
  },
  { timestamps: true }
);

EmergencyIdentitySchema.index({ userId: 1 });
EmergencyIdentitySchema.index({ identifier: 1 });

export default mongoose.models.EmergencyIdentity || mongoose.model<IEmergencyIdentity>('EmergencyIdentity', EmergencyIdentitySchema);
