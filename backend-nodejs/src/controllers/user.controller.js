const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

const listUsers = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  res.json({ success: true, data: result });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json({ success: true, data: user });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body, req.user._id, req);
  res.status(201).json({ success: true, message: 'User created', data: user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user._id, req);
  res.json({ success: true, message: 'User updated', data: user });
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id, req.user._id, req);
  res.json({ success: true, ...result });
});

const toggleStatus = asyncHandler(async (req, res) => {
  const user = await userService.toggleUserStatus(req.params.id, req.user._id, req);
  res.json({ success: true, message: 'Status updated', data: user });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toPublicJSON() });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body, req);
  res.json({ success: true, message: 'Profile updated', data: user });
});

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleStatus,
  getProfile,
  updateProfile,
};
