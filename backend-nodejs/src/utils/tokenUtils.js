const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const generateAccessToken = userId =>
  jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

const generateRefreshToken = () => crypto.randomBytes(40).toString('hex');

const verifyAccessToken = token =>
  jwt.verify(token, config.jwt.secret);

const getRefreshTokenExpiry = () => {
  const days = parseInt(config.jwt.refreshExpiresIn, 10) || 7;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + (String(config.jwt.refreshExpiresIn).includes('d') ? days : 7));
  return expiry;
};

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const hashToken = token =>
  crypto.createHash('sha256').update(token).digest('hex');

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  getRefreshTokenExpiry,
  generateOTP,
  hashToken,
};
