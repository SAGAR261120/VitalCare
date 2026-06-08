const User = require('../models/User');
const AppError = require('../utils/AppError');
const { logActivity } = require('../utils/activityLogger');

const DEFAULT_ADMIN_PERMISSIONS = [
  'users.read',
  'users.write',
  'notifications.send',
  'dashboard.view',
  'content.read',
  'content.write',
  'media.manage',
];

const listAdmins = async ({ page = 1, limit = 10, search }) => {
  const query = { role: { $in: ['admin', 'super_admin'] } };
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [admins, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return {
    admins: admins.map(a => a.toPublicJSON()),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

const createAdmin = async (data, superAdminId, req) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');

  const admin = await User.create({
    ...data,
    role: 'admin',
    permissions: data.permissions || DEFAULT_ADMIN_PERMISSIONS,
  });

  await logActivity('ADMIN_CREATED', `Admin ${admin.email} created`, superAdminId, { adminId: admin._id }, req);
  return admin.toPublicJSON();
};

const updateAdmin = async (id, data, superAdminId, req) => {
  const admin = await User.findById(id);
  if (!admin) throw new AppError('Admin not found', 404, 'NOT_FOUND');
  if (admin.role === 'super_admin') throw new AppError('Cannot modify super admin', 403, 'FORBIDDEN');

  Object.assign(admin, {
    firstName: data.firstName ?? admin.firstName,
    lastName: data.lastName ?? admin.lastName,
    permissions: data.permissions ?? admin.permissions,
  });
  if (data.password) admin.password = data.password;
  await admin.save();

  await logActivity('ADMIN_UPDATED', `Admin ${admin.email} updated`, superAdminId, { adminId: id }, req);
  return admin.toPublicJSON();
};

const deleteAdmin = async (id, superAdminId, req) => {
  const admin = await User.findById(id);
  if (!admin) throw new AppError('Admin not found', 404, 'NOT_FOUND');
  if (admin.role === 'super_admin') throw new AppError('Cannot delete super admin', 403, 'FORBIDDEN');

  await admin.deleteOne();
  await logActivity('ADMIN_DELETED', `Admin ${admin.email} deleted`, superAdminId, { adminId: id }, req);
  return { message: 'Admin deleted successfully' };
};

module.exports = { listAdmins, createAdmin, updateAdmin, deleteAdmin, DEFAULT_ADMIN_PERMISSIONS };
