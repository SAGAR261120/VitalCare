const mongoose = require('mongoose');

const specialistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    experience: { type: String },
    image: { type: String },
    imageColor: { type: String, default: '#7C3AED' },
    hospital: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Specialist', specialistSchema);
