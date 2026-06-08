require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { DEFAULT_SETTINGS } = require('../services/settings.service');
const config = require('../config/env');
const logger = require('../config/logger');

const SEED_USERS = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@test.com',
    password: 'SuperAdmin@123',
    role: 'super_admin',
    permissions: [
      'users.read', 'users.write', 'users.delete',
      'admins.read', 'admins.write', 'admins.delete',
      'notifications.send', 'settings.manage', 'dashboard.view',
    ],
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@test.com',
    password: 'Admin@123',
    role: 'admin',
    permissions: ['users.read', 'users.write', 'notifications.send', 'dashboard.view'],
  },
  {
    firstName: 'Test',
    lastName: 'User',
    email: 'user@test.com',
    password: 'User@123',
    role: 'user',
    phone: '+919876543210',
    profileRole: 'user',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info('Connected to MongoDB for seeding');

    for (const userData of SEED_USERS) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        logger.info(`User ${userData.email} already exists, skipping`);
        continue;
      }
      await User.create(userData);
      logger.info(`Created user: ${userData.email} (${userData.role})`);
    }

    for (const setting of DEFAULT_SETTINGS) {
      await Settings.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true, new: true },
      );
    }
    logger.info('Default settings seeded');

    logger.info('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
