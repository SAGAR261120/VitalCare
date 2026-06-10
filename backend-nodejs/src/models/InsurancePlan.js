const mongoose = require('mongoose');

const insurancePlanSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    coverage: { type: Number, required: true },
    premium: { type: Number, required: true },
    tenure: { type: String, default: '1 Year' },
    image: { type: String },
    pdfUrl: { type: String },
    cashlessHospitals: { type: String },
    sumInsured: { type: Number },
    subLimits: { type: String },
    noClaimBonus: { type: String },
    waitingPeriod: { type: String },
    claimSettlementRatio: { type: String },
    coPayment: { type: String },
    recommended: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('InsurancePlan', insurancePlanSchema);
