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
import doubleDown from "../assets/double down.png"
import stand from "../assets/stand.png"
import { useState } from "react"

function doubleDownAccion(empezado: boolean){
    if(empezado){
        return(
            <li>
                <button type="button" id="button_empezar">
                    <img src={doubleDown} alt="Deal" style={{height: "4vw", filter: "invert(100%)"}}/>
                </button>
            </li>
        )
    }else{
        return(<></>)
    }
}

function standAccion(empezado: boolean){
    if(empezado){
        return(
            <li>  
                <button type="button" id="button_empezar">
                    <img src={stand} alt="Deal" style={{height: "4vw"}}/>
                </button>
            </li>
        )
    }else{
        return(<></>)
    }
}

function empezarJuego(empezar: boolean){
    const [empezado, setEmpezado] = useState(false);
    if(empezar){
        return(
            <ul id="ul_acciones">
                <li>
                    <button type="button" id="button_empezar" onClick={()=> setEmpezado(true)}>
                        <img src={deal} alt="Deal" style={{height: "4vw", filter: "invert(100%)"}}/>
                    </button>
                </li>
                {doubleDownAccion(empezado)}
                {standAccion(empezado)}
            </ul>
        )
    }else{
        return(<></>)
    }
}

export default function ModoHumano(){
    const [empezar, setEmpezar] = useState(false);
    return(
        <div id = "div_principal">
            <img src={titulo} alt="Título" id="titulo"/>
            <div>
                <div id="div_tablero">
                    <img src={tablero} alt="Tablero" id="tablero"/>
                    
                    {empezarJuego(empezar)}
                </div>
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
                </div>
            </div>
        </div>
    )
}