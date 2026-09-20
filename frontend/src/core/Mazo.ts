import Carta, { type Palo, type ValorCarta } from "./Carta";

export type ConteoCartas = Record<string, number>;

const VALORES: ValorCarta[] = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
const PALOS: Palo[] = ["heart", "spade", "diamond", "club"];

class Mazo {
  private cartas: Carta[] = [];
  private conteoNoVistas: ConteoCartas = {};
  private cartasVistas = new Set<Carta>();

  constructor() {
    this.reiniciar();
  }

  reiniciar(): void {
    this.cartas = [];
    this.conteoNoVistas = {};
    this.cartasVistas.clear();

    for (const valor of VALORES) {
      this.conteoNoVistas[String(valor)] = 4;
      for (const palo of PALOS) this.cartas.push(new Carta(valor, palo));
    }
    this.shuffle();
  }

  shuffle(): void {
    for (let i = this.cartas.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
    }
  }

  sacarCarta(esVisible = true): Carta {
    const carta = this.cartas.pop();
    if (!carta) throw new Error("El mazo no tiene cartas disponibles");
    if (esVisible) this.marcarComoVista(carta);
    return carta;
  }

  marcarComoVista(carta: Carta): void {
    if (this.cartasVistas.has(carta)) return;
    const clave = String(carta.valor);
    this.conteoNoVistas[clave] = Math.max(0, (this.conteoNoVistas[clave] ?? 0) - 1);
    this.cartasVistas.add(carta);
  }

  getCantidadRestante(): number {
    return this.cartas.length;
  }

  getMazoDict(): ConteoCartas {
    return { ...this.conteoNoVistas };
  }

  /** Compatibilidad temporal con el código anterior. */
  getMazo(): readonly Carta[] {
    return this.cartas;
  }

  /** Compatibilidad temporal; el motor nuevo usa marcarComoVista. */
  actualizarMazoDict(valor: string | number): void {
    const clave = String(valor);
    this.conteoNoVistas[clave] = Math.max(0, (this.conteoNoVistas[clave] ?? 0) - 1);
  }
}

export default Mazo;
