const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const dashboardRoutes = require('./dashboard.routes');
const notificationRoutes = require('./notification.routes');
const settingsRoutes = require('./settings.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admins', adminRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'VitalCare API is running', timestamp: new Date().toISOString() });
});

module.exports = router;
