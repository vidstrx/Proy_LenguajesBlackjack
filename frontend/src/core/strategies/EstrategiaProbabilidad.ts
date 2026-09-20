import Carta, { type ValorCarta } from "../Carta";
import type { Mano } from "../Mano";
import type { ConteoCartas } from "../Mazo";
import type { DecisionIA, EstrategiaIA } from "./EstrategiaIA";

const convertirValor = (valor: string): ValorCarta => {
  if (valor === "A" || valor === "J" || valor === "Q" || valor === "K") return valor;
  return Number(valor) as ValorCarta;
};

export class EstrategiaProbabilidad implements EstrategiaIA {
  readonly nombre = "probabilistica" as const;

  constructor(private readonly limiteBust = 0.45) {}

  calcularProbabilidadBust(mano: Mano, cartasNoVistas: ConteoCartas): number {
    let peligrosas = 0;
    let total = 0;

    for (const [valor, cantidad] of Object.entries(cartasNoVistas)) {
      if (cantidad <= 0) continue;
      const cartaHipotetica = new Carta(convertirValor(valor), "spade");
      if (mano.calcularPuntajeCon(cartaHipotetica) > 21) peligrosas += cantidad;
      total += cantidad;
    }

    return total === 0 ? 1 : peligrosas / total;
  }

  decidir(mano: Mano, cartasNoVistas: ConteoCartas): DecisionIA {
    const puntaje = mano.calcularPuntaje();
    if (puntaje >= 21) return "PLANTARSE";
    if (puntaje <= 11) return "PEDIR";
    return this.calcularProbabilidadBust(mano, cartasNoVistas) <= this.limiteBust
      ? "PEDIR"
      : "PLANTARSE";
  }
}

