const express = require('express');
const cors = require('cors');

// Importar las rutas de scores
const scoreRoutes = require('./routes/score.routes');
const gameRoutes = require('./routes/game.routes');

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ success: true, service: 'blackjack-api' });
});

// definicion de la ruta base para los scores
app.use('/api/scores', scoreRoutes);
app.use('/api/games', gameRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

module.exports = app;
