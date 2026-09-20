import { useState } from "react";
import "./App.css";
import Inicio from "./views/Inicio";
import ModoHumano from "./views/ModoHumano";
import ModoSimulacion from "./views/ModoSimulacion";
import Estadisticas from "./views/Estadisticas";

export type Vista = "inicio" | "modoHumano" | "modoIA" | "estadisticas";

function App() {
  const [actual, setActual] = useState<Vista>("inicio");

  return (
    <main className="app-shell">
      {actual === "inicio" && <Inicio navegar={setActual} />}
      {actual === "modoHumano" && <ModoHumano navegar={setActual} />}
      {actual === "modoIA" && <ModoSimulacion navegar={setActual} />}
      {actual === "estadisticas" && <Estadisticas navegar={setActual} />}
    </main>
  );
}

export default App;
