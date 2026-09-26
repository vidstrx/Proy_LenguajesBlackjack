export const registrarPartida = async (
    modo: string, 
    resultado: string, 
    puntajeJugador: number, 
    puntajeDealer: number, 
    apuesta: number
) => {
    try {
        const respuesta = await fetch('http://localhost:3000/api/historial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                modo,     
                jugador: 'Jugador',
                resultado, 
                puntajeJugador,
                puntajeDealer,
                apuesta
            }),
        });

        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error('Error al conectar con el servidor para guardar la partida:', error);
        return { success: false, error };
    }
};