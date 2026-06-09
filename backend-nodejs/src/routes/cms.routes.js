const express = require('express');
const { makeCrudHandlers } = require('../controllers/content.controller');
const { protect, restrictTo, requirePermission } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const asyncHandler = require('../utils/asyncHandler');
const healthPackageValidation = require('../validations/healthPackage.validation');
const path = require('path');

const router = express.Router();

router.use(protect, restrictTo('admin', 'super_admin'));

const RESOURCES = [
  'categories', 'subcategories', 'banners', 'health-packages', 'specialists',
  'membership-plans', 'insurance-plans', 'onboarding-slides', 'faqs', 'pages',
  'menu-items', 'cities', 'rewards',
];

const RESOURCE_VALIDATION = {
  'health-packages': {
    list: healthPackageValidation.listPackages,
    get: healthPackageValidation.packageId,
    create: healthPackageValidation.createPackage,
    update: healthPackageValidation.updatePackage,
    remove: healthPackageValidation.packageId,
    toggle: healthPackageValidation.packageId,
  },
};

RESOURCES.forEach(resource => {
  const handlers = makeCrudHandlers(resource);
  if (!handlers) return;
  const base = `/${resource}`;
  const rules = RESOURCE_VALIDATION[resource] || {};
  router.get(base, requirePermission('content.read'), ...(rules.list || []), validate, handlers.list);
  router.get(`${base}/:id`, requirePermission('content.read'), ...(rules.get || []), validate, handlers.get);
  router.post(base, requirePermission('content.write'), ...(rules.create || []), validate, handlers.create);
  router.put(`${base}/:id`, requirePermission('content.write'), ...(rules.update || []), validate, handlers.update);
  router.delete(`${base}/:id`, requirePermission('content.delete'), ...(rules.remove || []), validate, handlers.remove);
  router.patch(`${base}/:id/toggle`, requirePermission('content.write'), ...(rules.toggle || []), validate, handlers.toggle);
});

router.post('/media/upload', requirePermission('media.manage', 'content.write'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, data: { url, filename: req.file.filename, mimetype: req.file.mimetype } });
});

router.delete('/media/:filename', requirePermission('media.manage'), asyncHandler(async (req, res) => {
  const fs = require('fs');
  const config = require('../config/env');
  const filePath = path.join(process.cwd(), config.upload.uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  res.json({ success: true, message: 'File deleted' });
}));

module.exports = router;
