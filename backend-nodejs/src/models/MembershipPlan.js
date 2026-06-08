const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tier: { type: String, enum: ['NATIONAL', 'GLOBAL'], default: 'NATIONAL' },
    validity: { type: String, default: '1 Year' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    badge: { type: String },
    features: [{ label: String, included: { type: Boolean, default: true } }],
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
