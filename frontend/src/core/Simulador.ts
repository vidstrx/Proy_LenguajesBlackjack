import IA from "./IA";
import Mano from "./Mano";
import Mazo from "./Mazo";
import type { ResultadoPartida } from "./JuegoBlackJack";
import type { TipoEstrategia } from "./strategies/EstrategiaIA";

export interface ResultadoSimulacion {
  estrategia: TipoEstrategia;
  partidas: number;
  victorias: number;
  derrotas: number;
  empates: number;
  porcentajeVictorias: number;
  porcentajeDerrotas: number;
  porcentajeEmpates: number;
}

const porcentaje = (cantidad: number, total: number): number =>
  Number(((cantidad / total) * 100).toFixed(2));

export class Simulador {
  simular(cantidad: number, estrategia: TipoEstrategia): ResultadoSimulacion {
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 100000) {
      throw new Error("La cantidad debe estar entre 1 y 100000 partidas");
    }

    const conteo: Record<ResultadoPartida, number> = { victoria: 0, derrota: 0, empate: 0 };
    for (let i = 0; i < cantidad; i += 1) {
      conteo[this.jugarPartida(estrategia)] += 1;
    }

    return {
      estrategia,
      partidas: cantidad,
      victorias: conteo.victoria,
      derrotas: conteo.derrota,
      empates: conteo.empate,
      porcentajeVictorias: porcentaje(conteo.victoria, cantidad),
      porcentajeDerrotas: porcentaje(conteo.derrota, cantidad),
      porcentajeEmpates: porcentaje(conteo.empate, cantidad),
    };
  }

  private jugarPartida(estrategia: TipoEstrategia): ResultadoPartida {
    const mazo = new Mazo();
    const jugador = new IA(new Mano());
    const dealer = new IA(new Mano());

    jugador.getMano().agregarCarta(mazo.sacarCarta(true));
    dealer.getMano().agregarCarta(mazo.sacarCarta(true));
    jugador.getMano().agregarCarta(mazo.sacarCarta(true));
    dealer.getMano().agregarCarta(mazo.sacarCarta(false));

    const blackjackJugador = jugador.getMano().esBlackjack();
    const blackjackDealer = dealer.getMano().esBlackjack();
    if (blackjackJugador || blackjackDealer) {
      if (blackjackJugador && blackjackDealer) return "empate";
      return blackjackJugador ? "victoria" : "derrota";
    }

    while (jugador.decidir(estrategia, mazo.getMazoDict()) === "PEDIR") {
      jugador.getMano().agregarCarta(mazo.sacarCarta(true));
      if (jugador.getMano().estaSePaso()) return "derrota";
    }

    const cartaOculta = dealer.getMano().getCartas()[1];
    if (cartaOculta) mazo.marcarComoVista(cartaOculta);
    while (dealer.decidir("fija", mazo.getMazoDict()) === "PEDIR") {
      dealer.getMano().agregarCarta(mazo.sacarCarta(true));
    }

    const puntosJugador = jugador.getMano().calcularPuntaje();
    const puntosDealer = dealer.getMano().calcularPuntaje();
    if (puntosDealer > 21 || puntosJugador > puntosDealer) return "victoria";
    if (puntosDealer > puntosJugador) return "derrota";
    return "empate";
  }
}

