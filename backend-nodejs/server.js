require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/config/logger');
const { initSocket } = require('./src/sockets');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = initSocket(server);
  app.set('io', io);

  server.listen(PORT, () => {
    logger.info(`VitalCare API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

startServer().catch(err => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
