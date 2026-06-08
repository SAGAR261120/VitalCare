const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String },
    pinCode: { type: String },
    type: { type: String, enum: ['city', 'area', 'road'], default: 'city' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

citySchema.index({ name: 'text', state: 'text', district: 'text' });

module.exports = mongoose.model('City', citySchema);
