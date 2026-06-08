const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ['push', 'broadcast', 'system'],
      default: 'push',
    },
    targetRole: {
      type: String,
      enum: ['all', 'user', 'admin', 'super_admin'],
      default: 'all',
    },
    targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Notification', notificationSchema);
