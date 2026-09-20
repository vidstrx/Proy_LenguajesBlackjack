import { useRef, useState } from "react";
import type { Vista } from "../App";
import CartaComp from "../components/Carta";
import Ficha from "../components/Fichas";
import JuegoBlackjack, { type ResumenPartida } from "../core/JuegoBlackjack";
import { crearIdPartida, Historial, type RegistroPartida } from "../core/Historial";
import type { TipoEstrategia } from "../core/strategies/EstrategiaIA";
import { guardarPartidaRemota } from "../services/api";
import blueChip from "../assets/blue poker chip.png";
import redChip from "../assets/red poker chip.png";
import greenChip from "../assets/green poker chip.png";
import blackChip from "../assets/black poker chip.png";
import purpleChip from "../assets/purple poker chip.png";
import "./ModoHumano.css";

interface Props {
  navegar: (view: Vista) => void;
}

const fichas = [
  { valor: 1, img: blueChip },
  { valor: 5, img: redChip },
  { valor: 25, img: greenChip },
  { valor: 100, img: blackChip },
  { valor: 500, img: purpleChip },
];

export default function ModoHumano({ navegar }: Props) {
  const juego = useRef(new JuegoBlackjack());
  const historial = useRef(new Historial());
  const [resumen, setResumen] = useState<ResumenPartida>(juego.current.getResumen());
  const [estrategia, setEstrategia] = useState<TipoEstrategia>("fija");
  const [error, setError] = useState("");

  const aplicar = (accion: () => ResumenPartida) => {
    try {
      setError("");
      const anterior = resumen.estado;
      const siguiente = accion();
      setResumen(siguiente);

      if (anterior !== "TERMINADA" && siguiente.estado === "TERMINADA" && siguiente.resultado) {
        const registro: RegistroPartida = {
          id: crearIdPartida(),
          fecha: new Date().toISOString(),
          modo: "humano",
          estrategia: siguiente.estrategia,
          resultado: siguiente.resultado,
          puntajeJugador: siguiente.puntajeJugador,
          puntajeDealer: siguiente.puntajeDealer,
          apuesta: siguiente.apuesta,
          billetera: siguiente.billetera,
          decisionesIA: [...siguiente.decisionesIA],
        };
        historial.current.agregar(registro);
        void guardarPartidaRemota(registro);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo completar la acción");
    }
  };

  const activa = resumen.estado === "JUGADOR";
  const terminada = resumen.estado === "TERMINADA";

  return (
    <section className="mesa-page">
      <header className="barra-superior">
        <button className="boton boton--pequeno" onClick={() => navegar("inicio")}>← Menú</button>
        <div>
          <span>Saldo</span>
          <strong>${resumen.billetera.toFixed(2)}</strong>
        </div>
        <label>
          Estrategia del dealer
          <select value={estrategia} onChange={(e) => setEstrategia(e.target.value as TipoEstrategia)} disabled={activa}>
            <option value="fija">Regla fija</option>
            <option value="probabilistica">Probabilidad</option>
          </select>
        </label>
      </header>

      <div className="mesa">
        <div className="zona-mano zona-mano--dealer">
          <div className="etiqueta-mano">
            <span>DEALER · {resumen.estrategia === "fija" ? "REGLA FIJA" : "PROBABILIDAD"}</span>
            {resumen.cartasDealer.length > 0 && <strong>{resumen.puntajeDealer}</strong>}
          </div>
          <div className="cartas">
            {resumen.cartasDealer.map((carta, index) => (
              <CartaComp key={`${carta.palo}-${carta.valor}-${index}`} carta={carta} mostrar={index !== 1 || resumen.mostrarCartaOculta} />
            ))}
          </div>
        </div>

        <div className={`estado estado--${resumen.resultado ?? "activo"}`} role="status">
          <span>{resumen.mensaje}</span>
          {resumen.apuesta > 0 && <small>Apuesta: ${resumen.apuesta}</small>}
        </div>

        <div className="zona-mano zona-mano--jugador">
          <div className="cartas">
            {resumen.cartasJugador.map((carta, index) => (
              <CartaComp key={`${carta.palo}-${carta.valor}-${index}`} carta={carta} />
            ))}
          </div>
          <div className="etiqueta-mano">
            <span>JUGADOR</span>
            {resumen.cartasJugador.length > 0 && <strong>{resumen.puntajeJugador}</strong>}
          </div>
        </div>
      </div>

      {error && <p className="alerta">{error}</p>}

      <div className="controles-juego">
        {resumen.estado === "APUESTA" && (
          <div className="selector-apuesta">
            <p>Elige una ficha para iniciar</p>
            <div className="fichas">
              {fichas.map((ficha) => (
                <Ficha
                  key={ficha.valor}
                  {...ficha}
                  deshabilitado={ficha.valor > resumen.billetera}
                  onSelect={(valor) => aplicar(() => juego.current.iniciarPartida(valor, estrategia))}
                />
              ))}
            </div>
          </div>
        )}

        {activa && (
          <div className="acciones">
            <button className="boton boton--principal" onClick={() => aplicar(() => juego.current.pedirCarta())}>Pedir</button>
            <button className="boton" onClick={() => aplicar(() => juego.current.plantarse())}>Plantarse</button>
            <button className="boton" disabled={!resumen.puedeDoblar} onClick={() => aplicar(() => juego.current.doblar())}>Doblar</button>
          </div>
        )}

        {terminada && (
          <div className="acciones acciones--fin">
            <button className="boton boton--principal" onClick={() => aplicar(() => juego.current.prepararSiguiente())}>Nueva partida</button>
            <button className="boton" onClick={() => navegar("estadisticas")}>Ver historial</button>
          </div>
        )}
      </div>

      {terminada && resumen.decisionesIA.length > 0 && (
        <details className="decisiones">
          <summary>Decisiones tomadas por la IA</summary>
          <ol>{resumen.decisionesIA.map((decision, i) => <li key={`${decision}-${i}`}>{decision}</li>)}</ol>
        </details>
      )}
    </section>
  );
}

