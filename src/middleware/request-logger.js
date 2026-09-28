import { formatFortalezaTimestamp } from '../utils/request-logs.js';

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
