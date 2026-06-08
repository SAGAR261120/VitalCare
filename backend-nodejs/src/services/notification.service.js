const Notification = require('../models/Notification');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { logActivity } = require('../utils/activityLogger');

const sendNotification = async (data, senderId, io, req) => {
  const notification = await Notification.create({
    ...data,
    sentBy: senderId,
  });

  if (io) {
    const event = data.type === 'broadcast' ? 'broadcast' : 'notification';
    if (data.targetRole === 'all') {
      io.emit(event, notification);
    } else {
      io.to(`role:${data.targetRole}`).emit(event, notification);
    }
  }

  await logActivity(
    'NOTIFICATION_SENT',
    `Notification "${data.title}" sent`,
    senderId,
    { notificationId: notification._id },
    req,
  );

  return notification;
};

const listNotifications = async ({ page = 1, limit = 20, userId, role }) => {
  const query = {
    $or: [
      { targetRole: 'all' },
      { targetRole: role },
      { targetUsers: userId },
    ],
  };

  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('sentBy', 'firstName lastName'),
    Notification.countDocuments(query),
  ]);

  return {
    notifications,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

const markAsRead = async (id, userId) => {
  const notification = await Notification.findById(id);
  if (!notification) throw new AppError('Notification not found', 404, 'NOT_FOUND');
  notification.isRead = true;
  await notification.save();
  return notification;
};

module.exports = { sendNotification, listNotifications, markAsRead };
