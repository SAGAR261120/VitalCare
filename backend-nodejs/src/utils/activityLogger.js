const Activity = require('../models/Activity');
const logger = require('../config/logger');

const logActivity = async (action, description, userId, metadata = {}, req = null) => {
  try {
    await Activity.create({
      action,
      description,
      user: userId,
      metadata,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'],
    });
  } catch (error) {
    logger.error(`Failed to log activity: ${error.message}`);
  }
};

module.exports = { logActivity };
