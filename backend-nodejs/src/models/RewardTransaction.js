const mongoose = require('mongoose');

const rewardTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['earn', 'redeem', 'withdraw'], required: true },
    points: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

rewardTransactionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('RewardTransaction', rewardTransactionSchema);
