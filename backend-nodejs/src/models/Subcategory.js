const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String },
    icon: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

subcategorySchema.index({ category: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Subcategory', subcategorySchema);
