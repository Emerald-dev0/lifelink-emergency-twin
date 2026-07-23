import mongoose, { Schema, Document } from 'mongoose';

export interface IAccessLog extends Document {
  grantId?: mongoose.Types.ObjectId;
  emergencyId?: mongoose.Types.ObjectId;
  responderId?: string;
  action: 'viewed' | 'consented' | 'expired' | 'revoked' | 'emergency_view' | 'search';
  fieldsAccessed: string[];
  timestamp: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AccessLogSchema = new Schema<IAccessLog>(
  {
    grantId: { type: Schema.Types.ObjectId, ref: 'EmergencyGrant', index: true },
    emergencyId: { type: Schema.Types.ObjectId, ref: 'EmergencyIdentity', index: true },
    responderId: { type: String, index: true },
    action: { type: String, enum: ['viewed', 'consented', 'expired', 'revoked', 'emergency_view', 'search'], required: true },
    fieldsAccessed: [{ type: String }],
    timestamp: { type: Date, default: Date.now, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

AccessLogSchema.index({ grantId: 1 });
AccessLogSchema.index({ responderId: 1 });
AccessLogSchema.index({ timestamp: -1 });

export default mongoose.models.AccessLog || mongoose.model<IAccessLog>('AccessLog', AccessLogSchema);
