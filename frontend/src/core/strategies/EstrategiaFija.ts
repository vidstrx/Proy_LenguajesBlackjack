import type { Mano } from "../Mano";
import type { ConteoCartas } from "../Mazo";
import type { DecisionIA, EstrategiaIA } from "./EstrategiaIA";

export class EstrategiaFija implements EstrategiaIA {
  readonly nombre = "fija" as const;

  constructor(private readonly umbral = 17) {}

  decidir(mano: Mano, _cartasNoVistas: ConteoCartas): DecisionIA {
    return mano.calcularPuntaje() < this.umbral ? "PEDIR" : "PLANTARSE";
  }
}

