const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const logger = require('../config/logger');

let io;

const initSocket = server => {
  io = new Server(server, {
    cors: { origin: config.corsOrigin, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next();

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', socket => {
    logger.debug(`Socket connected: ${socket.id}`);

    socket.on('join', ({ role, userId }) => {
      if (role) socket.join(`role:${role}`);
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      logger.debug(`Socket disconnected: ${socket.id}`);
    });
  });

  server.app = server.app || {};
  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

module.exports = { initSocket, getIO };
