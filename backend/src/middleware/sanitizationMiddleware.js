// Strip HTML tags and dangerous characters recursively
function sanitizeValue(value) {
  if (typeof value === 'string') {
    // Basic HTML tag stripping
    return value
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .replace(/javascript:/gi, '') // Strip javascript: URIs
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === 'object') {
    const sanitized = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        sanitized[key] = sanitizeValue(value[key]);
      }
    }
    return sanitized;
  }
  return value;
}

function sanitizationMiddleware(req, res, next) {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  next();
}

module.exports = { sanitizationMiddleware };
