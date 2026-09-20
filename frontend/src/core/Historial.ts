import type { ResultadoPartida } from "./JuegoBlackjack";
import type { TipoEstrategia } from "./strategies/EstrategiaIA";

export interface RegistroPartida {
  id: string;
  fecha: string;
  modo: "humano" | "simulacion";
  estrategia: TipoEstrategia;
  resultado: ResultadoPartida;
  puntajeJugador: number;
  puntajeDealer: number;
  apuesta: number;
  billetera: number;
  decisionesIA: string[];
}

const CLAVE = "blackjack.historial.v1";

export class Historial {
  obtener(): RegistroPartida[] {
    if (typeof localStorage === "undefined") return [];
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE) ?? "[]") as unknown;
      return Array.isArray(datos) ? datos as RegistroPartida[] : [];
    } catch {
      return [];
    }
  }

  agregar(registro: RegistroPartida): RegistroPartida[] {
    const actualizado = [registro, ...this.obtener()].slice(0, 100);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(CLAVE, JSON.stringify(actualizado));
    }
    return actualizado;
  }

  limpiar(): void {
    if (typeof localStorage !== "undefined") localStorage.removeItem(CLAVE);
  }
}

export const crearIdPartida = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

