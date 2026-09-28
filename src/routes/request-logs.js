import { Router } from 'express';
import { filterLogsByDate, isValidDateParam } from '../utils/request-logs.js';

export function createRequestLogsRouter(logs) {
  const router = Router();

  router.get('/', (req, res) => {
    const { data } = req.query;

    if (!isValidDateParam(data)) {
      return res.status(400).json({
        erro: 'Informe uma data válida no formato YYYY-MM-DD.',
      });
    }

    return res.json(filterLogsByDate(logs, data));
  });

  return router;
}
