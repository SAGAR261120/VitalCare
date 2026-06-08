const Settings = require('../models/Settings');

const DEFAULT_SETTINGS = [
  { key: 'app_name', value: 'VitalCare', category: 'application' },
  { key: 'app_tagline', value: 'Your Health, Elevated', category: 'application' },
  { key: 'support_email', value: 'support@vitalcare.app', category: 'application' },
  { key: 'theme_primary_color', value: '#7C3AED', category: 'theme' },
  { key: 'theme_mode', value: 'light', category: 'theme' },
  { key: 'push_notifications_enabled', value: true, category: 'notification' },
  { key: 'session_timeout_minutes', value: 30, category: 'security' },
];

const getSettings = async (category) => {
  const query = category ? { category } : {};
  const settings = await Settings.find(query);
  if (settings.length === 0 && !category) {
    await Settings.insertMany(DEFAULT_SETTINGS);
    return Settings.find({});
  }
  return settings;
};

const updateSetting = async (key, value, userId) => {
  const setting = await Settings.findOneAndUpdate(
    { key },
    { value, updatedBy: userId },
    { new: true, upsert: true },
  );
  return setting;
};

const updateSettings = async (settings, userId) => {
  const results = await Promise.all(
    settings.map(({ key, value }) => updateSetting(key, value, userId)),
  );
  return results;
};

module.exports = { getSettings, updateSetting, updateSettings, DEFAULT_SETTINGS };
