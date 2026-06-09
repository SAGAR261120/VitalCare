const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyAccessToken } = require('../utils/tokenUtils');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized, no token provided', 401, 'NO_TOKEN');
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('User no longer exists', 401, 'USER_NOT_FOUND');
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403, 'ACCOUNT_INACTIVE');
  }

  req.user = user;
  next();
});

const restrictTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission', 403, 'FORBIDDEN');
    }
    next();
  });

const requirePermission = (...permissions) =>
  asyncHandler(async (req, res, next) => {
    if (req.user.role === 'super_admin') return next();

    const hasPermission = permissions.some(p => req.user.permissions?.includes(p));
    if (!hasPermission) {
      throw new AppError('Insufficient permissions', 403, 'FORBIDDEN');
    }
    next();
  });

const optionalProtect = asyncHandler(async (req, _res, next) => {
  if (!req.headers.authorization?.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (user?.isActive) {
      req.user = user;
    }
  } catch {
    // Ignore invalid/expired access tokens for optional auth routes
  }

  next();
});

module.exports = { protect, restrictTo, requirePermission, optionalProtect };
