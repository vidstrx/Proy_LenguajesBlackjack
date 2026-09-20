import { describe, expect, it } from "vitest";
import Carta from "./Carta";
import Mano from "./Mano";
import Mazo from "./Mazo";
import JuegoBlackjack from "./JuegoBlackjack";
import { Simulador } from "./Simulador";
import { EstrategiaFija } from "./strategies/EstrategiaFija";
import { EstrategiaProbabilidad } from "./strategies/EstrategiaProbabilidad";

describe("Mano", () => {
  it("convierte ases de 11 a 1 cuando es necesario", () => {
    const mano = new Mano([
      new Carta("A", "heart"),
      new Carta("A", "spade"),
      new Carta(9, "club"),
    ]);
    expect(mano.calcularPuntaje()).toBe(21);
    expect(mano.estaSePaso()).toBe(false);
  });

  it("detecta blackjack solamente con dos cartas", () => {
    expect(new Mano([new Carta("A", "heart"), new Carta(10, "club")]).esBlackjack()).toBe(true);
    expect(new Mano([new Carta(7, "heart"), new Carta(7, "club"), new Carta(7, "spade")]).esBlackjack()).toBe(false);
  });
});

describe("Mazo", () => {
  it("entrega 52 cartas únicas y luego se agota", () => {
    const mazo = new Mazo();
    const cartas = Array.from({ length: 52 }, () => mazo.sacarCarta());
    expect(new Set(cartas.map(c => `${c.valor}-${c.palo}`)).size).toBe(52);
    expect(mazo.getCantidadRestante()).toBe(0);
    expect(() => mazo.sacarCarta()).toThrow(/no tiene cartas/i);
  });
});

describe("Estrategias", () => {
  it("la fija pide con 16 y se planta con 17", () => {
    const estrategia = new EstrategiaFija();
    expect(estrategia.decidir(new Mano([new Carta(10, "heart"), new Carta(6, "club")]), {})).toBe("PEDIR");
    expect(estrategia.decidir(new Mano([new Carta(10, "heart"), new Carta(7, "club")]), {})).toBe("PLANTARSE");
  });

  it("la probabilística responde al conteo real de cartas no vistas", () => {
    const estrategia = new EstrategiaProbabilidad(0.45);
    const mano = new Mano([new Carta(10, "heart"), new Carta(6, "club")]);
    expect(estrategia.decidir(mano, { 2: 4, 3: 4, 4: 4, 5: 4, 10: 1 })).toBe("PEDIR");
    expect(estrategia.decidir(mano, { 2: 1, 3: 1, 10: 20, J: 4, Q: 4, K: 4 })).toBe("PLANTARSE");
  });
});

describe("Juego y simulación", () => {
  it("una partida iniciada siempre puede llegar a estado terminado", () => {
    const juego = new JuegoBlackjack(1000);
    let estado = juego.iniciarPartida(25, "fija");
    while (estado.estado === "JUGADOR") estado = juego.pedirCarta();
    expect(estado.estado).toBe("TERMINADA");
    expect(estado.resultado).not.toBeNull();
  });

  it("las métricas suman el total de partidas", () => {
    const resultado = new Simulador().simular(100, "probabilistica");
    expect(resultado.victorias + resultado.derrotas + resultado.empates).toBe(100);
    expect(resultado.porcentajeVictorias + resultado.porcentajeDerrotas + resultado.porcentajeEmpates).toBeCloseTo(100, 1);
  });
});

