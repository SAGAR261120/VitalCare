const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { protect, restrictTo, requirePermission } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', notificationController.list);
router.patch('/:id/read', notificationController.markRead);

router.post(
  '/send',
  restrictTo('admin', 'super_admin'),
  requirePermission('notifications.send'),
  notificationController.send,
);

module.exports = router;
