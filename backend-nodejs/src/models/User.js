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
  'content.read',
  'content.write',
  'content.delete',
  'media.manage',
];

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
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
    dateOfBirth: { type: String },
    age: { type: Number },
    addressLine1: { type: String },
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
    rewardPoints: { type: Number, default: 0 },
    membershipTier: { type: String, default: 'Bronze' },
    walletAddress: { type: String },
    referralCode: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

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
    middleName: this.middleName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    role: this.role,
    permissions: this.permissions,
    isActive: this.isActive,
    avatar: this.avatar,
    gender: this.gender,
    dateOfBirth: this.dateOfBirth,
    age: this.age,
    addressLine1: this.addressLine1,
    pinCode: this.pinCode,
    state: this.state,
    district: this.district,
    city: this.city,
    profileRole: this.profileRole,
    rewardPoints: this.rewardPoints,
    membershipTier: this.membershipTier,
    walletAddress: this.walletAddress,
    referralCode: this.referralCode,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
module.exports.PERMISSIONS = PERMISSIONS;
