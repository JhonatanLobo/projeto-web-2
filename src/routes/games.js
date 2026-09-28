import { Router } from 'express';

export function createGamesRouter(store) {
  const router = Router();

  router.get('/', (req, res) => {
    res.json(store.list());
  });

  router.post('/', (req, res) => {
    const result = store.create(req.body);

    if (!result.valid) {
      return res.status(400).json({ erro: result.message });
    }

    return res.status(201).json(result.game);
  });

  router.get('/:codigo', (req, res) => {
    const game = store.findByCode(req.params.codigo);

    if (!game) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    return res.json(game);
  });

  router.delete('/:codigo', (req, res) => {
    if (!store.deleteByCode(req.params.codigo)) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    return res.status(204).end();
  });

  return router;
}
