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
    return Appointment.create({ ...data, user: userId, status: 'pending' });
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

module.exports = { appointmentService, rewardService };
