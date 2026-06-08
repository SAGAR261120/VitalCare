const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['super_admin', 'admin', 'user'];
const PERMISSIONS = [
  'users.read',
  'users.write',
  'users.delete',
  'admins.read',
  'admins.write',
  'admins.delete',
  'notifications.send',
  'settings.manage',
  'dashboard.view',
];

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ROLES,
      default: 'user',
    },
    permissions: [{ type: String, enum: PERMISSIONS }],
    isActive: { type: Boolean, default: true },
    avatar: { type: String },
    gender: { type: String },
    pinCode: { type: String },
    state: { type: String },
    district: { type: String },
    city: { type: String },
    profileRole: {
      type: String,
      enum: ['user', 'doctor', 'hospital', 'yoga_teacher', 'blood_bank'],
      default: 'user',
    },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    role: this.role,
    permissions: this.permissions,
    isActive: this.isActive,
    avatar: this.avatar,
    gender: this.gender,
    pinCode: this.pinCode,
    state: this.state,
    district: this.district,
    city: this.city,
    profileRole: this.profileRole,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
module.exports.PERMISSIONS = PERMISSIONS;
