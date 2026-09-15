import "./ModoHumano.css"
import Fichas from "../components/Fichas.tsx"
import tablero from "../assets/tablero.png"
import titulo from "../assets/title card.jpg"
import blueChip from "../assets/blue poker chip.png"
import redChip from "../assets/red poker chip.png"
import greenChip from "../assets/green poker chip.png"
import blackChip from "../assets/black poker chip.png"
import purpleChip from "../assets/purple poker chip.png"
import deal from "../assets/deal.png"
import { useState } from "react"

function empezarJuego(empezar: boolean){
    if(empezar){
        return(
            <button type="button" id="button_empezar">
                <img src={deal} alt="Deal" style={{height: "4vw", filter: "invert(100%)"}}/>
            </button>
        )
    }else{
        return(<></>)
    }
}

export default function ModoHumano(){
    const [empezar, setEmpezar] = useState(false);
    return(
        <div id = "div_principal">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"crossorigin="anonymous"></link>
            <img src={titulo} alt="Título" id="titulo"/>
            <div>
                <img src={tablero} alt="Tablero" id="tablero"/>
                <div id="id_fichas_buttons">
                    <ul id="ul_fichas">
                        <li>
                            <Fichas valor={1} img={blueChip} onPress={(empezar) => setEmpezar(empezar)}/>
                        </li>
                        <li>
                            <Fichas valor={5} img={redChip} onPress={(empezar) => setEmpezar(empezar)}/>
                        </li>
                        <li>
                            <Fichas valor={25} img={greenChip} onPress={(empezar) => setEmpezar(empezar)}/>
                        </li>
                        <li>
                            <Fichas valor={100} img={blackChip} onPress={(empezar) => setEmpezar(empezar)}/>
                        </li>
                        <li>
                            <Fichas valor={500} img={purpleChip} onPress={(empezar) => setEmpezar(empezar)}/>
                        </li>
                    </ul>
                    {empezarJuego(empezar)}
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"crossorigin="anonymous"></script>
        </div>
    )
}