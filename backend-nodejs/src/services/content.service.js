const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Banner = require('../models/Banner');
const HealthPackage = require('../models/HealthPackage');
const Specialist = require('../models/Specialist');
const MembershipPlan = require('../models/MembershipPlan');
const InsurancePlan = require('../models/InsurancePlan');
const OnboardingSlide = require('../models/OnboardingSlide');
const FAQ = require('../models/FAQ');
const ContentPage = require('../models/ContentPage');
const MenuItem = require('../models/MenuItem');
const City = require('../models/City');
const Reward = require('../models/Reward');
const createCrudService = require('../utils/crudFactory');

const MODEL_MAP = {
  categories: { Model: Category, searchFields: ['name', 'slug'], public: true },
  subcategories: { Model: Subcategory, searchFields: ['name'], public: true },
  banners: { Model: Banner, searchFields: ['title'], public: true },
  'health-packages': {
    Model: HealthPackage,
    searchFields: ['name', 'description', 'code'],
    public: true,
    populate: [{ path: 'category', select: 'name slug icon image scope' }],
  },
  specialists: { Model: Specialist, searchFields: ['name', 'specialty'], public: true },
  'membership-plans': { Model: MembershipPlan, searchFields: ['name'], public: true },
  'insurance-plans': { Model: InsurancePlan, searchFields: ['provider', 'name'], public: true },
  'onboarding-slides': { Model: OnboardingSlide, searchFields: ['title'], public: true },
  faqs: { Model: FAQ, searchFields: ['question'], public: true },
  pages: { Model: ContentPage, searchFields: ['title', 'slug'], public: true },
  'menu-items': { Model: MenuItem, searchFields: ['label'], public: true },
  cities: { Model: City, searchFields: ['name', 'state', 'district'], public: true },
  rewards: { Model: Reward, searchFields: ['title'], public: true },
};

const getService = resource => {
  const config = MODEL_MAP[resource];
  if (!config) return null;
  return createCrudService(config.Model, {
    searchFields: config.searchFields,
    publicFilter: config.public ? { isActive: true } : {},
    populate: config.populate || [],
  });
};

module.exports = { MODEL_MAP, getService };
