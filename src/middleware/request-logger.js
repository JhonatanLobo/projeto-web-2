import { formatFortalezaTimestamp } from '../core/request-logs.js';

export function createRequestLogger(logs, { clock = () => new Date() } = {}) {
  return (req, res, next) => {
    logs.push({
      timestamp: formatFortalezaTimestamp(clock()),
      method: req.method,
      path: req.path,
    });

    next();
  };
}
