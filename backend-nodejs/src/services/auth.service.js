const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const AppError = require('../utils/AppError');
const config = require('../config/env');
const logger = require('../config/logger');
const { logActivity } = require('../utils/activityLogger');
const {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  generateOTP,
  hashToken,
} = require('../utils/tokenUtils');

const createTokens = async (user, req) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken();

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: getRefreshTokenExpiry(),
    userAgent: req?.headers?.['user-agent'],
    ipAddress: req?.ip,
  });

  return { accessToken, refreshToken };
};

const register = async (data, req) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  const user = await User.create({
    ...data,
    role: 'user',
    profileRole: data.profileRole || 'user',
  });

  const tokens = await createTokens(user, req);
  await logActivity('USER_REGISTER', `${user.email} registered`, user._id, {}, req);

  return { user: user.toPublicJSON(), ...tokens };
};

const login = async ({ email, phone, password }, req) => {
  const query = email ? { email: email.toLowerCase() } : { phone };
  const user = await User.findOne(query).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403, 'ACCOUNT_INACTIVE');
  }

  user.lastLogin = new Date();
  await user.save();

  const tokens = await createTokens(user, req);
  await logActivity('USER_LOGIN', `${user.email} logged in`, user._id, {}, req);

  return { user: user.toPublicJSON(), ...tokens };
};

const refreshAccessToken = async (refreshToken, req) => {
  const stored = await RefreshToken.findOne({ token: refreshToken, isRevoked: false });
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH');
  }

  const user = await User.findById(stored.user);
  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive', 401, 'USER_INACTIVE');
  }

  stored.isRevoked = true;
  await stored.save();

  const tokens = await createTokens(user, req);
  return { user: user.toPublicJSON(), ...tokens };
};

const logout = async (refreshToken, userId, req) => {
  if (refreshToken) {
    await RefreshToken.updateOne({ token: refreshToken }, { isRevoked: true });
  } else {
    await RefreshToken.updateMany({ user: userId, isRevoked: false }, { isRevoked: true });
  }
  await logActivity('USER_LOGOUT', 'User logged out', userId, {}, req);
};

const forgotPassword = async (email, req) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return { message: 'If email exists, reset link has been sent' };
  }

  const resetToken = generateRefreshToken();
  user.passwordResetToken = hashToken(resetToken);
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  logger.info(`Password reset token for ${email}: ${resetToken}`);
  await logActivity('PASSWORD_RESET_REQUEST', `Reset requested for ${email}`, user._id, {}, req);

  return {
    message: 'If email exists, reset link has been sent',
    ...(process.env.NODE_ENV === 'development' && { resetToken }),
  };
};

const resetPassword = async (token, password, req) => {
  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  await RefreshToken.updateMany({ user: user._id }, { isRevoked: true });
  await logActivity('PASSWORD_RESET', `Password reset for ${user.email}`, user._id, {}, req);

  return { message: 'Password reset successful' };
};

const changePassword = async (userId, currentPassword, newPassword, req) => {
  const user = await User.findById(userId).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 400, 'WRONG_PASSWORD');
  }

  user.password = newPassword;
  await user.save();
  await logActivity('PASSWORD_CHANGE', `Password changed for ${user.email}`, userId, {}, req);

  return { message: 'Password changed successfully' };
};

const sendOtp = async (phone, req) => {
  const otp = generateOTP();
  const expires = new Date(Date.now() + config.otpExpiresMinutes * 60 * 1000);

  let user = await User.findOne({ phone }).select('+otp +otpExpires');
  if (!user) {
    user = await User.create({
      firstName: 'User',
      lastName: phone.slice(-4),
      email: `${phone.replace(/\D/g, '')}@vitalcare.temp`,
      phone,
      password: generateRefreshToken(),
      role: 'user',
    });
    user = await User.findById(user._id).select('+otp +otpExpires');
  }

  user.otp = otp;
  user.otpExpires = expires;
  await user.save({ validateBeforeSave: false });

  logger.info(`OTP for ${phone}: ${otp}`);
  return { message: 'OTP sent successfully', ...(process.env.NODE_ENV === 'development' && { otp }) };
};

const verifyOtp = async (phone, otp, req) => {
  const user = await User.findOne({ phone }).select('+otp +otpExpires');
  if (!user || user.otp !== otp || user.otpExpires < new Date()) {
    throw new AppError('Invalid or expired OTP', 400, 'INVALID_OTP');
  }

  user.otp = undefined;
  user.otpExpires = undefined;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const tokens = await createTokens(user, req);
  return { user: user.toPublicJSON(), token: tokens.accessToken, refreshToken: tokens.refreshToken };
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  sendOtp,
  verifyOtp,
};
