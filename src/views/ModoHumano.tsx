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
import Mazo from "../core/Mazo.ts"
import Carta from "../components/Carta.tsx"
import { useState, useEffect } from "react"

const mazo = new Mazo();
let indice_mazo = 0;
let apuesta = 0;

interface ModoHumanoProps {
    navegar: (view: "inicio" | "modoHumano" | "modoIA") => void;
}

function doubleDownAccion(empezado: boolean) {
    if (empezado) {
        return (
            <li>
                <button type="button" id="button_empezar">
                    <img src={doubleDown} alt="Deal" style={{ height: "4vw", filter: "invert(100%)" }} />
                </button>
            </li>
        )
    } else {
        return (<></>)
    }
}

function standAccion(empezado: boolean) {
    if (empezado) {
        return (
            <li>
                <button type="button" id="button_empezar">
                    <img src={stand} alt="Deal" style={{ height: "4vw" }} />
                </button>
            </li>
        )
    } else {
        return (<></>)
    }
}

function empezarJuego(empezar: boolean, empezado: boolean, onPedirCartas: () => void, manoJugador: Mano) {
    if (!empezar) {
        return (<></>)
    }

    let puntaje = manoJugador.calcularPuntaje();
    if(puntaje < 21){
        return (
            <ul id="ul_acciones">
                <li>
                    <button type="button" id="button_empezar" onClick={onPedirCartas}>
                        <img src={deal} alt="Deal" style={{ height: "4vw", filter: "invert(100%)" }} />
                    </button>
                </li>
                {doubleDownAccion(empezado)}
                {standAccion(empezado)}
            </ul>
        )
    }else{

    }
}

function mostrarApuesta(apuesta: number) {
    if (apuesta > 0) {
        return (
            <div id="apuesta_mensaje">
                <p>Apuesta: ${apuesta}</p>
            </div>
        )
    } else {
        return (<></>)
    }
}

function cartasJugador(jugador: Mano, empezado: boolean) {
    if (empezado) {
        return (
            <ul id="ul_cartas_jugador">
                {jugador.getMano().map((item, index) => (
                    <li key={index}>
                        <Carta carta={item} />
                    </li>
                ))}
            </ul>
        )
    } else {
        return (<></>)
    }
}

function cartasDealer(dealer: Mano, empezado: boolean) {
    if (empezado) {
        return (
            <ul id="ul_cartas_dealer">
                {dealer.getMano().map((item, index) => (
                    <li key={index}>
                        <Carta carta={item} />
                    </li>
                ))}
            </ul>
        )
    } else {
        return (<></>)
    }
}

export default function ModoHumano({ navegar }: ModoHumanoProps) {
    const [manoDealer, setManoDealer] = useState(new Mano());
    const [empezar, setEmpezar] = useState(false);
    const [billeteraActual, setBilleteraActual] = useState(10000);
    const [apuestaActual, setApuestaActual] = useState(apuesta);
    const [empezado, setEmpezado] = useState(false);
    const [fichaDeshabilitada, setFichaDeshabilitada] = useState(false);
    const [manoJugador, setManoJugador] = useState(new Mano());

    useEffect(() => {
        if (empezar && !empezado) {
            if (apuestaActual > billeteraActual) {
                return;
            }
            const nuevaMano = new Mano();
            nuevaMano.agregarCarta(mazo.getMazo()[indice_mazo++]);
            nuevaMano.agregarCarta(mazo.getMazo()[indice_mazo++]);
            setManoJugador(nuevaMano);
            const nuevaManoD = new Mano();
            nuevaManoD.agregarCarta(mazo.getMazo()[indice_mazo++]);
            nuevaManoD.agregarCarta(mazo.getMazo()[indice_mazo++]);
            setManoDealer(nuevaManoD);
            setEmpezado(true);
            setFichaDeshabilitada(true);
        }
    }, [empezar, empezado, apuestaActual, billeteraActual]);

    const handlePedirCarta = () => {
        manoJugador.agregarCarta(mazo.getMazo()[indice_mazo++]);
        setManoJugador(Object.assign(new Mano(), manoJugador));
    };

    const handlePerder = () => {
        setBilleteraActual(billeteraActual);
    }

    return (
        <div id="div_principal">
            <img src={titulo} alt="Título" id="titulo" />
            <div>
                <div id="div_tablero">
                    <img src={tablero} alt="Tablero" id="tablero" />
                    {cartasDealer(manoDealer, empezado)}
                    {empezarJuego(empezar, empezado, handlePedirCarta, manoJugador)}
                    {mostrarApuesta(apuestaActual)}
                    {cartasJugador(manoJugador, empezado)}
                </div>
                <div id="id_fichas_buttons">
                    <button id="regresar_button" onClick={() => navegar("inicio")}>Regresar</button>
                    <ul id="ul_fichas">
                        <li>
                            <Fichas valor={1} img={blueChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)} onPressMessage={() => setApuestaActual(1)} />
                        </li>
                        <li>
                            <Fichas valor={5} img={redChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)} onPressMessage={() => setApuestaActual(5)} />
                        </li>
                        <li>
                            <Fichas valor={25} img={greenChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)} onPressMessage={() => setApuestaActual(25)} />
                        </li>
                        <li>
                            <Fichas valor={100} img={blackChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)} onPressMessage={() => setApuestaActual(100)} />
                        </li>
                        <li>
                            <Fichas valor={500} img={purpleChip} deshabilitado={fichaDeshabilitada} onPressAction={() => setEmpezar(true)} onPressMessage={() => setApuestaActual(500)} />
                        </li>
                    </ul>
                    <p id="billetera_p">Billetera: ${billeteraActual}</p>
                </div>
            </div>
        </div>
    )
}