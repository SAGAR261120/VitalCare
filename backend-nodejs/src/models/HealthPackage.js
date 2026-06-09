const mongoose = require('mongoose');

const healthPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number, default: 0 },
    image: { type: String },
    includedTests: [{ type: String, trim: true }],
    excludedTests: [{ type: String, trim: true }],
    benefits: [{ type: String, trim: true }],
    preparationInstructions: { type: String },
    recommendedFor: [{ type: String, trim: true }],
    packageDuration: { type: String },
    reportDeliveryTime: { type: String },
    testCount: { type: Number, default: 0 },
    badge: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const applyDerivedFields = doc => {
  if (doc.includedTests?.length) {
    doc.testCount = doc.includedTests.length;
  }
  if (doc.originalPrice && doc.price && doc.originalPrice > doc.price) {
    doc.discount = Math.round(((doc.originalPrice - doc.price) / doc.originalPrice) * 100);
  }
};

healthPackageSchema.pre('save', function computeDerivedFields() {
  applyDerivedFields(this);
});

healthPackageSchema.pre('findOneAndUpdate', function computeDerivedFieldsOnUpdate() {
  const update = this.getUpdate();
  const payload = update.$set || update;
  applyDerivedFields(payload);
  if (update.$set) update.$set = payload;
});

healthPackageSchema.index({ name: 'text', description: 'text', code: 'text' });
healthPackageSchema.index({ category: 1, isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('HealthPackage', healthPackageSchema);
