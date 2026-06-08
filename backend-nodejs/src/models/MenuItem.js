const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    icon: { type: String, default: 'ellipse-outline' },
    route: { type: String, required: true },
    section: { type: String, default: 'services' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    requiresAuth: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
