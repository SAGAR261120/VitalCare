const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { protect, restrictTo, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.use(protect, restrictTo('admin', 'super_admin'), requirePermission('dashboard.view'));
router.get('/stats', dashboardController.getStats);

module.exports = router;
