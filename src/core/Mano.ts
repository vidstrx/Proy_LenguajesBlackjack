import Carta from './Carta';

export class Mano {
  public cartas: Carta[] = [];

  // Agregar una carta robada a la mano
  public agregarCarta(carta: Carta): void {
    this.cartas.push(carta);
  }

  // Vaciar la mano para volver a jugar
  public limpiar(): void {
    this.cartas = [];
  }

  // Calcular la puntuación respetando las reglas de Blackjack (As = 11 o 1)
  public calcularPuntaje(): number {
    let total = 0;
    let ases = 0;

    for (const carta of this.cartas) {
      const v = carta.valor; // Lee directamente 'valor' de tu clase Carta

      if (v === 'A') {
        ases += 1;
        total += 11;
      } else if (v === 'J' || v === 'Q' || v === 'K') {
        total += 10;
      } else {
        total += parseInt(String(v), 10);
      }
    }

    // Si nos pasamos de 21, reducimos el valor de los Ases de 11 a 1
    while (total > 21 && ases > 0) {
      total -= 10;
      ases -= 1;
    }

    return total;
  }

  // Saber si se pasó de 21
  public estaSePaso(): boolean {
    return this.calcularPuntaje() > 21;
  }
}