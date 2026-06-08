/**
 * Generic paginated list query builder for Mongoose models
 */
const buildListQuery = (Model, { page = 1, limit = 20, search, sort = '-createdAt', ...filters }) => {
  const query = {};
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== '' && val !== 'all') {
      if (key === 'isActive') query[key] = val === 'true' || val === true;
      else query[key] = val;
    }
  });
  if (search) {
    const textFields = Object.keys(Model.schema.paths).filter(
      p => Model.schema.paths[p].instance === 'String' && !p.includes('.'),
    );
    if (textFields.length) {
      query.$or = textFields.slice(0, 5).map(f => ({ [f]: { $regex: search, $options: 'i' } }));
    }
  }
  const skip = (Math.max(1, page) - 1) * limit;
  return { query, skip, limit: Math.min(100, limit), sort };
};

const paginate = async (Model, opts, populate = '') => {
  const { query, skip, limit, sort } = buildListQuery(Model, opts);
  const [items, total] = await Promise.all([
    Model.find(query).populate(populate).sort(sort).skip(skip).limit(limit),
    Model.countDocuments(query),
  ]);
  return {
    items,
    pagination: { page: +opts.page || 1, limit, total, pages: Math.ceil(total / limit) },
  };
};

module.exports = { buildListQuery, paginate };
