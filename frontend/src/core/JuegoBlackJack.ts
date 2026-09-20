import IA from "./IA";
import Jugador from "./Jugador";
import Mano from "./Mano";
import Mazo from "./Mazo";
import type Carta from "./Carta";
import type { TipoEstrategia } from "./strategies/EstrategiaIA";

export type EstadoPartida = "APUESTA" | "JUGADOR" | "TERMINADA";
export type ResultadoPartida = "victoria" | "derrota" | "empate";

export interface ResumenPartida {
  estado: EstadoPartida;
  cartasJugador: readonly Carta[];
  cartasDealer: readonly Carta[];
  puntajeJugador: number;
  puntajeDealer: number;
  mostrarCartaOculta: boolean;
  apuesta: number;
  billetera: number;
  resultado: ResultadoPartida | null;
  mensaje: string;
  estrategia: TipoEstrategia;
  decisionesIA: readonly string[];
  puedeDoblar: boolean;
}

class JuegoBlackjack {
  private mazo = new Mazo();
  private jugador = new Jugador(new Mano());
  private dealer = new IA(new Mano());
  private estado: EstadoPartida = "APUESTA";
  private resultado: ResultadoPartida | null = null;
  private mensaje = "Seleccione una ficha para comenzar";
  private apuesta = 0;
  private estrategia: TipoEstrategia = "fija";
  private cartaOcultaRevelada = false;
  private decisionesIA: string[] = [];

  constructor(private billetera = 10000) {}

  iniciarPartida(apuesta: number, estrategia: TipoEstrategia): ResumenPartida {
    if (this.estado === "JUGADOR") throw new Error("La partida actual todavía no termina");
    if (!Number.isFinite(apuesta) || apuesta <= 0) throw new Error("La apuesta debe ser mayor que cero");
    if (apuesta > this.billetera) throw new Error("Saldo insuficiente para esa apuesta");

    this.mazo = new Mazo();
    this.jugador = new Jugador(new Mano());
    this.dealer = new IA(new Mano());
    this.apuesta = apuesta;
    this.estrategia = estrategia;
    this.cartaOcultaRevelada = false;
    this.decisionesIA = [];
    this.resultado = null;
    this.mensaje = "Tu turno";
    this.estado = "JUGADOR";

    this.jugador.getMano().agregarCarta(this.mazo.sacarCarta(true));
    this.dealer.getMano().agregarCarta(this.mazo.sacarCarta(true));
    this.jugador.getMano().agregarCarta(this.mazo.sacarCarta(true));
    this.dealer.getMano().agregarCarta(this.mazo.sacarCarta(false));

    this.resolverBlackjackInicial();
    return this.getResumen();
  }

  pedirCarta(): ResumenPartida {
    this.validarTurnoJugador();
    this.jugador.getMano().agregarCarta(this.mazo.sacarCarta(true));

    if (this.jugador.getMano().estaSePaso()) {
      this.finalizar("derrota", "Te pasaste de 21. Gana el dealer");
    } else if (this.jugador.getMano().calcularPuntaje() === 21) {
      this.plantarse();
    } else {
      this.mensaje = "Puedes pedir otra carta o plantarte";
    }
    return this.getResumen();
  }

  plantarse(): ResumenPartida {
    this.validarTurnoJugador();
    this.revelarCartaOculta();
    this.jugarTurnoDealer();
    this.evaluarGanador();
    return this.getResumen();
  }

  doblar(): ResumenPartida {
    this.validarTurnoJugador();
    if (!this.puedeDoblar()) throw new Error("Solo puedes doblar con dos cartas y saldo suficiente");

    this.apuesta *= 2;
    this.jugador.getMano().agregarCarta(this.mazo.sacarCarta(true));
    if (this.jugador.getMano().estaSePaso()) {
      this.finalizar("derrota", "Te pasaste después de doblar. Gana el dealer");
      return this.getResumen();
    }
    return this.plantarse();
  }

  prepararSiguiente(): ResumenPartida {
    if (this.estado !== "TERMINADA") return this.getResumen();
    this.estado = "APUESTA";
    this.apuesta = 0;
    this.resultado = null;
    this.mensaje = "Seleccione una ficha para comenzar";
    this.jugador = new Jugador(new Mano());
    this.dealer = new IA(new Mano());
    this.decisionesIA = [];
    this.cartaOcultaRevelada = false;
    return this.getResumen();
  }

  getResumen(): ResumenPartida {
    return {
      estado: this.estado,
      cartasJugador: [...this.jugador.getMano().getCartas()],
      cartasDealer: [...this.dealer.getMano().getCartas()],
      puntajeJugador: this.jugador.getMano().calcularPuntaje(),
      puntajeDealer: this.cartaOcultaRevelada
        ? this.dealer.getMano().calcularPuntaje()
        : this.dealer.getMano().getCartas()[0]?.getValorNumerico() ?? 0,
      mostrarCartaOculta: this.cartaOcultaRevelada,
      apuesta: this.apuesta,
      billetera: this.billetera,
      resultado: this.resultado,
      mensaje: this.mensaje,
      estrategia: this.estrategia,
      decisionesIA: [...this.decisionesIA],
      puedeDoblar: this.puedeDoblar(),
    };
  }

  private validarTurnoJugador(): void {
    if (this.estado !== "JUGADOR") throw new Error("No hay una partida activa");
  }

  private puedeDoblar(): boolean {
    return this.estado === "JUGADOR"
      && this.jugador.getMano().getCartas().length === 2
      && this.apuesta * 2 <= this.billetera;
  }

  private resolverBlackjackInicial(): void {
    const blackjackJugador = this.jugador.getMano().esBlackjack();
    const blackjackDealer = this.dealer.getMano().esBlackjack();
    if (!blackjackJugador && !blackjackDealer) return;

    this.revelarCartaOculta();
    if (blackjackJugador && blackjackDealer) {
      this.finalizar("empate", "Ambos tienen Blackjack: empate");
    } else if (blackjackJugador) {
      this.finalizar("victoria", "¡Blackjack! Ganaste", 1.5);
    } else {
      this.finalizar("derrota", "Blackjack del dealer");
    }
  }

  private revelarCartaOculta(): void {
    if (this.cartaOcultaRevelada) return;
    const cartaOculta = this.dealer.getMano().getCartas()[1];
    if (cartaOculta) this.mazo.marcarComoVista(cartaOculta);
    this.cartaOcultaRevelada = true;
  }

  private jugarTurnoDealer(): void {
    while (!this.dealer.getMano().estaSePaso()) {
      const decision = this.dealer.decidir(this.estrategia, this.mazo.getMazoDict());
      this.decisionesIA.push(`${decision} (${this.dealer.getMano().calcularPuntaje()})`);
      if (decision === "PLANTARSE") break;
      this.dealer.getMano().agregarCarta(this.mazo.sacarCarta(true));
    }
  }

  private evaluarGanador(): void {
    const jugador = this.jugador.getMano().calcularPuntaje();
    const dealer = this.dealer.getMano().calcularPuntaje();

    if (dealer > 21) this.finalizar("victoria", "El dealer se pasó. ¡Ganaste!");
    else if (jugador > dealer) this.finalizar("victoria", "¡Ganaste la partida!");
    else if (dealer > jugador) this.finalizar("derrota", "Gana el dealer");
    else this.finalizar("empate", "Empate: recuperas tu apuesta");
  }

  private finalizar(resultado: ResultadoPartida, mensaje: string, multiplicador = 1): void {
    if (this.estado === "TERMINADA") return;
    this.revelarCartaOculta();
    this.resultado = resultado;
    this.mensaje = mensaje;
    this.estado = "TERMINADA";
    if (resultado === "victoria") this.billetera += this.apuesta * multiplicador;
    if (resultado === "derrota") this.billetera -= this.apuesta;
  }
}

export default JuegoBlackjack;

