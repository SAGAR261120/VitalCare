const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: true },
);

activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
