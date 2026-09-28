import { formatFortalezaTimestamp } from '../utils/date-utils.js';

export function createRequestLogger(logs) {
  return (req, res, next) => {
    logs.push({
      timestamp: formatFortalezaTimestamp(),
      method: req.method,
      path: req.path,
    });

    next();
  };
}
