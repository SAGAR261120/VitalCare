const { body } = require('express-validator');

const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone required'),
];

const loginValidation = [
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email required'),
  body('phone').optional({ checkFalsy: true }).isString().withMessage('Valid phone required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
];

const otpSendValidation = [
  body('phone').notEmpty().withMessage('Phone is required'),
];

const otpVerifyValidation = [
  body('phone').notEmpty().withMessage('Phone is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  otpSendValidation,
  otpVerifyValidation,
};
