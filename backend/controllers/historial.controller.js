const Historial = require('../models/historial.model');

// Obtener todas las partidas o filtradas por modo de juego
const getHistorial = async (req, res) => {
    try {
        const { modo } = req.query;
        let filtro = {};

        // Si se envía un modo específico y no es 'todos', filtramos por él
        if (modo && modo !== 'todos') {
            filtro.modo = modo;
        }

        const partidas = await Historial.find(filtro).sort({ fecha: -1 }).limit(100);

        return res.status(200).json({
            success: true,
            count: partidas.length,
            data: partidas
        });
    } catch (error) {
        console.error('Error al obtener el historial de partidas:', error);
        return res.status(500).json({
            success: false,
            message: "Error interno al obtener el historial",
            error: error.message
        });
    }
};

// Guardar una nueva partida en MongoDB
const crearPartida = async (req, res) => {
    try {
        const { modo, jugador, resultado, puntajeJugador, puntajeDealer, apuesta } = req.body;

        if (!modo || !resultado || puntajeJugador === undefined || puntajeDealer === undefined) {
            return res.status(400).json({
                success: false,
                message: "Faltan campos obligatorios para registrar la partida."
            });
        }

        const nuevaPartida = new Historial({
            modo,
            jugador: jugador || 'Jugador',
            resultado,
            puntajeJugador,
            puntajeDealer,
            apuesta: apuesta || 0
        });

        const partidaGuardada = await nuevaPartida.save();

        return res.status(201).json({
            success: true,
            message: "Partida guardada correctamente en MongoDB",
            data: partidaGuardada
        });
    } catch (error) {
        console.error('Error al guardar la partida:', error);
        return res.status(500).json({
            success: false,
            message: "Error interno al guardar la partida",
            error: error.message
        });
    }
};

module.exports = {
    getHistorial,
    crearPartida
};