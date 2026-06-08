const express = require('express');
const adminController = require('../controllers/admin.controller');
const validate = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');
const { createAdminValidation, updateAdminValidation } = require('../validations/admin.validation');

const router = express.Router();

router.use(protect, restrictTo('super_admin'));

router.get('/permissions', adminController.getPermissions);
router.get('/', adminController.listAdmins);
router.post('/', createAdminValidation, validate, adminController.createAdmin);
router.put('/:id', updateAdminValidation, validate, adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
