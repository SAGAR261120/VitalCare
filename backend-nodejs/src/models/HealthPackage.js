const mongoose = require('mongoose');

const healthPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    testCount: { type: Number, default: 0 },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    badge: { type: String },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('HealthPackage', healthPackageSchema);
