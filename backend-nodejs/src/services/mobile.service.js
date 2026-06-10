const Appointment = require('../models/Appointment');
const RewardTransaction = require('../models/RewardTransaction');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const createCrudService = require('../utils/crudFactory');

const appointmentService = {
  ...createCrudService(Appointment, { searchFields: ['doctorName', 'hospital'] }),

  listForUser: async (userId, opts = {}) => {
    const page = +opts.page || 1;
    const limit = Math.min(50, +opts.limit || 20);
    const skip = (page - 1) * limit;
    const query = { user: userId };
    if (opts.status) query.status = opts.status;

    const [items, total] = await Promise.all([
      Appointment.find(query)
        .populate('healthPackage', 'name price')
        .populate('specialist', 'name specialty')
        .sort('-date')
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(query),
    ]);
    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },

  book: async (userId, data) => {
    if (!data.healthPackage && !data.specialist) {
      throw new AppError('A health package or specialist is required', 400);
    }
    if (data.healthPackage) {
      const HealthPackage = require('../models/HealthPackage');
      const pkg = await HealthPackage.findOne({ _id: data.healthPackage, isActive: true });
      if (!pkg) throw new AppError('Health package not found or inactive', 404);
      data.doctorName = data.doctorName || pkg.name;
      data.specialty = data.specialty || 'Health Package';
    }
    const appointmentDate = new Date(data.date);
    if (Number.isNaN(appointmentDate.getTime())) {
      throw new AppError('Invalid appointment date', 400);
    }
    return Appointment.create({
      ...data,
      date: appointmentDate,
      user: userId,
      status: 'upcoming',
    });
  },
};

const rewardService = {
  getUserRewards: async userId => {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    const transactions = await RewardTransaction.find({ user: userId })
      .sort('-createdAt')
      .limit(20);
    return {
      points: user.rewardPoints,
      tier: user.membershipTier,
      walletConnected: !!user.walletAddress,
      walletAddress: user.walletAddress,
      transactions,
    };
  },

  addPoints: async (userId, points, description, type = 'earn') => {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    user.rewardPoints += points;
    if (user.rewardPoints >= 5000) user.membershipTier = 'Gold';
    else if (user.rewardPoints >= 2000) user.membershipTier = 'Silver';
    await user.save();
    await RewardTransaction.create({ user: userId, type, points, description });
    return { points: user.rewardPoints, tier: user.membershipTier };
  },

  withdraw: async (userId, points) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    if (points > user.rewardPoints) throw new AppError('Insufficient points', 400);
    if (!user.walletAddress) throw new AppError('Wallet not connected', 400);
    user.rewardPoints -= points;
    await user.save();
    await RewardTransaction.create({
      user: userId,
      type: 'withdraw',
      points: -points,
      description: `Withdrew ${points} points`,
      status: 'pending',
    });
    return { points: user.rewardPoints };
  },

  connectWallet: async (userId, address) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    user.walletAddress = address;
    await user.save();
    return { walletAddress: address };
  },
};

const InsuranceSubmission = require('../models/InsuranceSubmission');

const insuranceSubmissionService = {
  listForUser: async (userId, opts = {}) => {
    const query = { user: userId };
    if (opts.type) query.type = opts.type;
    const items = await InsuranceSubmission.find(query)
      .sort('-createdAt')
      .limit(50);
    return { items };
  },

  submit: async (userId, data) => {
    if (!data.type || !['requirement', 'upload'].includes(data.type)) {
      throw new AppError('Invalid submission type', 400);
    }
    if (data.type === 'requirement') {
      if (!data.insuranceCompany || !data.mobileNumber) {
        throw new AppError('Insurance company and mobile number are required', 400);
      }
    }
    if (data.type === 'upload' && !data.documentUrl && !data.policyName) {
      throw new AppError('Policy name or document is required', 400);
    }
    return InsuranceSubmission.create({ ...data, user: userId, status: 'pending' });
  },
};

module.exports = { appointmentService, rewardService, insuranceSubmissionService };
