const mongoose = require('mongoose');

const cycleProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, trim: true },
    height: { type: Number },
    heightUnit: { type: String, enum: ['cm', 'in'], default: 'cm' },
    weight: { type: Number },
    dateOfBirth: { type: Date },
    mode: { type: String, enum: ['period', 'pregnancy', 'both'], default: 'period' },
    activeTab: { type: String, enum: ['period', 'pregnancy'], default: 'period' },
    lastPeriodStart: { type: Date },
    cycleLength: { type: Number, default: 28, min: 21, max: 45 },
    periodLength: { type: Number, default: 5, min: 1, max: 14 },
    regularity: { type: String, enum: ['regular', 'irregular', 'not_sure'], default: 'regular' },
    flowType: { type: String, enum: ['light', 'medium', 'heavy'], default: 'medium' },
    symptoms: [{ type: String }],
    dueDate: { type: Date },
    pregnancyStartDate: { type: Date },
    setupComplete: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('CycleProfile', cycleProfileSchema);
