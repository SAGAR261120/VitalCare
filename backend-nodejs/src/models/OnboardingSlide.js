const mongoose = require('mongoose');

const onboardingSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    icon: { type: String, default: 'heart-outline' },
    gradient: [{ type: String }],
    image: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('OnboardingSlide', onboardingSlideSchema);
