const mongoose = require('mongoose');

const contentPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ContentPage', contentPageSchema);
