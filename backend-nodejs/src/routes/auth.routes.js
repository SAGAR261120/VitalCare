const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  otpSendValidation,
  otpVerifyValidation,
} = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', protect, authController.logout);
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);
router.post('/change-password', protect, changePasswordValidation, validate, authController.changePassword);
router.post('/otp/send', otpSendValidation, validate, authController.sendOtp);
router.post('/otp/verify', otpVerifyValidation, validate, authController.verifyOtp);
router.get('/me', protect, authController.getMe);

module.exports = router;
