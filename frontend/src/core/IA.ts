import Jugador from "./Jugador";
import type { Mano } from "./Mano";
import type { ConteoCartas } from "./Mazo";
import { EstrategiaFija } from "./strategies/EstrategiaFija";
import { EstrategiaProbabilidad } from "./strategies/EstrategiaProbabilidad";
import type { DecisionIA, TipoEstrategia } from "./strategies/EstrategiaIA";

// clase que hereda de Jugador
class IA extends Jugador {

    constructor(mano:Mano) {
        super(mano);
    }

    /**
     * Regla fija para pedir carta, pide si es menor o igual al limite
     * @param limite - (opcional) es el valor que se pone para pedir o no carta, por defecto es 16
     * @returns true - si el valor de su mano es menor al limite, false si es mayor
     */
    estrategiaFija(limite:number = 17) : boolean {
        return new EstrategiaFija(limite).decidir(this.getMano(), {}) === "PEDIR";
    }

    /**
     * Estrategia por probabilidad que cuenta las cartas restantes que lo podrian hacer bustear, si la probabilidad es baja pide, si es alta NO pide
     * @param cartasRestantes - el diccionario de la cantidad de cartas restantes del mazo
     * @param limite - (opcional) el porcentaje que deseamos que tome como medida para pedir o no pedir carta
     * @returns true - si el valor de su mano es menor al limite, false si es mayor
     */
    estrategiaPorProbabilidad(cartasRestantes: ConteoCartas, limite = 0.45): boolean {
        return new EstrategiaProbabilidad(limite).decidir(this.getMano(), cartasRestantes) === "PEDIR";
    }

    decidir(tipo: TipoEstrategia, cartasRestantes: ConteoCartas): DecisionIA {
        const estrategia = tipo === "fija" ? new EstrategiaFija() : new EstrategiaProbabilidad();
        return estrategia.decidir(this.getMano(), cartasRestantes);
    }
}

export default IA;
