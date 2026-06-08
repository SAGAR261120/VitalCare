const User = require('../models/User');
const Activity = require('../models/Activity');

const getDashboardStats = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers, activeUsers, newRegistrations, recentActivities] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', isActive: true }),
    User.countDocuments({ role: 'user', createdAt: { $gte: sevenDaysAgo } }),
    Activity.find().sort({ createdAt: -1 }).limit(10).populate('user', 'firstName lastName email'),
  ]);

  const registrationTrend = await User.aggregate([
    { $match: { role: 'user', createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const userActivity = await User.aggregate([
    { $match: { role: 'user' } },
    {
      $group: {
        _id: '$isActive',
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    stats: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      newRegistrations,
      revenue: 125000,
    },
    charts: {
      registrationTrend: registrationTrend.map(r => ({ date: r._id, count: r.count })),
      userActivity: userActivity.map(u => ({
        label: u._id ? 'Active' : 'Inactive',
        value: u.count,
      })),
    },
    recentActivities: recentActivities.map(a => ({
      id: a._id,
      action: a.action,
      description: a.description,
      user: a.user
        ? { name: `${a.user.firstName} ${a.user.lastName}`, email: a.user.email }
        : null,
      createdAt: a.createdAt,
    })),
  };
};

module.exports = { getDashboardStats };
