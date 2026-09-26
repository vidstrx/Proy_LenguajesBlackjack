const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const historialRoutes = require('./routes/historial.routes');

app.use('/api/historial', historialRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

module.exports = app;