const test = require('node:test');
const assert = require('node:assert/strict');
const Game = require('../models/game.model');
const { normalizeGame } = require('../controllers/games.controller');

test('normaliza una partida enviada por el frontend', () => {
  const normalized = normalizeGame({
    id: 'abc', modo: 'humano', estrategia: 'fija', resultado: 'victoria',
    puntajeJugador: 20, puntajeDealer: 18, apuesta: 25, billetera: 1025,
    decisionesIA: ['PEDIR (12)', 'PLANTARSE (18)'], fecha: '2026-09-20T00:00:00.000Z',
  });
  assert.equal(normalized.clientId, 'abc');
  assert.equal(normalized.playerScore, 20);
  assert.equal(normalized.strategy, 'fija');
});

test('rechaza una estrategia desconocida', async () => {
  const game = new Game({
    clientId: 'bad', strategy: 'inventada', result: 'victoria', playerScore: 20, dealerScore: 18,
  });
  await assert.rejects(game.validate(), /strategy/);
});

