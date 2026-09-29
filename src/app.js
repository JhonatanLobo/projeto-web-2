import express from 'express';
import { createGamesStore } from './data/games-store.js';
import { createRequestLogger } from './middleware/request-logger.js';
import { createWeekdayAccessMiddleware } from './middleware/weekday-access.js';
import { createGamesRouter } from './routes/games.js';
import { createRequestLogsRouter } from './routes/request-logs.js';

export function createApp() {
  const app = express();
  const games = createGamesStore();
  const requestLogs = [];

  app.use(createRequestLogger(requestLogs));
  app.use(createWeekdayAccessMiddleware());
  app.use(express.json());

  app.use('/jogos', createGamesRouter(games));
  app.use('/requisicoes', createRequestLogsRouter(requestLogs));

  app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada.' });
  });

  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ erro: 'O corpo da requisição contém JSON inválido.' });
    }

    return res.status(500).json({ erro: 'Ocorreu um erro interno.' });
  });

  return app;
}

const app = createApp();
export default app;