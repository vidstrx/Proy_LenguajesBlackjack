import React, { useEffect, useState } from 'react';

interface Partida {
    _id: string;
    modo: string;
    resultado: string;
    puntajeJugador: number;
    puntajeDealer: number;
    apuesta: number;
    ganancia: number;
    fecha: string;
}

export const HistorialPartidas: React.FC<{ onVolver: () => void }> = ({ onVolver }) => {
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [filtroModo, setFiltroModo] = useState<string>('todos');
    const [cargando, setCargando] = useState<boolean>(true);

    const fetchHistorial = async (modo: string) => {
        setCargando(true);
        try {
            const url = modo === 'todos'
                ? 'http://localhost:3000/api/historial'
                : `http://localhost:3000/api/historial?modo=${modo}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setPartidas(data.data);
            }
        } catch (error) {
            console.error('Error al cargar el historial:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchHistorial(filtroModo);
    }, [filtroModo]);

    return (
        <div className="historial-container" style={{ padding: '20px', color: '#fff', background: '#111', minHeight: '100vh' }}>
            <h2>Estadísticas e Historial de Partidas</h2>

            {/* Botones de Filtro */}
            <div className="filtros-menu" style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                <button onClick={() => setFiltroModo('todos')} style={{ background: filtroModo === 'todos' ? '#d4af37' : '#333', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer' }}>Todos</button>
                <button onClick={() => setFiltroModo('humano')} style={{ background: filtroModo === 'humano' ? '#d4af37' : '#333', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer' }}>Modo Humano</button>
                <button onClick={() => setFiltroModo('ia-facil')} style={{ background: filtroModo === 'ia-facil' ? '#d4af37' : '#333', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer' }}>IA Facil</button>
                <button onClick={() => setFiltroModo('ia-dificil')} style={{ background: filtroModo === 'ia-dificil' ? '#d4af37' : '#333', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer' }}>IA Dificil</button>
                <button onClick={onVolver} style={{ marginLeft: 'auto', background: '#555', color: '#fff', padding: '8px 16px', border: 'none', cursor: 'pointer' }}>Volver</button>
            </div>

            {cargando ? (
                <p>Cargando registros...</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #d4af37' }}>
                            <th style={{ padding: '10px' }}>Modo</th>
                            <th style={{ padding: '10px' }}>Resultado</th>
                            <th style={{ padding: '10px' }}>Pts Jugador</th>
                            <th style={{ padding: '10px' }}>Pts Dealer</th>
                            <th style={{ padding: '10px' }}>Apuesta</th>
                            <th style={{ padding: '10px' }}>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partidas.length > 0 ? (
                            partidas.map((p) => (
                                <tr key={p._id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '10px' }}>{p.modo}</td>
                                    <td style={{ padding: '10px' }}>{p.resultado.toUpperCase()}</td>
                                    <td style={{ padding: '10px' }}>{p.puntajeJugador}</td>
                                    <td style={{ padding: '10px' }}>{p.puntajeDealer}</td>
                                    <td style={{ padding: '10px' }}>${p.apuesta}</td>
                                    <td style={{ padding: '10px' }}>{new Date(p.fecha).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No hay partidas registradas con este filtro.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};