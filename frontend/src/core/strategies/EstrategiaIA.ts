import type { Mano } from "../Mano";
import type { ConteoCartas } from "../Mazo";

export type DecisionIA = "PEDIR" | "PLANTARSE";
export type TipoEstrategia = "fija" | "probabilistica";

export interface EstrategiaIA {
  readonly nombre: TipoEstrategia;
  decidir(mano: Mano, cartasNoVistas: ConteoCartas): DecisionIA;
}

