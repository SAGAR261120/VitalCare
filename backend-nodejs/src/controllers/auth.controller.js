const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body, req);
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: result.user,
      token: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  if (!req.body.email && !req.body.phone) {
    return res.status(400).json({ success: false, message: 'Email or phone is required' });
  }
  const result = await authService.login(req.body, req);
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user,
      token: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshAccessToken(req.body.refreshToken, req);
  res.json({
    success: true,
    data: {
      user: result.user,
      token: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken, req.user._id, req);
  res.json({ success: true, message: 'Logged out successfully' });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email, req);
  res.json({ success: true, ...result });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body.token, req.body.password, req);
  res.json({ success: true, ...result });
});

const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(
    req.user._id,
    req.body.currentPassword,
    req.body.newPassword,
    req,
  );
  res.json({ success: true, ...result });
});

const sendOtp = asyncHandler(async (req, res) => {
  const result = await authService.sendOtp(req.body.phone, req);
  res.json({ success: true, ...result });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body.phone, req.body.otp, req);
  res.json({ success: true, message: 'OTP verified', data: result });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toPublicJSON() });
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  sendOtp,
  verifyOtp,
  getMe,
};
