import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthEvent extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  metadata?: Record<string, unknown>;
  timestamp: Date;
  createdAt: Date;
}

const HealthEventSchema = new Schema<IHealthEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, required: true },
  },
  { timestamps: true }
);

HealthEventSchema.index({ userId: 1, timestamp: -1 });
HealthEventSchema.index({ type: 1 });

export default mongoose.models.HealthEvent || mongoose.model<IHealthEvent>('HealthEvent', HealthEventSchema);
