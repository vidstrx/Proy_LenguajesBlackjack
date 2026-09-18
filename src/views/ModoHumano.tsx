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
import Mano from "../core/Mano.ts"
import { useState } from "react"

const mano = new Mano();

interface ModoHumanoProps{
    navegar: (view: "inicio" | "modoHumano" | "modoIA") => void;
}

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

function empezarJuego(empezar: boolean, empezado: boolean, apuesta: number, billetera: number, setEmpezado: (v: boolean) => void, setFichaDeshabilitada: (v: boolean) => void){
    mano.limpiar();

    if(apuesta > billetera){
        return;
    }

    if(empezar){
        return(
            <ul id="ul_acciones">
                <li>
                    <button type="button" id="button_empezar" onClick={() => {setEmpezado(true); setFichaDeshabilitada(true);}}>
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

function mostrarApuesta(apuesta: number){
    if(apuesta > 0){
        return(
            <div id="apuesta_mensaje">
                <p>Apuesta: {apuesta}</p>
            </div>
        )
    }else{
        return(<></>)
    }
}

export default function ModoHumano({navegar}: ModoHumanoProps){
    let billetera = 10000;
    let apuesta = 0;
    const [empezar, setEmpezar] = useState(false);
    const [billeteraActual, setBilleteraActual] = useState(billetera);
    const [apuestaActual, setApuestaActual] = useState(apuesta);
    const [empezado, setEmpezado] = useState(false);
    const [fichaDeshabilitada, setFichaDeshabilitada] = useState(false);
    return(
        <div id = "div_principal">
            <img src={titulo} alt="Título" id="titulo"/>
            <div>
                <div id="div_tablero">
                    <img src={tablero} alt="Tablero" id="tablero"/>
                    {empezarJuego(empezar, empezado, apuestaActual, billetera, setEmpezado, setFichaDeshabilitada)}
                    {mostrarApuesta(apuestaActual)}
                </div>
                <div id="id_fichas_buttons">
                    <button id="regresar_button" onClick={() => navegar("inicio")}>Regresar</button>
                    <ul id="ul_fichas">
                        <li>
                            <Fichas valor={1} img={blueChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)}  onPressMessage={() => setApuestaActual(1)}/>
                        </li>
                        <li>
                            <Fichas valor={5} img={redChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)} onPressMessage={() => setApuestaActual(5)}/>
                        </li>
                        <li>
                            <Fichas valor={25} img={greenChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)} onPressMessage={() => setApuestaActual(25)}/>
                        </li>
                        <li>
                            <Fichas valor={100} img={blackChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)} onPressMessage={() => setApuestaActual(100)}/>
                        </li>
                        <li>
                            <Fichas valor={500} img={purpleChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)} onPressMessage={() => setApuestaActual(500)}/>
                        </li>
                    </ul>
                    <p id="billetera_p">Billetera: {billetera}</p>
                </div>
            </div>
        </div>
    )
}