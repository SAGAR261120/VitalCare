/**
 * VitalCare Comprehensive Database Seeder
 * Seeds: 1 Super Admin, 3 Admins, 50 Users, Categories, Content, Banners, etc.
 * Usage: npm run seed [-- --reset]
 */
require('dotenv').config({ path: require('path').join(__dirname, '../backend-nodejs/.env') });

// Must use the same mongoose instance as backend models (avoid buffering timeout)
const mongoose = require('../backend-nodejs/node_modules/mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitalcare';
const RESET = process.argv.includes('--reset');

// Import models from backend
const modelPath = require('path').join(__dirname, '../backend-nodejs/src/models');
const User = require(require('path').join(modelPath, 'User'));
const Category = require(require('path').join(modelPath, 'Category'));
const Subcategory = require(require('path').join(modelPath, 'Subcategory'));
const Banner = require(require('path').join(modelPath, 'Banner'));
const HealthPackage = require(require('path').join(modelPath, 'HealthPackage'));
const Specialist = require(require('path').join(modelPath, 'Specialist'));
const MembershipPlan = require(require('path').join(modelPath, 'MembershipPlan'));
const InsurancePlan = require(require('path').join(modelPath, 'InsurancePlan'));
const OnboardingSlide = require(require('path').join(modelPath, 'OnboardingSlide'));
const FAQ = require(require('path').join(modelPath, 'FAQ'));
const ContentPage = require(require('path').join(modelPath, 'ContentPage'));
const MenuItem = require(require('path').join(modelPath, 'MenuItem'));
const City = require(require('path').join(modelPath, 'City'));
const Reward = require(require('path').join(modelPath, 'Reward'));
const Notification = require(require('path').join(modelPath, 'Notification'));
const Activity = require(require('path').join(modelPath, 'Activity'));
const Settings = require(require('path').join(modelPath, 'Settings'));
const Appointment = require(require('path').join(modelPath, 'Appointment'));
const RewardTransaction = require(require('path').join(modelPath, 'RewardTransaction'));
const CycleWellnessTip = require(require('path').join(modelPath, 'CycleWellnessTip'));

const FIRST_NAMES = ['Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Reyansh','Ayaan','Krishna','Ishaan','Ananya','Diya','Myra','Aadhya','Kiara','Navya','Pari','Saanvi','Ira','Avni','Rohan','Kabir','Dev','Yash','Atharv','Priya','Neha','Pooja','Kavya','Shreya','Rahul','Amit','Suresh','Rajesh','Vikram','Deepak','Manoj','Sanjay','Nitin','Pradeep','Sneha','Ritu','Meera','Tanvi','Nisha','Kiran','Harish','Gopal','Mahesh','Lalit'];
const LAST_NAMES = ['Sharma','Patel','Kumar','Singh','Gupta','Reddy','Nair','Iyer','Joshi','Mehta','Shah','Rao','Chopra','Malhotra','Verma','Das','Pillai','Menon','Bhat','Desai'];
const STATES = ['Maharashtra','Karnataka','Tamil Nadu','Gujarat','Rajasthan','Uttar Pradesh','West Bengal','Telangana','Kerala','Punjab'];
const CITIES = ['Mumbai','Pune','Nagpur','Bangalore','Chennai','Hyderabad','Ahmedabad','Jaipur','Lucknow','Kolkata'];

const seed = async () => {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected to MongoDB');

  if (RESET) {
    console.log('Resetting database...');
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  }

  // ── Settings ──
  const settings = [
    { key: 'app_name', value: 'VitalCare', category: 'application' },
    { key: 'app_tagline', value: 'Your Health, Elevated', category: 'application' },
    { key: 'support_email', value: 'support@vitalcare.app', category: 'application' },
    { key: 'support_phone', value: '+911800123456', category: 'application' },
    { key: 'whatsapp_number', value: '+911800123456', category: 'application' },
    { key: 'theme_primary_color', value: '#7C3AED', category: 'theme' },
    { key: 'theme_mode', value: 'light', category: 'theme' },
    { key: 'push_notifications_enabled', value: true, category: 'notification' },
    { key: 'gkcm_price', value: 169.1, category: 'application' },
    { key: 'points_to_gkcm_rate', value: 0.0058, category: 'application' },
  ];
  for (const s of settings) await Settings.findOneAndUpdate({ key: s.key }, s, { upsert: true });
  console.log('✓ Settings seeded');

  // ── Admin Users ──
  const admins = [
    { firstName: 'Super', lastName: 'Admin', email: 'superadmin@test.com', password: 'SuperAdmin@123', role: 'super_admin',
      permissions: ['users.read','users.write','users.delete','admins.read','admins.write','admins.delete','notifications.send','settings.manage','dashboard.view','content.read','content.write','content.delete','media.manage'] },
    { firstName: 'Admin', lastName: 'User', email: 'admin@test.com', password: 'Admin@123', role: 'admin',
      permissions: ['users.read','users.write','notifications.send','dashboard.view','content.read','content.write','media.manage'] },
    { firstName: 'Content', lastName: 'Manager', email: 'contentadmin@test.com', password: 'Admin@123', role: 'admin',
      permissions: ['content.read','content.write','media.manage','dashboard.view'] },
    { firstName: 'Support', lastName: 'Admin', email: 'supportadmin@test.com', password: 'Admin@123', role: 'admin',
      permissions: ['users.read','notifications.send','dashboard.view'] },
  ];

  const createdAdmins = [];
  for (const a of admins) {
    let user = await User.findOne({ email: a.email });
    if (!user) user = await User.create(a);
    createdAdmins.push(user);
  }
  console.log(`✓ ${admins.length} admins seeded`);

  // ── 50 Regular Users ──
  let testUser = await User.findOne({ email: 'user@test.com' });
  if (!testUser) {
    testUser = await User.create({ firstName: 'Test', lastName: 'User', email: 'user@test.com', password: 'User@123', role: 'user', phone: '+919876543210', rewardPoints: 1250, membershipTier: 'Silver', state: 'Maharashtra', city: 'Nagpur', referralCode: 'VC-TEST01' });
  }

  let userCount = 1;
  for (let i = 0; i < 49; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[i % LAST_NAMES.length];
    const email = `user${i + 1}@vitalcare.app`;
    const exists = await User.findOne({ email });
    if (!exists) {
      await User.create({
        firstName: fn, lastName: ln, email, password: 'User@123', role: 'user',
        phone: `+919${String(100000000 + i).slice(0, 9)}`,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        state: STATES[i % STATES.length], city: CITIES[i % CITIES.length],
        rewardPoints: Math.floor(Math.random() * 3000),
        membershipTier: ['Bronze','Silver','Gold'][i % 3],
        referralCode: `VC-${String(i + 2).padStart(4, '0')}`,
        isActive: i % 10 !== 0,
      });
      userCount++;
    }
  }
  console.log(`✓ ${userCount}+ users seeded`);

  // ── Categories ──
  const catData = [
    { name: 'Health Checkups', slug: 'health-checkups', icon: 'fitness-outline', sortOrder: 1 },
    { name: 'Diagnostics', slug: 'diagnostics', icon: 'flask-outline', sortOrder: 2 },
    { name: 'Wellness', slug: 'wellness', icon: 'leaf-outline', sortOrder: 3 },
    { name: 'Insurance', slug: 'insurance', icon: 'shield-checkmark-outline', sortOrder: 4 },
    { name: 'Membership', slug: 'membership', icon: 'ribbon-outline', sortOrder: 5 },
    { name: 'Health Checks', slug: 'pkg-health-checks', icon: 'heart-outline', scope: 'health-package', sortOrder: 1 },
    { name: 'Lab Tests', slug: 'pkg-lab-tests', icon: 'flask-outline', scope: 'health-package', sortOrder: 2 },
    { name: 'Scans', slug: 'pkg-scans', icon: 'scan-outline', scope: 'health-package', sortOrder: 3 },
  ];
  const categories = [];
  for (const c of catData) {
    const cat = await Category.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
    categories.push(cat);
  }
  console.log('✓ Categories seeded');

  // ── Subcategories ──
  const subData = [
    { category: categories[0]._id, name: 'Basic Panels', slug: 'basic-panels' },
    { category: categories[0]._id, name: 'Advanced Panels', slug: 'advanced-panels' },
    { category: categories[1]._id, name: 'Blood Tests', slug: 'blood-tests' },
    { category: categories[2]._id, name: 'Yoga & Fitness', slug: 'yoga-fitness' },
  ];
  for (const s of subData) await Subcategory.findOneAndUpdate({ slug: s.slug }, s, { upsert: true });
  console.log('✓ Subcategories seeded');

  // ── Banners ──
  const banners = [
    { title: 'Healthcare Reimagined', subtitle: 'Premium health services at your fingertips', placement: 'home', gradient: ['#EDE9FE','#E0F2FE'], sortOrder: 1 },
    { title: 'Schedule a Checkup', subtitle: 'Book comprehensive health packages today', placement: 'home', gradient: ['#ECFDF5','#E0F2FE'], sortOrder: 2 },
    { title: 'Insurance Made Easy', subtitle: 'Compare and choose the best plans', placement: 'promo', gradient: ['#FFF7ED','#FFF1F2'], sortOrder: 3 },
    { title: 'THE INSURANCE SECTION OF GKC KLINICA!', subtitle: 'Upload and save your policies securely. Always Here For You.', placement: 'insurance', gradient: ['#E0F2FE','#EDE9FE'], sortOrder: 1 },
    { title: 'Your Health Partner', subtitle: 'Period & Pregnancy Tracking Tool', placement: 'cycle', gradient: ['#FFF1F2','#FCE7F3'], sortOrder: 1 },
    { title: 'Wellness Journey', subtitle: 'Track health metrics and earn rewards', placement: 'home', gradient: ['#F0F9FF','#EDE9FE'], sortOrder: 4 },
  ];
  for (const b of banners) await Banner.findOneAndUpdate({ title: b.title }, b, { upsert: true });
  console.log('✓ Banners seeded');

  // ── Cycle Wellness Tips ──
  const cycleTips = [
    { title: 'Daily Wellness Tip', message: 'Prioritize self-care, balanced diet, and manage stress.', sortOrder: 1 },
    { title: 'Hydration', message: 'Drink plenty of water throughout the day to support overall wellness.', sortOrder: 2 },
    { title: 'Rest', message: 'Aim for 7–8 hours of sleep to help regulate your cycle naturally.', sortOrder: 3 },
    { title: 'Movement', message: 'Light exercise like walking or yoga can ease cramps and boost mood.', sortOrder: 4 },
  ];
  for (const tip of cycleTips) {
    await CycleWellnessTip.findOneAndUpdate({ message: tip.message }, tip, { upsert: true });
  }
  console.log('✓ Cycle wellness tips seeded');

  // ── Health Packages ──
  const pkgCategories = categories.filter(c => c.scope === 'health-package');
  const healthChecks = pkgCategories.find(c => c.slug === 'pkg-health-checks') || categories[0];
  const labTests = pkgCategories.find(c => c.slug === 'pkg-lab-tests') || categories[0];
  const scans = pkgCategories.find(c => c.slug === 'pkg-scans') || categories[0];

  const packages = [
    {
      name: 'GKC Klinica Mini Package', code: 'GKC-MINI', category: healthChecks._id, sortOrder: 1,
      price: 500, originalPrice: 1500, badge: 'Popular', isFeatured: true,
      description: 'A quick yet comprehensive health snapshot ideal for routine wellness monitoring.',
      includedTests: ['Fasting Blood Glucose', 'CBC', 'Creatinine', 'SGPT Test', 'Cholesterol', 'Thyroid TSH', 'Vitamin D', 'HbA1c', 'Uric Acid', 'Lipid Profile', 'Kidney Function', 'Liver Function', 'Iron Studies', 'Calcium', 'Electrolytes', 'Urine Routine', 'ECG', 'Chest X-Ray'],
      excludedTests: ['MRI Scan', 'CT Scan'],
      benefits: ['Home sample collection', 'Digital reports', 'Doctor consultation summary'],
      preparationInstructions: 'Fast for 10-12 hours before sample collection. Avoid alcohol 24 hours prior.',
      recommendedFor: ['Adults 25+', 'Annual checkup', 'Preventive screening'],
      packageDuration: 'Same day collection',
      reportDeliveryTime: '48 hours',
    },
    {
      name: 'Essential Wellness', code: 'ESS-WELL', category: healthChecks._id, sortOrder: 2,
      price: 499, originalPrice: 1499, badge: 'Best Value', isFeatured: true,
      description: 'Core health markers for routine wellness monitoring.',
      includedTests: ['CBC', 'Fasting Blood Glucose', 'Lipid Profile', 'Liver Function', 'Kidney Function', 'Thyroid TSH', 'Vitamin D', 'Vitamin B12', 'Iron Studies', 'Uric Acid', 'Calcium', 'Electrolytes', 'HbA1c', 'CRP', 'ESR', 'Urine Routine', 'Stool Routine', 'ECG'],
      benefits: ['Free home collection', 'Online report access', 'Health summary'],
      preparationInstructions: 'Maintain 10-12 hour fasting. Drink water as needed.',
      recommendedFor: ['Working professionals', 'Family health screening'],
      packageDuration: '1 visit',
      reportDeliveryTime: '24 hours',
    },
    {
      name: 'Complete Health Panel', code: 'CMP-46', category: healthChecks._id, sortOrder: 3,
      price: 999, originalPrice: 2999, isFeatured: true,
      description: 'Comprehensive diagnostics for complete health insight.',
      includedTests: ['CBC', 'Lipid Profile', 'Liver Function', 'Kidney Function', 'Thyroid Panel', 'Diabetes Panel', 'Cardiac Risk Markers', 'Vitamin Panel', 'Hormone Panel', 'Inflammation Markers'],
      benefits: ['Detailed health report', 'Specialist review', 'Priority support'],
      preparationInstructions: 'Fast for 12 hours. Avoid strenuous exercise before collection.',
      recommendedFor: ['Age 35+', 'Chronic condition monitoring'],
      packageDuration: '1-2 days',
      reportDeliveryTime: '48 hours',
    },
    {
      name: 'Allergy Panel IgE', code: 'ALRG-IGE', category: labTests._id, sortOrder: 4,
      price: 400, originalPrice: 600, isFeatured: false,
      description: 'Allergen-specific immunoglobulin E blood test for common allergies.',
      includedTests: ['Dust Mite IgE', 'Pollen IgE', 'Food Allergen Panel', 'Animal Dander IgE'],
      excludedTests: ['Skin Prick Test'],
      benefits: ['Identify allergy triggers', 'Guide treatment plan'],
      preparationInstructions: 'No fasting required. Inform about antihistamine use.',
      recommendedFor: ['Allergy sufferers', 'Asthma patients'],
      packageDuration: 'Single visit',
      reportDeliveryTime: '72 hours',
    },
    {
      name: 'GKC Bone Care', code: 'GKC-BONE', category: labTests._id, sortOrder: 5,
      price: 600, originalPrice: 800, isFeatured: true,
      description: 'Bone health and joint wellness screening package.',
      includedTests: ['Calcium', 'Vitamin D', 'Phosphorus', 'Alkaline Phosphatase', 'PTH', 'Rheumatoid Factor', 'CRP', 'Uric Acid', 'X-Ray Knee', 'Bone Density Screening'],
      benefits: ['Bone health assessment', 'Orthopedic guidance'],
      preparationInstructions: 'No special preparation. Wear comfortable clothing for imaging.',
      recommendedFor: ['Seniors', 'Joint pain patients', 'Post-menopausal women'],
      packageDuration: '1 day',
      reportDeliveryTime: '48 hours',
    },
    {
      name: 'Executive Checkup', code: 'EXEC-72', category: healthChecks._id, sortOrder: 6,
      price: 2499, originalPrice: 5999, badge: 'Premium', isFeatured: true,
      description: 'Premium full-body assessment for professionals.',
      includedTests: ['Full Body Checkup', 'Cardiac Markers', 'Cancer Markers', 'Hormone Panel', 'Vitamin Panel', 'ECG', '2D Echo', 'Chest X-Ray', 'Ultrasound Abdomen'],
      benefits: ['Executive lounge access', 'Dedicated health manager', 'Specialist consultation'],
      preparationInstructions: 'Fast 12 hours. Schedule morning slot preferred.',
      recommendedFor: ['Corporate executives', 'Age 40+'],
      packageDuration: '2 days',
      reportDeliveryTime: '72 hours',
    },
    {
      name: 'Ultrasound Abdomen', code: 'USG-ABD', category: scans._id, sortOrder: 7,
      price: 800, originalPrice: 1200, isFeatured: false,
      description: 'Comprehensive abdominal ultrasound scan.',
      includedTests: ['Liver', 'Gallbladder', 'Pancreas', 'Spleen', 'Kidneys', 'Bladder'],
      benefits: ['Non-invasive imaging', 'Same-day report'],
      preparationInstructions: 'Fast for 6 hours. Drink 4 glasses of water 1 hour before scan.',
      recommendedFor: ['Abdominal pain', 'Digestive issues'],
      packageDuration: '30 minutes',
      reportDeliveryTime: '24 hours',
    },
  ];
  for (const p of packages) {
    const payload = {
      ...p,
      testCount: p.includedTests?.length || p.testCount || 0,
      discount:
        p.originalPrice && p.price && p.originalPrice > p.price
          ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
          : (p.discount || 0),
    };
    await HealthPackage.findOneAndUpdate({ code: p.code }, payload, { upsert: true });
  }
  console.log('✓ Health packages seeded');

  // ── Specialists ──
  const specialists = [
    { name: 'Dr. Sharma', specialty: 'Cardiologist', rating: 4.9, experience: '15+ years', imageColor: '#A78BFA', isFeatured: true },
    { name: 'Dr. Patel', specialty: 'Dermatologist', rating: 4.8, experience: '12+ years', imageColor: '#34D399', isFeatured: true },
    { name: 'Dr. Kumar', specialty: 'Neurologist', rating: 4.9, experience: '18+ years', imageColor: '#38BDF8', isFeatured: true },
    { name: 'Dr. Singh', specialty: 'Pediatrician', rating: 4.7, experience: '10+ years', imageColor: '#FB923C', isFeatured: true },
    { name: 'Dr. Reddy', specialty: 'Orthopedic', rating: 4.6, experience: '14+ years', imageColor: '#F472B6', isFeatured: true },
  ];
  for (const s of specialists) await Specialist.findOneAndUpdate({ name: s.name }, s, { upsert: true });
  console.log('✓ Specialists seeded');

  // ── Membership Plans ──
  const memberships = [
    { name: 'Essential Care', tier: 'NATIONAL', validity: '1 Year', price: 1999, originalPrice: 3999, badge: 'Popular',
      features: [{ label: 'Yoga & Wellness Webinars', included: true }, { label: 'Health Insurance Consultation', included: true }, { label: 'Priority Appointment Booking', included: true }, { label: '24/7 Premium Support', included: false }] },
    { name: 'Premium Care', tier: 'GLOBAL', validity: '1 Year', price: 4999, originalPrice: 9999, badge: 'Recommended',
      features: [{ label: 'All Essential Features', included: true }, { label: '24/7 Premium Support', included: true }, { label: 'Medical Tourism Facility', included: true }, { label: 'Dedicated Health Manager', included: true }] },
  ];
  for (const m of memberships) await MembershipPlan.findOneAndUpdate({ name: m.name }, m, { upsert: true });
  console.log('✓ Membership plans seeded');

  // ── Insurance Plans ──
  const insurance = [
    { provider: 'Axis Max Life Insurance', name: 'Smart Term Plan Plus', description: 'Axis Max Life Smart Term Plan Plus is a comprehensive term insurance plan that offers pure risk protection to the family of the life assured in case of any eventuality.', coverage: 5000000, premium: 12659, recommended: true, tenure: '85 Year', sortOrder: 1, sumInsured: 5000000, cashlessHospitals: '5000+', subLimits: 'As per policy', noClaimBonus: 'Up to 50%', waitingPeriod: '90 days', claimSettlementRatio: '99%', coPayment: '0%' },
    { provider: 'HDFC ERGO', name: 'Optima Select Health Insurance Plan', description: 'Comprehensive health insurance with cashless hospitalization and wide network coverage.', coverage: 500000, premium: 18500, recommended: false, tenure: '1 Year', sortOrder: 2, sumInsured: 500000, cashlessHospitals: '12000+', claimSettlementRatio: '96%' },
    { provider: 'ICICI Prudential', name: 'iProtect Smart', description: 'Flexible term plan with increasing cover option and affordable premiums.', coverage: 10000000, premium: 15999, recommended: true, tenure: '40 Years', sortOrder: 3, sumInsured: 10000000, claimSettlementRatio: '98%' },
  ];
  for (const i of insurance) await InsurancePlan.findOneAndUpdate({ name: i.name, provider: i.provider }, i, { upsert: true });
  console.log('✓ Insurance plans seeded');

  // ── Onboarding Slides ──
  const slides = [
    { title: 'Healthcare Reimagined', subtitle: 'Experience premium healthcare with cutting-edge technology.', icon: 'heart-circle-outline', gradient: ['#EDE9FE','#E0F2FE'], sortOrder: 1 },
    { title: 'Book With Confidence', subtitle: 'Schedule appointments and checkups in just a few taps.', icon: 'calendar-outline', gradient: ['#ECFDF5','#E0F2FE'], sortOrder: 2 },
    { title: 'Your Wellness Journey', subtitle: 'Track health metrics and earn rewards for staying healthy.', icon: 'trophy-outline', gradient: ['#FFF7ED','#FFF1F2'], sortOrder: 3 },
  ];
  for (const s of slides) await OnboardingSlide.findOneAndUpdate({ title: s.title }, s, { upsert: true });
  console.log('✓ Onboarding slides seeded');

  // ── Menu Items ──
  const menuItems = [
    { label: 'Home', icon: 'home-outline', route: 'MainTabs', section: 'dashboard', sortOrder: 1 },
    { label: 'Book Health Packages', icon: 'medkit-outline', route: 'Home', section: 'services', sortOrder: 2 },
    { label: 'Membership Plans', icon: 'ribbon-outline', route: 'Membership', section: 'services', sortOrder: 3 },
    { label: 'Insurance', icon: 'shield-checkmark-outline', route: 'Insurance', section: 'services', sortOrder: 4 },
    { label: 'Yoga Sessions', icon: 'leaf-outline', route: 'Home', section: 'services', sortOrder: 5 },
    { label: 'Blood Donation', icon: 'water-outline', route: 'Home', section: 'services', sortOrder: 6 },
    { label: 'Medical Records', icon: 'document-text-outline', route: 'Profile', section: 'records', sortOrder: 7 },
    { label: 'Patient Details', icon: 'person-outline', route: 'Profile', section: 'records', sortOrder: 8 },
    { label: 'Activity / History', icon: 'pulse-outline', route: 'Activity', section: 'records', sortOrder: 9 },
  ];
  for (const m of menuItems) await MenuItem.findOneAndUpdate({ label: m.label, section: m.section }, m, { upsert: true });
  console.log('✓ Menu items seeded');

  // ── Cities ──
  for (const state of STATES) {
    for (let j = 0; j < 3; j++) {
      const cityName = CITIES[(STATES.indexOf(state) + j) % CITIES.length];
      await City.findOneAndUpdate(
        { name: cityName, state },
        { name: cityName, state, district: cityName, type: 'city', isActive: true },
        { upsert: true },
      );
    }
  }
  console.log('✓ Cities seeded');

  // ── Rewards ──
  const rewards = [
    { title: 'Complete Profile', description: 'Fill in all profile details', points: 100, icon: 'person-outline', actionType: 'profile' },
    { title: 'Book First Appointment', description: 'Schedule your first health checkup', points: 250, icon: 'calendar-outline', actionType: 'booking' },
    { title: 'Refer a Friend', description: 'Invite friends to join VitalCare', points: 500, icon: 'people-outline', actionType: 'referral' },
    { title: 'Daily Check-in', description: 'Open the app daily', points: 10, icon: 'sunny-outline', actionType: 'daily' },
    { title: 'Write a Review', description: 'Share your experience', points: 50, icon: 'star-outline', actionType: 'other' },
  ];
  for (const r of rewards) await Reward.findOneAndUpdate({ title: r.title }, r, { upsert: true });
  console.log('✓ Rewards seeded');

  // ── FAQs ──
  const faqs = [
    { question: 'How do I book a health checkup?', answer: 'Browse packages on the home screen and tap Book Now to schedule.', category: 'booking' },
    { question: 'How do reward points work?', answer: 'Earn points by completing activities. Redeem them for discounts and benefits.', category: 'rewards' },
    { question: 'Can I cancel an appointment?', answer: 'Yes, go to Appointments and tap Cancel on any upcoming booking.', category: 'appointments' },
    { question: 'How do I connect my wallet?', answer: 'Go to Rewards and tap Connect to link your crypto wallet.', category: 'rewards' },
  ];
  for (const f of faqs) await FAQ.findOneAndUpdate({ question: f.question }, f, { upsert: true });
  console.log('✓ FAQs seeded');

  // ── Content Pages ──
  const pages = [
    { slug: 'about-us', title: 'About Us', content: 'VitalCare is a premium healthcare platform dedicated to elevating your wellness journey.' },
    { slug: 'privacy-policy', title: 'Privacy Policy', content: 'We respect your privacy and protect your personal health data with industry-standard encryption.' },
    { slug: 'terms-conditions', title: 'Terms & Conditions', content: 'By using VitalCare, you agree to our terms of service and community guidelines.' },
  ];
  for (const p of pages) await ContentPage.findOneAndUpdate({ slug: p.slug }, p, { upsert: true });
  console.log('✓ Content pages seeded');

  // ── Notifications ──
  const notifs = [
    { title: 'Welcome to VitalCare', body: 'Your health journey starts here. Explore our packages!', type: 'broadcast', targetRole: 'all', sentBy: createdAdmins[0]._id },
    { title: 'New Health Package', body: 'Check out our new Executive Checkup package with 72 tests.', type: 'push', targetRole: 'user', sentBy: createdAdmins[1]._id },
    { title: 'Reward Points Added', body: 'You earned 50 reward points for completing your profile.', type: 'push', targetRole: 'user', sentBy: createdAdmins[1]._id },
  ];
  for (const n of notifs) await Notification.create(n);
  console.log('✓ Notifications seeded');

  // ── Activity Logs ──
  const activities = [
    { action: 'USER_REGISTER', description: 'Test user registered', user: testUser._id },
    { action: 'USER_LOGIN', description: 'Admin logged in', user: createdAdmins[1]._id },
    { action: 'CONTENT_CREATED', description: 'Health packages seeded', user: createdAdmins[0]._id },
    { action: 'NOTIFICATION_SENT', description: 'Welcome broadcast sent', user: createdAdmins[0]._id },
    { action: 'FEEDBACK', description: 'User submitted feedback', user: testUser._id },
  ];
  for (const a of activities) await Activity.create(a);
  console.log('✓ Activity logs seeded');

  // ── Sample Appointments for test user ──
  const pkg = await HealthPackage.findOne({ name: 'Essential Wellness' });
  const spec = await Specialist.findOne({ name: 'Dr. Sharma' });
  if (pkg && spec) {
    await Appointment.findOneAndUpdate(
      { user: testUser._id, doctorName: 'Dr. Sharma' },
      { user: testUser._id, healthPackage: pkg._id, specialist: spec._id, doctorName: 'Dr. Sharma', specialty: 'Cardiologist', hospital: 'VitalCare Clinic', date: new Date(Date.now() + 7 * 86400000), time: '10:00 AM', status: 'upcoming' },
      { upsert: true },
    );
  }
  console.log('✓ Appointments seeded');

  // ── Reward Transactions for test user ──
  await RewardTransaction.create({ user: testUser._id, type: 'earn', points: 50, description: '50+ Reward Points added to your wallet' });
  console.log('✓ Reward transactions seeded');

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\nCredentials:');
  console.log('  Super Admin: superadmin@test.com / SuperAdmin@123');
  console.log('  Admin:       admin@test.com / Admin@123');
  console.log('  User:        user@test.com / User@123');
  process.exit(0);
};

seed().catch(err => { console.error('Seed failed:', err); process.exit(1); });
