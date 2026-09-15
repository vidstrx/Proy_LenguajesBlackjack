//import { useState } from 'react'
//import './App.css'

import Mazo from "./core/Mazo"
import ModoHumano from "./views/ModoHumano"

function App() {
  //const [count, setCount] = useState(0)
  const mazo = new Mazo();
  console.log(mazo.getMazo());

  return (
    <>
      <ModoHumano />
    </>
  )
}

export default App
