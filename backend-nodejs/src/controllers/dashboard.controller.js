const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');

const getStats = asyncHandler(async (_req, res) => {
  const data = await dashboardService.getDashboardStats();
  res.json({ success: true, data });
});

module.exports = { getStats };
