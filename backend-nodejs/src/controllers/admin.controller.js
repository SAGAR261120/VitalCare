const adminService = require('../services/admin.service');
const { PERMISSIONS } = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const listAdmins = asyncHandler(async (req, res) => {
  const result = await adminService.listAdmins(req.query);
  res.json({ success: true, data: result });
});

const createAdmin = asyncHandler(async (req, res) => {
  const admin = await adminService.createAdmin(req.body, req.user._id, req);
  res.status(201).json({ success: true, message: 'Admin created', data: admin });
});

const updateAdmin = asyncHandler(async (req, res) => {
  const admin = await adminService.updateAdmin(req.params.id, req.body, req.user._id, req);
  res.json({ success: true, message: 'Admin updated', data: admin });
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const result = await adminService.deleteAdmin(req.params.id, req.user._id, req);
  res.json({ success: true, ...result });
});

const getPermissions = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: PERMISSIONS });
});

module.exports = { listAdmins, createAdmin, updateAdmin, deleteAdmin, getPermissions };
