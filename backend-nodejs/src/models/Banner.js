const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String },
    gradient: [{ type: String }],
    linkType: { type: String, enum: ['none', 'screen', 'url', 'package'], default: 'none' },
    linkValue: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    placement: { type: String, enum: ['home', 'onboarding', 'promo', 'insurance', 'cycle'], default: 'home' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Banner', bannerSchema);
