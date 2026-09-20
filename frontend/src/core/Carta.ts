export type ValorCarta = "A" | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "J" | "Q" | "K";
export type Palo = "heart" | "spade" | "diamond" | "club";

class Carta {
  constructor(
    public readonly valor: ValorCarta,
    public readonly palo: Palo,
  ) {}

  getValorNumerico(): number {
    if (this.valor === "A") return 11;
    if (this.valor === "J" || this.valor === "Q" || this.valor === "K") return 10;
    return this.valor;
  }
}

export default Carta;
