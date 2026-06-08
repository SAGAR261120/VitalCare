const normalizePhone = (phone) => {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  return phone.startsWith('+') ? phone : `+${digits}`;
};

const buildPhoneQuery = (phone) => {
  const normalized = normalizePhone(phone);
  const ten = normalized.replace(/\D/g, '').slice(-10);
  return {
    $or: [
      { phone: normalized },
      { phone: `+91${ten}` },
      { phone: ten },
      { phone: `91${ten}` },
    ],
  };
};

module.exports = { normalizePhone, buildPhoneQuery };
