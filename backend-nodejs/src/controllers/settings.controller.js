const settingsService = require('../services/settings.service');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings(req.query.category);
  res.json({ success: true, data: settings });
});

const update = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body.settings, req.user._id);
  res.json({ success: true, message: 'Settings updated', data: settings });
});

module.exports = { getAll, update };
