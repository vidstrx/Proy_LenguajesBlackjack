const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
    modo: {
        type: String,
        required: true,
        enum: ['humano', 'ia-facil', 'ia-dificil', 'ia-avanzada'] // Modos de juego de humano y IA
    },
    resultado: {
        type: String,
        required: true,
        enum: ['victoria', 'derrota', 'empate', 'blackjack']
    },
    puntajeJugador: {
        type: Number,
        required: true
    },
    puntajeDealer: {
        type: Number,
        required: true
    },
    apuesta: {
        type: Number,
        default: 0
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    collection: 'historialPartidas'
});

module.exports = mongoose.model('Historial', historialSchema);