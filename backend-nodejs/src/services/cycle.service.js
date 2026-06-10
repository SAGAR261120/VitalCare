const CycleProfile = require('../models/CycleProfile');
const CycleLog = require('../models/CycleLog');
const CycleWellnessTip = require('../models/CycleWellnessTip');
const AppError = require('../utils/AppError');

const MS_DAY = 86400000;

const startOfDay = d => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return startOfDay(d);
};

const diffDays = (a, b) => Math.round((startOfDay(a) - startOfDay(b)) / MS_DAY);

const formatDate = d => startOfDay(d).toISOString().split('T')[0];

const computeInsights = (profile, logs = []) => {
  const cycleLength = profile?.cycleLength || 28;
  const periodLength = profile?.periodLength || 5;
  const today = startOfDay(new Date());

  let lastStart = profile?.lastPeriodStart ? startOfDay(profile.lastPeriodStart) : null;
  if (!lastStart && logs.length) {
    const latest = logs.find(l => l.type === 'period');
    if (latest) lastStart = startOfDay(latest.startDate);
  }

  if (!lastStart) {
    return {
      cycleDay: 1,
      daysLeft: cycleLength,
      nextPeriodDate: formatDate(addDays(today, cycleLength)),
      ovulationDate: formatDate(addDays(today, cycleLength - 14)),
      fertileStart: formatDate(addDays(today, cycleLength - 19)),
      fertileEnd: formatDate(addDays(today, cycleLength - 13)),
      cycleLength,
      periodLength,
      averagePeriod: periodLength,
    };
  }

  const daysSince = diffDays(today, lastStart);
  const cyclesPassed = Math.floor(daysSince / cycleLength);
  const cycleDay = (daysSince % cycleLength) + 1;
  const nextStart = addDays(lastStart, (cyclesPassed + 1) * cycleLength);
  const daysLeft = Math.max(0, diffDays(nextStart, today));
  const ovulation = addDays(nextStart, -14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);

  const periodLogs = logs.filter(l => l.type === 'period' && l.endDate);
  let averagePeriod = periodLength;
  if (periodLogs.length) {
    const durations = periodLogs.map(l => diffDays(l.endDate, l.startDate) + 1);
    averagePeriod = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
  }

  return {
    cycleDay,
    daysLeft,
    nextPeriodDate: formatDate(nextStart),
    ovulationDate: formatDate(ovulation),
    fertileStart: formatDate(fertileStart),
    fertileEnd: formatDate(fertileEnd),
    cycleLength,
    periodLength,
    averagePeriod,
  };
};

const cycleService = {
  getProfile: async userId => {
    const profile = await CycleProfile.findOne({ user: userId });
    return profile;
  },

  upsertProfile: async (userId, data) => {
    const payload = { ...data, user: userId };
    if (payload.setupComplete === undefined && payload.lastPeriodStart) {
      payload.setupComplete = true;
    }
    const profile = await CycleProfile.findOneAndUpdate(
      { user: userId },
      { $set: payload },
      { new: true, upsert: true, runValidators: true },
    );
    return profile;
  },

  getDashboard: async userId => {
    const [profile, logs, tip] = await Promise.all([
      CycleProfile.findOne({ user: userId }),
      CycleLog.find({ user: userId }).sort('-startDate').limit(50),
      CycleWellnessTip.findOne({ isActive: true }).sort('sortOrder'),
    ]);

    const insights = computeInsights(profile, logs);

    return {
      profile,
      insights,
      logs,
      wellnessTip: tip,
      setupRequired: !profile?.setupComplete,
    };
  },

  listLogs: async (userId, opts = {}) => {
    const query = { user: userId };
    if (opts.type && opts.type !== 'all') query.type = opts.type;
    const page = +opts.page || 1;
    const limit = Math.min(50, +opts.limit || 20);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      CycleLog.find(query).sort('-startDate').skip(skip).limit(limit),
      CycleLog.countDocuments(query),
    ]);

    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },

  createLog: async (userId, data) => {
    const startDate = new Date(data.startDate);
    if (Number.isNaN(startDate.getTime())) throw new AppError('Invalid start date', 400);

    let endDate;
    if (data.endDate) {
      endDate = new Date(data.endDate);
      if (Number.isNaN(endDate.getTime())) throw new AppError('Invalid end date', 400);
    } else if (data.type === 'period') {
      const profile = await CycleProfile.findOne({ user: userId });
      const len = data.periodLength || profile?.periodLength || 5;
      endDate = addDays(startDate, len - 1);
    }

    const log = await CycleLog.create({
      user: userId,
      type: data.type || 'period',
      startDate,
      endDate,
      flow: data.flow,
      symptoms: data.symptoms || [],
      regularity: data.regularity,
      notes: data.notes,
    });

    if (data.type === 'period' || !data.type) {
      await CycleProfile.findOneAndUpdate(
        { user: userId },
        { $set: { lastPeriodStart: startDate, setupComplete: true } },
        { upsert: true },
      );
    }

    return log;
  },

  updateLog: async (userId, logId, data) => {
    const log = await CycleLog.findOne({ _id: logId, user: userId });
    if (!log) throw new AppError('Log not found', 404);

    if (data.startDate) log.startDate = new Date(data.startDate);
    if (data.endDate) log.endDate = new Date(data.endDate);
    if (data.flow !== undefined) log.flow = data.flow;
    if (data.symptoms) log.symptoms = data.symptoms;
    if (data.regularity !== undefined) log.regularity = data.regularity;
    if (data.notes !== undefined) log.notes = data.notes;
    if (data.type) log.type = data.type;

    await log.save();
    return log;
  },

  deleteLog: async (userId, logId) => {
    const log = await CycleLog.findOneAndDelete({ _id: logId, user: userId });
    if (!log) throw new AppError('Log not found', 404);
    return { message: 'Deleted' };
  },

  getRandomTip: async () => {
    const tips = await CycleWellnessTip.find({ isActive: true }).sort('sortOrder');
    if (!tips.length) return null;
    const idx = Math.floor(Math.random() * tips.length);
    return tips[idx];
  },
};

module.exports = { cycleService, computeInsights };
