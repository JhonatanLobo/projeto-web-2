import { isWeekday } from '../utils/request-logs.js';

export function createWeekdayAccessMiddleware() {
  return (req, res, next) => {
    if (!isWeekday()) {
      return res.status(403).json({
        erro: 'A API só está disponível de segunda a sexta-feira.',
      });
    }

    return next();
  };
}
