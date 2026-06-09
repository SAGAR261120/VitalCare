const { body, param, query } = require('express-validator');

const arrayField = field =>
  body(field)
    .optional()
    .customSanitizer(value => {
      if (Array.isArray(value)) return value.filter(Boolean).map(String);
      if (typeof value === 'string') {
        return value
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean);
      }
      return [];
    });

const packageBodyRules = [
  body('name').trim().notEmpty().withMessage('Package name is required'),
  body('code').trim().notEmpty().withMessage('Package code is required'),
  body('price').isFloat({ min: 0 }).withMessage('Discount price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }),
  body('discount').optional().isInt({ min: 0, max: 100 }),
  body('category').optional({ nullable: true }).isMongoId(),
  body('description').optional().isString(),
  body('image').optional().isString(),
  body('preparationInstructions').optional().isString(),
  body('packageDuration').optional().isString(),
  body('reportDeliveryTime').optional().isString(),
  body('badge').optional().isString(),
  body('testCount').optional().isInt({ min: 0 }),
  body('sortOrder').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean(),
  body('isFeatured').optional().isBoolean(),
  arrayField('includedTests'),
  arrayField('excludedTests'),
  arrayField('benefits'),
  arrayField('recommendedFor'),
];

module.exports = {
  createPackage: packageBodyRules,
  updatePackage: [
    param('id').isMongoId().withMessage('Invalid package id'),
    body('name').optional().trim().notEmpty(),
    body('code').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('originalPrice').optional().isFloat({ min: 0 }),
    body('discount').optional().isInt({ min: 0, max: 100 }),
    body('category').optional({ nullable: true }).isMongoId(),
    body('description').optional().isString(),
    body('image').optional().isString(),
    body('preparationInstructions').optional().isString(),
    body('packageDuration').optional().isString(),
    body('reportDeliveryTime').optional().isString(),
    body('badge').optional().isString(),
    body('testCount').optional().isInt({ min: 0 }),
    body('sortOrder').optional().isInt({ min: 0 }),
    body('isActive').optional().isBoolean(),
    body('isFeatured').optional().isBoolean(),
    arrayField('includedTests'),
    arrayField('excludedTests'),
    arrayField('benefits'),
    arrayField('recommendedFor'),
  ],
  packageId: [param('id').isMongoId().withMessage('Invalid package id')],
  listPackages: [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
    query('category').optional().isMongoId(),
    query('isActive').optional().isIn(['true', 'false']),
    query('isFeatured').optional().isIn(['true', 'false']),
  ],
};
