const mongoose = require('mongoose');

const cycleWellnessTipSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Daily Wellness Tip' },
    message: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('CycleWellnessTip', cycleWellnessTipSchema);
