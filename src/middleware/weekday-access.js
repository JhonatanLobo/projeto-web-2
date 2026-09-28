import { isWeekday } from '../core/request-logs.js';

export function createWeekdayAccessMiddleware({ clock = () => new Date() } = {}) {
  return (req, res, next) => {
    if (!isWeekday(clock())) {
      return res.status(403).json({
        erro: 'A API só está disponível de segunda a sexta-feira.',
      });
    }

    return next();
  };
}
