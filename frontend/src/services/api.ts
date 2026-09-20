import type { RegistroPartida } from "../core/Historial";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export async function guardarPartidaRemota(partida: RegistroPartida): Promise<void> {
  try {
    const respuesta = await fetch(`${API_URL}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partida),
    });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  } catch {
    // El historial local sigue funcionando si el backend no está disponible.
  }
}

