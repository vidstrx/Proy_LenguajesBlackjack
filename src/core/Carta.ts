class Carta {
    
    valor: (string | number);
    palo: string;

    constructor(valor: (string | number), palo: string) {
        this.valor = valor;
        this.palo = palo;
    }
}

export default Carta;