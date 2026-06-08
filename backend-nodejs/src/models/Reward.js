const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    points: { type: Number, required: true },
    icon: { type: String, default: 'trophy-outline' },
    actionType: { type: String, enum: ['referral', 'booking', 'profile', 'daily', 'other'], default: 'other' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Reward', rewardSchema);
