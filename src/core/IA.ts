import Jugador from "./Jugador";
import type { Mano } from "./Mano";

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
    estrategiaFija(limite:number = 16) : boolean {
        return super.getMano().calcularPuntaje() <= limite;
    }

    /**
     * Estrategia por probabilidad que cuenta las cartas restantes que lo podrian hacer bustear, si la probabilidad es baja pide, si es alta NO pide
     * @param cartasRestantes - el diccionario de la cantidad de cartas restantes del mazo
     * @param limite - (opcional) el porcentaje que deseamos que tome como medida para pedir o no pedir carta
     * @returns true - si el valor de su mano es menor al limite, false si es mayor
     */
    estrategiaPorProbabilidad(cartasRestantes: Record<(string | number), number>, limite: number = 0.6): boolean {
        const valorActual = super.getMano().calcularPuntaje();

        // si su puntaje es mayor o igual a 21 no pide
        if (valorActual >= 21) 
            return false;

        const margenBust = 21 - valorActual;
        let cartasQueMeHacenPerder = 0;
        let cantidadCartas = 0;

        for (const [valor, cantidad] of Object.entries(cartasRestantes)) {
            let valorDeCarta = 0;
            if (valor === 'J' || valor === 'Q' || valor === 'K') {
                valorDeCarta = 10;
            } else if (valor === 'A') {
                valorDeCarta = 1;
            } else {
                valorDeCarta = Number(valor);
            }

            // si el valor de la carta es mayor al margenBust, significa que esa carta me hara bustear
            if (valorDeCarta > margenBust){
                cartasQueMeHacenPerder += cantidad; // suma las cartas que lo haran bustear dentro de la cantidad de cartas que no han salido
            }
            cantidadCartas += cantidad // sumar la cantidad de cartas restantes del mazo
        }
        console.log(cartasQueMeHacenPerder/cantidadCartas);
        return (cartasQueMeHacenPerder/cantidadCartas) <= limite; // si es menor o igual al limite que pongamos, pedira carta
    }
}

export default IA;