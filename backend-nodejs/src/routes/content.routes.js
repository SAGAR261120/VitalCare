const express = require('express');
const {
  makeCrudHandlers,
  getHomeFeed,
  getAppConfig,
  searchAll,
  getUserActivity,
  getPageBySlug,
  appointmentService,
  rewardService,
  insuranceSubmissionService,
  cycleService,
} = require('../controllers/content.controller');
const { protect, restrictTo, requirePermission } = require('../middleware/auth');
const validate = require('../middleware/validate');
const healthPackageValidation = require('../validations/healthPackage.validation');
const appointmentValidation = require('../validations/appointment.validation');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Public mobile endpoints
router.get('/home', getHomeFeed);
router.get('/config', getAppConfig);
router.get('/search', searchAll);
router.get('/pages/slug/:slug', getPageBySlug);

const RESOURCES = [
  'categories', 'subcategories', 'banners', 'health-packages', 'specialists',
  'membership-plans', 'insurance-plans', 'onboarding-slides', 'faqs', 'pages',
  'menu-items', 'cities', 'rewards', 'cycle-wellness-tips',
];

RESOURCES.forEach(resource => {
  const handlers = makeCrudHandlers(resource);
  if (!handlers) return;
  const listRules = resource === 'health-packages' ? healthPackageValidation.listPackages : [];
  const getRules = resource === 'health-packages' ? healthPackageValidation.packageId : [];
  router.get(`/${resource}`, ...listRules, validate, handlers.list);
  router.get(`/${resource}/:id`, ...getRules, validate, handlers.get);
});

// Protected user endpoints
router.use(protect);

router.get('/appointments', asyncHandler(async (req, res) => {
  const data = await appointmentService.listForUser(req.user._id, req.query);
  res.json({ success: true, data });
}));

router.post('/appointments', appointmentValidation.bookAppointment, validate, asyncHandler(async (req, res) => {
  const item = await appointmentService.book(req.user._id, req.body);
  res.status(201).json({ success: true, data: item });
}));

router.get('/rewards', asyncHandler(async (req, res) => {
  const data = await rewardService.getUserRewards(req.user._id);
  res.json({ success: true, data });
}));

router.post('/rewards/withdraw', asyncHandler(async (req, res) => {
  const data = await rewardService.withdraw(req.user._id, req.body.points);
  res.json({ success: true, data });
}));

router.post('/rewards/wallet', asyncHandler(async (req, res) => {
  const data = await rewardService.connectWallet(req.user._id, req.body.address);
  res.json({ success: true, data });
}));

router.get('/activity', getUserActivity);

router.get('/insurance-submissions', asyncHandler(async (req, res) => {
  const data = await insuranceSubmissionService.listForUser(req.user._id, req.query);
  res.json({ success: true, data });
}));

router.post('/insurance-submissions', asyncHandler(async (req, res) => {
  const item = await insuranceSubmissionService.submit(req.user._id, req.body);
  res.status(201).json({ success: true, data: item });
}));

router.get('/cycle/dashboard', asyncHandler(async (req, res) => {
  const data = await cycleService.getDashboard(req.user._id);
  res.json({ success: true, data });
}));

router.get('/cycle/profile', asyncHandler(async (req, res) => {
  const data = await cycleService.getProfile(req.user._id);
  res.json({ success: true, data });
}));

router.put('/cycle/profile', asyncHandler(async (req, res) => {
  const data = await cycleService.upsertProfile(req.user._id, req.body);
  res.json({ success: true, data });
}));

router.get('/cycle/logs', asyncHandler(async (req, res) => {
  const data = await cycleService.listLogs(req.user._id, req.query);
  res.json({ success: true, data });
}));

router.post('/cycle/logs', asyncHandler(async (req, res) => {
  const item = await cycleService.createLog(req.user._id, req.body);
  res.status(201).json({ success: true, data: item });
}));

router.put('/cycle/logs/:id', asyncHandler(async (req, res) => {
  const item = await cycleService.updateLog(req.user._id, req.params.id, req.body);
  res.json({ success: true, data: item });
}));

router.delete('/cycle/logs/:id', asyncHandler(async (req, res) => {
  const result = await cycleService.deleteLog(req.user._id, req.params.id);
  res.json({ success: true, ...result });
}));

module.exports = router;
