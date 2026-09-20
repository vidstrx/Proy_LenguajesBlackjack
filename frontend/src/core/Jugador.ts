import type { Mano } from "./Mano";

class Jugador {
    protected mano: Mano;

    constructor(mano: Mano) {
        this.mano = mano;
    }

    getMano(): Mano {
        return this.mano;
    }
}
export default Jugador;
