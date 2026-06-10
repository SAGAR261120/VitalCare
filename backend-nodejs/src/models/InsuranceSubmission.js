const mongoose = require('mongoose');

const insuranceSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['requirement', 'upload'], required: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'rejected'],
      default: 'pending',
    },
    insuranceCompany: { type: String },
    mobileNumber: { type: String },
    numberOfPeople: { type: Number },
    policyTenure: { type: String },
    preferredAmount: { type: Number },
    policyName: { type: String },
    documentUrl: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

insuranceSubmissionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('InsuranceSubmission', insuranceSubmissionSchema);
