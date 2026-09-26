import { useState } from "react";
import type { Vista } from "../App";
import { Simulador, type ResultadoSimulacion } from "../core/Simulador";
import "./ModoSimulacion.css";

interface Props {
  navegar: (view: Vista) => void;
}

export default function ModoSimulacion({ navegar }: Props) {
  const [cantidad, setCantidad] = useState(1000);
  const [resultados, setResultados] = useState<ResultadoSimulacion[]>([]);
  const [ejecutando, setEjecutando] = useState(false);

  const comparar = () => {
    setEjecutando(true);
    window.setTimeout(() => {
      const simulador = new Simulador();
      setResultados([
        simulador.simular(cantidad, "fija"),
        simulador.simular(cantidad, "probabilistica"),
      ]);
      setEjecutando(false);
    }, 20);
  };

  const mejor = resultados.length === 2
    ? resultados.reduce((a, b) => a.porcentajeVictorias >= b.porcentajeVictorias ? a : b)
    : null;

  return (
    <section className="simulacion-page">
      <header className="encabezado-pagina">
        <button className="boton boton--pequeno" onClick={() => navegar("inicio")}>← Menú</button>
        <div>
          <p className="eyebrow">Laboratorio de IA</p>
          <h1 style={{paddingTop: '2%', paddingBottom: '3%'}} >Comparar estrategias</h1>
          <p>Cada estrategia juega la misma cantidad de partidas contra un dealer con regla fija.</p>
        </div>
      </header>

      <div className="panel-simulacion">
        <div>
          <span className="label">Partidas por estrategia</span>
          <div className="cantidades">
            {[100, 500, 1000].map((valor) => (
              <button key={valor} className={cantidad === valor ? "seleccionado" : ""} onClick={() => setCantidad(valor)}>{valor}</button>
            ))}
          </div>
        </div>
        <button className="boton boton--principal" onClick={comparar} disabled={ejecutando}>
          {ejecutando ? "Simulando…" : "Comparar ahora"}
        </button>
      </div>

      {resultados.length > 0 && (
        <>
          <div className="resumen-ganador">
            <span>Mejor tasa de victoria en esta muestra</span>
            <strong>{mejor?.estrategia === "fija" ? "Regla fija" : "Probabilística"} · {mejor?.porcentajeVictorias}%</strong>
          </div>
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Métrica</th><th>Regla fija</th><th>Probabilística</th></tr></thead>
              <tbody>
                <tr><td>Partidas</td>{resultados.map(r => <td key={`${r.estrategia}-p`}>{r.partidas}</td>)}</tr>
                <tr><td>Victorias</td>{resultados.map(r => <td key={`${r.estrategia}-v`}>{r.victorias} <small>{r.porcentajeVictorias}%</small></td>)}</tr>
                <tr><td>Derrotas</td>{resultados.map(r => <td key={`${r.estrategia}-d`}>{r.derrotas} <small>{r.porcentajeDerrotas}%</small></td>)}</tr>
                <tr><td>Empates</td>{resultados.map(r => <td key={`${r.estrategia}-e`}>{r.empates} <small>{r.porcentajeEmpates}%</small></td>)}</tr>
              </tbody>
            </table>
          </div>
          <p className="nota-simulacion">Los resultados cambian en cada ejecución porque el mazo se mezcla de forma aleatoria en cada partida.</p>
        </>
      )}
    </section>
  );
}

