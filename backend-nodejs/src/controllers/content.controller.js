const asyncHandler = require('../utils/asyncHandler');
const { getService } = require('../services/content.service');
const { appointmentService, rewardService } = require('../services/mobile.service');
const Settings = require('../models/Settings');
const Activity = require('../models/Activity');
const AppError = require('../utils/AppError');

const makeCrudHandlers = resource => {
  const service = getService(resource);
  if (!service) return null;

  return {
    list: asyncHandler(async (req, res) => {
      const isPublic = !req.path.includes('/manage');
      const data = await service.list(req.query, isPublic);
      res.json({ success: true, data });
    }),
    get: asyncHandler(async (req, res) => {
      const item = await service.getById(req.params.id);
      res.json({ success: true, data: item });
    }),
    create: asyncHandler(async (req, res) => {
      const item = await service.create(req.body);
      res.status(201).json({ success: true, data: item });
    }),
    update: asyncHandler(async (req, res) => {
      const item = await service.update(req.params.id, req.body);
      res.json({ success: true, data: item });
    }),
    remove: asyncHandler(async (req, res) => {
      const result = await service.remove(req.params.id);
      res.json({ success: true, ...result });
    }),
    toggle: asyncHandler(async (req, res) => {
      const item = await service.toggleStatus(req.params.id);
      res.json({ success: true, data: item });
    }),
  };
};

const getHomeFeed = asyncHandler(async (_req, res) => {
  const Banner = require('../models/Banner');
  const HealthPackage = require('../models/HealthPackage');
  const Specialist = require('../models/Specialist');
  const InsurancePlan = require('../models/InsurancePlan');
  const Settings = require('../models/Settings');

  const [banners, packages, specialists, insurance, settings] = await Promise.all([
    Banner.find({ isActive: true, placement: 'home' }).sort('sortOrder').limit(5),
    HealthPackage.find({ isActive: true, isFeatured: true }).sort('sortOrder').limit(6),
    Specialist.find({ isActive: true, isFeatured: true }).sort('sortOrder').limit(8),
    InsurancePlan.find({ isActive: true, recommended: true }).sort('sortOrder').limit(3),
    Settings.find({}),
  ]);

  const settingsMap = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});

  res.json({
    success: true,
    data: { banners, packages, specialists, insurance, settings: settingsMap },
  });
});

const getAppConfig = asyncHandler(async (_req, res) => {
  const OnboardingSlide = require('../models/OnboardingSlide');
  const MenuItem = require('../models/MenuItem');
  const Settings = require('../models/Settings');

  const [slides, menuItems, settings] = await Promise.all([
    OnboardingSlide.find({ isActive: true }).sort('sortOrder'),
    MenuItem.find({ isActive: true }).sort('sortOrder'),
    Settings.find({}),
  ]);

  const settingsMap = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});

  res.json({ success: true, data: { slides, menuItems, settings: settingsMap } });
});

const searchAll = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  if (!q || q.length < 2) {
    return res.json({ success: true, data: { packages: [], specialists: [], cities: [], insurance: [] } });
  }

  const HealthPackage = require('../models/HealthPackage');
  const Specialist = require('../models/Specialist');
  const City = require('../models/City');
  const InsurancePlan = require('../models/InsurancePlan');
  const regex = { $regex: q, $options: 'i' };

  const [packages, specialists, cities, insurance] = await Promise.all([
    HealthPackage.find({ isActive: true, $or: [{ name: regex }, { description: regex }] }).limit(10),
    Specialist.find({ isActive: true, $or: [{ name: regex }, { specialty: regex }] }).limit(10),
    City.find({ isActive: true, $or: [{ name: regex }, { state: regex }, { district: regex }] }).limit(10),
    InsurancePlan.find({ isActive: true, $or: [{ provider: regex }, { name: regex }] }).limit(10),
  ]);

  res.json({ success: true, data: { packages, specialists, cities, insurance } });
});

const getUserActivity = asyncHandler(async (req, res) => {
  const query = { user: req.user._id };
  if (req.query.type && req.query.type !== 'all') {
    query.action = { $regex: req.query.type, $options: 'i' };
  }
  const page = +req.query.page || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Activity.find(query).sort('-createdAt').skip(skip).limit(limit),
    Activity.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
  });
});

const getPageBySlug = asyncHandler(async (req, res) => {
  const ContentPage = require('../models/ContentPage');
  const page = await ContentPage.findOne({ slug: req.params.slug, isActive: true });
  if (!page) throw new AppError('Page not found', 404);
  res.json({ success: true, data: page });
});

module.exports = {
  makeCrudHandlers,
  getHomeFeed,
  getAppConfig,
  searchAll,
  getUserActivity,
  getPageBySlug,
  appointmentService,
  rewardService,
};
