import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyGrant extends Document {
  emergencyId: mongoose.Types.ObjectId;
  responderId?: string;
  grantCode: string;
  status: 'active' | 'expired' | 'revoked';
  permissions: string[];
  accessedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyGrantSchema = new Schema<IEmergencyGrant>(
  {
    emergencyId: { type: Schema.Types.ObjectId, ref: 'EmergencyIdentity', required: true, index: true },
    responderId: { type: String, index: true },
    grantCode: { type: String, required: true, unique: true, match: /^GC-[A-Z0-9-]+$/ },
    status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active', index: true },
    permissions: [{ type: String }],
    accessedAt: { type: Date },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

EmergencyGrantSchema.index({ grantCode: 1 });
EmergencyGrantSchema.index({ emergencyId: 1, status: 1 });

export default mongoose.models.EmergencyGrant || mongoose.model<IEmergencyGrant>('EmergencyGrant', EmergencyGrantSchema);
