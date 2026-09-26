const Game = require('../models/game.model');

const normalizeGame = (body) => ({
  clientId: body.id,
  mode: body.modo,
  strategy: body.estrategia,
  result: body.resultado,
  playerScore: body.puntajeJugador,
  dealerScore: body.puntajeDealer,
  bet: body.apuesta,
  wallet: body.billetera,
  aiDecisions: body.decisionesIA,
  playedAt: body.fecha,
});

const createGame = async (req, res, next) => {
  if (!req.body || typeof req.body.id !== 'string' || req.body.id.trim() === '') {
    return res.status(400).json({ success: false, message: 'El campo id de la partida es requerido' });
  }
  try {
    const game = await Game.findOneAndUpdate(
      { clientId: req.body.id },
      normalizeGame(req.body),
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return res.status(201).json({ success: true, data: game });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Datos de partida inválidos', errors: error.errors });
    }
    return next(error);
  }
};

const getGames = async (req, res, next) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;
    const games = await Game.find().sort({ playedAt: -1 }).limit(limit).lean();
    return res.json({ success: true, count: games.length, data: games });
  } catch (error) {
    return next(error);
  }
};

const getStats = async (_req, res, next) => {
  try {
    const rows = await Game.aggregate([
      { $group: { _id: { strategy: '$strategy', result: '$result' }, count: { $sum: 1 } } },
      { $sort: { '_id.strategy': 1, '_id.result': 1 } },
    ]);
    return res.json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createGame, getGames, getStats, normalizeGame };

