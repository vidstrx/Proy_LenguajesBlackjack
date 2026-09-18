import Carta from './Carta';

export class Mano {
  public cartas: Carta[] = [];

  public agregarCarta(carta: Carta): void {
    this.cartas.push(carta);
  }

  public limpiar(): void {
    this.cartas = [];
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
        total += parseInt(String(v), 10);
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
}

export default Mano;