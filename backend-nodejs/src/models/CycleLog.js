const mongoose = require('mongoose');

const cycleLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['period', 'ovulation', 'fertile', 'pregnancy'], default: 'period' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    flow: { type: String, enum: ['light', 'medium', 'heavy'] },
    symptoms: [{ type: String }],
    regularity: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

cycleLogSchema.index({ user: 1, startDate: -1 });

module.exports = mongoose.model('CycleLog', cycleLogSchema);
