//import { useState } from 'react'
//import './App.css'

import Mazo from "./core/Mazo"

function App() {
  //const [count, setCount] = useState(0)
  const mazo = new Mazo();
  console.log(mazo.getMazo());
  return (
    <>
      <h1>Blackjack</h1>
    </>
  )
}

export default App
