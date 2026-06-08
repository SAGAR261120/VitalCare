const { body } = require('express-validator');
const { PERMISSIONS } = require('../models/User');

const createAdminValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  body('permissions')
    .optional()
    .isArray()
    .custom(perms => perms.every(p => PERMISSIONS.includes(p)))
    .withMessage('Invalid permissions'),
];

const updateAdminValidation = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('permissions')
    .optional()
    .isArray()
    .custom(perms => perms.every(p => PERMISSIONS.includes(p))),
];

module.exports = { createAdminValidation, updateAdminValidation };
