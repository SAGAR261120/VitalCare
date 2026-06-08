const AppError = require('../utils/AppError');
const logger = require('../config/logger');

const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new AppError(messages.join(', '), 400, 'VALIDATION_ERROR');
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`${field} already exists`, 409, 'DUPLICATE_ERROR');
  }

  if (err.name === 'CastError') {
    error = new AppError('Invalid resource ID', 400, 'INVALID_ID');
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401, 'TOKEN_EXPIRED');
  }

  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';

  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${error.message}`, { stack: error.stack });
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
};

module.exports = { errorHandler, notFound };
