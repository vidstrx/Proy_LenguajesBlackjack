const { Router } = require('express');
const { createGame, getGames, getStats } = require('../controllers/games.controller');

const router = Router();
router.get('/', getGames);
router.get('/stats', getStats);
router.post('/', createGame);

module.exports = router;

