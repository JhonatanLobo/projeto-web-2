export function validateGameInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, message: 'O corpo da requisição deve ser um objeto JSON.' };
  }

  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const genre = typeof input.genre === 'string' ? input.genre.trim() : '';

  if (!title) {
    return { valid: false, message: 'O título é obrigatório.' };
  }

  if (!genre) {
    return { valid: false, message: 'O gênero é obrigatório.' };
  }

  if (
    typeof input.price !== 'number'
    || !Number.isFinite(input.price)
    || input.price < 0
    || Number(input.price.toFixed(2)) !== input.price
  ) {
    return {
      valid: false,
      message: 'O preço deve ser um número não negativo com até duas casas decimais.',
    };
  }

  return {
    valid: true,
    value: { title, price: input.price, genre },
  };
}

export function createGamesStore() {
  const games = [];
  let nextCode = 1;

  return {
    list() {
      return games;
    },

    findByCode(code) {
      return games.find((game) => game.code === code);
    },

    create(input) {
      const validation = validateGameInput(input);

      if (!validation.valid) {
        return validation;
      }

      const game = {
        code: `G${String(nextCode).padStart(3, '0')}`,
        ...validation.value,
      };

      nextCode += 1;
      games.push(game);

      return { valid: true, game };
    },

    deleteByCode(code) {
      const index = games.findIndex((game) => game.code === code);

      if (index === -1) {
        return false;
      }

      games.splice(index, 1);
      return true;
    },
  };
}
