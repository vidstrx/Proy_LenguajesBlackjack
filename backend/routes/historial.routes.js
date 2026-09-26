const { Router } = require('express');
const router = Router();

const { getHistorial, crearPartida } = require('../controllers/historial.controller');

router.get('/', getHistorial);
router.post('/', crearPartida);

module.exports = router;