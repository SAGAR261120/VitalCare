const express = require('express');
const userController = require('../controllers/user.controller');
const validate = require('../middleware/validate');
const { protect, restrictTo, requirePermission } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createUserValidation,
  updateUserValidation,
  listUsersValidation,
} = require('../validations/user.validation');

const router = express.Router();

router.use(protect);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/profile/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, data: { avatar: `/uploads/${req.file.filename}` } });
});

const adminRouter = express.Router();
adminRouter.use(restrictTo('admin', 'super_admin'));
adminRouter.get('/', listUsersValidation, validate, requirePermission('users.read'), userController.listUsers);
adminRouter.get('/:id', requirePermission('users.read'), userController.getUser);
adminRouter.post('/', createUserValidation, validate, requirePermission('users.write'), userController.createUser);
adminRouter.put('/:id', updateUserValidation, validate, requirePermission('users.write'), userController.updateUser);
adminRouter.delete('/:id', requirePermission('users.delete'), userController.deleteUser);
adminRouter.patch('/:id/toggle-status', requirePermission('users.write'), userController.toggleStatus);

router.use('/manage', adminRouter);

module.exports = router;
