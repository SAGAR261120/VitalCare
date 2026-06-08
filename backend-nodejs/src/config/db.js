const mongoose = require('mongoose');
const config = require('./env');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

module.exports = connectDB;
