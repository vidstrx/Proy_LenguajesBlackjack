//import { useState } from 'react'
//import './App.css'

import Mazo from "./core/Mazo"
import ModoHumano from "./views/ModoHumano"
import Inicio from "./views/Inicio"
import { useState } from "react";
import ModoSimulacion from "./views/ModoSimulacion";
import { HistorialPartidas } from './components/HistorialPartidas';



function App() {
  //const [count, setCount] = useState(0)
  const [actual, setActual] = useState<"inicio" | "modoHumano" | "modoIA" | "estadisticas">("inicio");
  const mazo = new Mazo();
  console.log(mazo.getMazo());

  return (
    <div>
      {actual == "inicio" && <Inicio navegar={setActual} />}
      {actual == "modoHumano" && <ModoHumano navegar={setActual} />}
      {actual == "modoIA" && <ModoSimulacion navegar={setActual} mazo={mazo} />}
      {actual == "estadisticas" && <HistorialPartidas onVolver={() => setActual("inicio")} />}
    </div>
  )
}

export default App