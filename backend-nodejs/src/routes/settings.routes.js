const express = require('express');
const settingsController = require('../controllers/settings.controller');
const { protect, restrictTo, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.get('/', settingsController.getAll);

router.use(protect, restrictTo('admin', 'super_admin'));
router.put('/', requirePermission('settings.manage'), settingsController.update);

module.exports = router;
