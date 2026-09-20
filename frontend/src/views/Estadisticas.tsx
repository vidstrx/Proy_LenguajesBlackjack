import { useMemo, useState } from "react";
import type { Vista } from "../App";
import { Historial, type RegistroPartida } from "../core/Historial";
import "./Estadisticas.css";

interface Props {
  navegar: (view: Vista) => void;
}

export default function Estadisticas({ navegar }: Props) {
  const historial = useMemo(() => new Historial(), []);
  const [partidas, setPartidas] = useState<RegistroPartida[]>(() => historial.obtener());
  const victorias = partidas.filter(p => p.resultado === "victoria").length;
  const derrotas = partidas.filter(p => p.resultado === "derrota").length;
  const empates = partidas.filter(p => p.resultado === "empate").length;

  const limpiar = () => {
    historial.limpiar();
    setPartidas([]);
  };

  return (
    <section className="estadisticas-page">
      <header className="encabezado-pagina">
        <button className="boton boton--pequeno" onClick={() => navegar("inicio")}>← Menú</button>
        <div>
          <p className="eyebrow">Sesión actual</p>
          <h1>Historial de partidas</h1>
          <p>Resultados y decisiones tomadas por el dealer.</p>
        </div>
      </header>

      <div className="tarjetas-resumen">
        <article><span>Partidas</span><strong>{partidas.length}</strong></article>
        <article className="positivo"><span>Victorias</span><strong>{victorias}</strong></article>
        <article className="negativo"><span>Derrotas</span><strong>{derrotas}</strong></article>
        <article><span>Empates</span><strong>{empates}</strong></article>
      </div>

      {partidas.length === 0 ? (
        <div className="vacio">
          <h2>Aún no hay partidas registradas</h2>
          <p>Juega una ronda y el resultado aparecerá aquí.</p>
          <button className="boton boton--principal" onClick={() => navegar("modoHumano")}>Jugar ahora</button>
        </div>
      ) : (
        <>
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Estrategia</th><th>Jugador</th><th>Dealer</th><th>Resultado</th><th>Decisiones IA</th></tr></thead>
              <tbody>
                {partidas.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.fecha).toLocaleString()}</td>
                    <td>{p.estrategia === "fija" ? "Fija" : "Probabilidad"}</td>
                    <td>{p.puntajeJugador}</td>
                    <td>{p.puntajeDealer}</td>
                    <td><span className={`resultado-tag ${p.resultado}`}>{p.resultado}</span></td>
                    <td>{p.decisionesIA.join(" · ") || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="boton boton--peligro" onClick={limpiar}>Limpiar historial</button>
        </>
      )}
    </section>
  );
}

