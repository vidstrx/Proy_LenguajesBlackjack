require('dotenv').config();
const { connectDB } = require('./config/db');
const Score = require('./models/score.model');

// Datos de prueba que solicitaste
const testScores = [
    { username: 'alejandro', score: 0 },
    { username: 'maria', score: 200 },
    { username: 'david', score: 100 }
];

const pruebaDB = async () => {
    try {
        // 1. Conectamos a la base de datos usando tu configuración existente
        await connectDB();

        // 2.  Borramos registros anteriores para evitar duplicados si lo ejecutas varias veces
        await Score.deleteMany({});
        console.log('🗑️ Registros anteriores eliminados.');

        // 3. Insertamos los nuevos datos de prueba
        const result = await Score.insertMany(testScores);
        console.log('✅ ¡Datos de prueba guardados exitosamente!');
        console.log(result);

        // 4. Cerramos el proceso con éxito
        process.exit(0);

    } catch (error) {
        console.error('❌ Error al poblar la base de datos:', error);
        process.exit(1);
    }
};

// Ejecutamos la función
pruebaDB();