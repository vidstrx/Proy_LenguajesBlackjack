import Carta from "./Carta";

class Mazo{

    private mazo: Carta[] = [];
    private mazoDict: Record<(string | number), number> = {}; // para contar las cartas en el mazo
    constructor(){
        this.create();
        this.shuffle();
    }

    create(): void {
        const valores: (string | number)[] = ["A",2,3,4,5,6,7,8,9,10,"J","K","Q"];
        const palos: (string)[] = ["heart", "spade", "diamond","club"];
        for (let i = 0; i < valores.length; i++) {
            for (let j = 0; j < palos.length; j++) {
                this.mazo.push(new Carta(valores[i],palos[j]));
                this.mazoDict[valores[i]] = (j+1); // agregando la cantidad de cartas (A: 4, 2: 4, ...)
            }
        }
    }

    shuffle(): void {
        for (let i = this.mazo.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [this.mazo[i], this.mazo[j]] = [this.mazo[j], this.mazo[i]]; 
        } 
    }

    getMazo(): Carta[] {
        return this.mazo;
    }

    // esto es util para la estrategia de probabilidad
    actualizarMazoDict(valor:(string | number)) {
        this.mazoDict[valor] -= 1;
    }

    getMazoDict(): Record<(string | number), number> {
        return this.mazoDict;
    }
}

export default Mazo