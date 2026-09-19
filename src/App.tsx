//import { useState } from 'react'
//import './App.css'

import Mazo from "./core/Mazo"
import ModoHumano from "./views/ModoHumano"
import Inicio from "./views/Inicio"
import { useState } from "react";
import ModoSimulacion from "./views/ModoSimulacion";

function App() {
  //const [count, setCount] = useState(0)
  const [actual, setActual] = useState<"inicio" | "modoHumano" | "modoIA">("inicio");
  const mazo = new Mazo();
  console.log(mazo.getMazo());

  return (
    <div>
      {actual == "inicio" && <Inicio navegar={setActual}/>}
      {actual == "modoHumano" && <ModoHumano navegar={setActual}/>}
      {actual == "modoIA" && <ModoSimulacion navegar={setActual} mazo={mazo}/>}
    </div>
  )
}

export default App