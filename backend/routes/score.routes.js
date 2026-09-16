const { Router } = require('express');
const router = Router();

// Importamos el controlador de scores
const { getScores, getUserScore } = require('../controllers/scores.controller');

// Definimos las rutas de forma pública y directa
router.get('/search', getScores);
router.get('/:username', getUserScore);

module.exports = router;