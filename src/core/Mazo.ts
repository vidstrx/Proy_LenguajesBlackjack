import Carta from "./Carta";

class Mazo{

    mazo: Carta[] = [];
    constructor(){
        this.create();
        this.shuffle();
    }

    create(): void {
        const valores: (string | number)[] = ["as",2,3,4,5,6,7,8,9,10,"j","k","q"];
        const palos: (string)[] = ["heart", "spade", "diamond","club"];
        for (let i = 0; i < valores.length; i++) {
            for (let j = 0; j < palos.length; j++) {
                this.mazo.push(new Carta(valores[i],palos[j]));
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
}

export default Mazo