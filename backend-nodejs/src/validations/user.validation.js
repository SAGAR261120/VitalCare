const { body, query } = require('express-validator');

const createUserValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
];

const updateUserValidation = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('isActive').optional().isBoolean(),
];

const listUsersValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('role').optional().isIn(['user', 'admin', 'super_admin']),
  query('isActive').optional().isIn(['true', 'false']),
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  listUsersValidation,
};
