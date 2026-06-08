const notificationService = require('../services/notification.service');
const asyncHandler = require('../utils/asyncHandler');

const send = asyncHandler(async (req, res) => {
  const io = req.app.get('io');
  const notification = await notificationService.sendNotification(req.body, req.user._id, io, req);
  res.status(201).json({ success: true, message: 'Notification sent', data: notification });
});

const list = asyncHandler(async (req, res) => {
  const result = await notificationService.listNotifications({
    ...req.query,
    userId: req.user._id,
    role: req.user.role,
  });
  res.json({ success: true, data: result });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  res.json({ success: true, data: notification });
});

module.exports = { send, list, markRead };
