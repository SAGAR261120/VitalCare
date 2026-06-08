const User = require('../models/User');
const AppError = require('../utils/AppError');
const { logActivity } = require('../utils/activityLogger');

const buildUserQuery = ({ search, role, isActive }) => {
  const query = { role: role || 'user' };
  if (isActive !== undefined) query.isActive = isActive === 'true' || isActive === true;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }
  return query;
};

const listUsers = async ({ page = 1, limit = 10, search, role, isActive }) => {
  const query = buildUserQuery({ search, role: role || 'user', isActive });
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users: users.map(u => u.toPublicJSON()),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

const getUserById = async id => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
  return user.toPublicJSON();
};

const createUser = async (data, adminId, req) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');

  const user = await User.create({ ...data, role: data.role || 'user' });
  await logActivity('USER_CREATED', `User ${user.email} created`, adminId, { userId: user._id }, req);
  return user.toPublicJSON();
};

const updateUser = async (id, data, adminId, req) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

  if (data.email && data.email !== user.email) {
    const exists = await User.findOne({ email: data.email });
    if (exists) throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
  }

  Object.assign(user, data);
  if (data.password) user.password = data.password;
  await user.save();

  await logActivity('USER_UPDATED', `User ${user.email} updated`, adminId, { userId: id }, req);
  return user.toPublicJSON();
};

const deleteUser = async (id, adminId, req) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
  if (user.role === 'super_admin') throw new AppError('Cannot delete super admin', 403, 'FORBIDDEN');

  await user.deleteOne();
  await logActivity('USER_DELETED', `User ${user.email} deleted`, adminId, { userId: id }, req);
  return { message: 'User deleted successfully' };
};

const toggleUserStatus = async (id, adminId, req) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
  if (user.role === 'super_admin') throw new AppError('Cannot deactivate super admin', 403, 'FORBIDDEN');

  user.isActive = !user.isActive;
  await user.save();

  await logActivity(
    user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
    `User ${user.email} ${user.isActive ? 'activated' : 'deactivated'}`,
    adminId,
    { userId: id },
    req,
  );

  return user.toPublicJSON();
};

const updateProfile = async (userId, data, req) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

  const allowed = ['firstName', 'lastName', 'phone', 'gender', 'pinCode', 'state', 'district', 'city', 'avatar'];
  allowed.forEach(field => {
    if (data[field] !== undefined) user[field] = data[field];
  });
  await user.save();

  await logActivity('PROFILE_UPDATE', `Profile updated for ${user.email}`, userId, {}, req);
  return user.toPublicJSON();
};

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateProfile,
};
