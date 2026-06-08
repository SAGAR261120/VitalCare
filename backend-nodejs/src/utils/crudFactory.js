const AppError = require('./AppError');

/**
 * Factory for standard CRUD service operations on a Mongoose model
 */
const createCrudService = (Model, { searchFields = [], publicFilter = { isActive: true } } = {}) => ({
  list: async (opts = {}, isPublic = false) => {
    const page = +opts.page || 1;
    const limit = Math.min(100, +opts.limit || 20);
    const skip = (page - 1) * limit;
    const query = isPublic ? { ...publicFilter } : {};

    if (opts.isActive !== undefined && !isPublic) query.isActive = opts.isActive === 'true';
    if (opts.category) query.category = opts.category;
    if (opts.placement) query.placement = opts.placement;
    if (opts.section) query.section = opts.section;
    if (opts.status) query.status = opts.status;
    if (opts.user) query.user = opts.user;

    if (opts.search && searchFields.length) {
      query.$or = searchFields.map(f => ({ [f]: { $regex: opts.search, $options: 'i' } }));
    }

    const sort = opts.sort || 'sortOrder -createdAt';
    const [items, total] = await Promise.all([
      Model.find(query).sort(sort).skip(skip).limit(limit),
      Model.countDocuments(query),
    ]);
    return { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },

  getById: async id => {
    const item = await Model.findById(id);
    if (!item) throw new AppError('Resource not found', 404, 'NOT_FOUND');
    return item;
  },

  create: async data => Model.create(data),

  update: async (id, data) => {
    const item = await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!item) throw new AppError('Resource not found', 404, 'NOT_FOUND');
    return item;
  },

  remove: async id => {
    const item = await Model.findByIdAndDelete(id);
    if (!item) throw new AppError('Resource not found', 404, 'NOT_FOUND');
    return { message: 'Deleted successfully' };
  },

  toggleStatus: async id => {
    const item = await Model.findById(id);
    if (!item) throw new AppError('Resource not found', 404, 'NOT_FOUND');
    if (item.isActive !== undefined) item.isActive = !item.isActive;
    await item.save();
    return item;
  },
});

module.exports = createCrudService;
