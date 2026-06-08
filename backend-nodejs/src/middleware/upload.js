const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('../config/env');
const AppError = require('../utils/AppError');

const uploadDir = path.join(process.cwd(), config.upload.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400, 'INVALID_FILE'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter,
});

module.exports = upload;
