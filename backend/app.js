const express = require('express');
const cors = require('cors');

// Importar las rutas de scores
const scoreRoutes = require('./routes/score.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// definicion de la ruta base para los scores
app.use('/api/scores', scoreRoutes);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;