import Carta from "./Carta";

export class Mano {
  private cartas: Carta[];

  constructor(cartas: Carta[] = []) {
    this.cartas = [...cartas];
  }

  public agregarCarta(carta: Carta): void {
    this.cartas.push(carta);
  }

  public limpiar(): void {
    this.cartas = [];
  }

  public getCartas(): readonly Carta[] {
    return this.cartas;
  }

  public calcularPuntaje(): number {
    let total = 0;
    let ases = 0;

    for (const carta of this.cartas) {
      const v = carta.valor;

      if (v === 'A') {
        ases += 1;
        total += 11;
      } else if (v === 'J' || v === 'Q' || v === 'K') {
        total += 10;
      } else {
        total += v;
      }
    }

    // si se pasa de 21, reducimos el valor de los Ases de 11 a 1
    while (total > 21 && ases > 0) {
      total -= 10;
      ases -= 1;
    }

    return total;
  }

  public estaSePaso(): boolean {
    return this.calcularPuntaje() > 21;
  }

  public esBlackjack(): boolean {
    return this.cartas.length === 2 && this.calcularPuntaje() === 21;
  }

  public calcularPuntajeCon(carta: Carta): number {
    return new Mano([...this.cartas, carta]).calcularPuntaje();
  }
}

export default Mano;
