require('dotenv').config();

const required = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

required.forEach(key => {
  if (!process.env[key]) {
    console.warn(`Warning: ${key} is not set in environment variables`);
  }
});

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  apiVersion: process.env.API_VERSION || 'v1',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vitalcare',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
    uploadDir: process.env.UPLOAD_DIR || 'src/uploads',
  },
  otpExpiresMinutes: parseInt(process.env.OTP_EXPIRES_MINUTES, 10) || 10,
};
