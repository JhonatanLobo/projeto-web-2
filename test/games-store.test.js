import test from 'node:test';
import assert from 'node:assert/strict';
import { createGamesStore, validateGameInput } from '../src/data/games-store.js';

test('catalog generates sequential codes and does not reuse deleted codes', () => {
  const store = createGamesStore();
  const first = store.create({ title: 'Hades', price: 49.9, genre: 'Ação' });

  assert.equal(first.valid, true);
  assert.equal(first.game.code, 'G001');
  assert.equal(store.deleteByCode('G001'), true);

  const second = store.create({ title: 'Celeste', price: 24.5, genre: 'Plataforma' });
  assert.equal(second.game.code, 'G002');
  assert.equal(createGamesStore().create({ title: 'Jogo', price: 0, genre: 'Indie' }).game.code, 'G001');
});

test('catalog ignores client code and unsupported fields', () => {
  const store = createGamesStore();
  const result = store.create({
    code: 'CUSTOM',
    title: 'Hades',
    price: 49.9,
    genre: 'Ação',
    publisher: 'Supergiant',
  });

  assert.deepEqual(result.game, {
    code: 'G001',
    title: 'Hades',
    price: 49.9,
    genre: 'Ação',
  });
});

test('game input trims required text and accepts BRL prices to cents', () => {
  assert.deepEqual(validateGameInput({ title: '  Hades  ', price: 49.9, genre: '  Ação ' }), {
    valid: true,
    value: { title: 'Hades', price: 49.9, genre: 'Ação' },
  });
});

test('game input rejects blank fields, non-numeric prices, and more than two decimals', () => {
  for (const input of [
    { title: ' ', price: 10, genre: 'Ação' },
    { title: 'Jogo', price: 10, genre: ' ' },
    { title: 'Jogo', price: '10', genre: 'Ação' },
    { title: 'Jogo', price: -1, genre: 'Ação' },
    { title: 'Jogo', price: 1.234, genre: 'Ação' },
    null,
  ]) {
    assert.equal(validateGameInput(input).valid, false);
  }
});
