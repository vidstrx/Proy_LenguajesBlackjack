const Score = require('../models/score.model');

/**
 * Obtiene todos los puntajes registrados ya ordenados
 */
const getScores = async (req, res) => {
  try {
    // Buscamos todos y los ordenamos por fecha descendiente
    const scores = await Score.find().sort({ date: -1 }).limit(50);

    return res.status(200).json({
      success: true,
      count: scores.length,
      data: scores
    });
  } catch (error) {
    console.error('Error al listar los scores:', error);
    return res.status(500).json({
      success: false,
      message: "Error interno al obtener los registros",
      error: error.message
    });
  }
};

/**
 * Obtiene el puntaje más reciente de un usuario específico.
 */
const getUserScore = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "El parámetro username es requerido."
      });
    }

    const scoreData = await Score.findOne({ username }).sort({ date: -1 });

    if (!scoreData) {
      return res.status(404).json({
        success: false,
        message: `No se encontró ningún registro para el usuario: ${username}`
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        username: scoreData.username,
        score: scoreData.score,
        date: scoreData.date
      }
    });

  } catch (error) {
    console.error(`Error al obtener el score de ${req.params.username}:`, error);
    return res.status(500).json({
      success: false,
      message: "Error interno al procesar la solicitud",
      error: error.message
    });
  }
};

module.exports = {
  getScores,
  getUserScore
};