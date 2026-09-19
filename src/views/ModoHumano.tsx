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
import Jugador from "../core/Jugador.ts"
import IA from "../core/IA.ts"
import { useState, useEffect } from "react"

const mazo = new Mazo();
let indice_mazo = 0;
let apuesta = 0;

interface ModoHumanoProps {
    navegar: (view: "inicio" | "modoHumano" | "modoIA") => void;
}

function doubleDownAccion(empezado: boolean, doubleDownEvaluacion: ()=>void) {
    if (empezado) {
        return (
            <li>
                <button type="button" id="button_empezar" onClick={doubleDownEvaluacion}>
                    <img src={doubleDown} alt="Deal" style={{ height: "4vw", filter: "invert(100%)" }} />
                </button>
            </li>
        )
    } else {
        return (<></>)
    }
}

function standAccion(empezado: boolean, standEvaluacion: ()=>void) {
    if (empezado) {
        return (
            <li>
                <button type="button" id="button_empezar" onClick={standEvaluacion}>
                    <img src={stand} alt="Deal" style={{ height: "4vw" }} />
                </button>
            </li>
        )
    } else {
        return (<></>)
    }
}

function empezarJuego(empezar: boolean, empezado: boolean, onPedirCartas: () => void, doubleDown: boolean, standEvaluacion: ()=>void, doubleDownEvaluacion: ()=>void) {
    if (!empezar) {
        return (<></>)
    }

    return (
        <ul id="ul_acciones">
            <li>
                <button type="button" id="button_empezar" onClick={onPedirCartas}>
                    <img src={deal} alt="Deal" style={{ height: "4vw", filter: "invert(100%)" }} />
                </button>
            </li>
            {doubleDownAccion(doubleDown, doubleDownEvaluacion)}
            {standAccion(empezado, standEvaluacion)}
        </ul>
    )
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

function cartasJugador(jugador: Jugador, empezado: boolean, doubleDown: boolean) {
    if (empezado) {
        return (
            <ul id="ul_cartas_jugador">
                {jugador.getMano().getCartas().map((item, index) => (
                    <li id={(doubleDown && index == jugador.getMano().getCartas().length - 1)? "li_cartas_doubled" : "li_cartas"} key={index}>
                        <Carta carta={item} />
                    </li>
                ))}
            </ul>
        )
    } else {
        return (<></>)
    }
}

function cartasDealer(dealer: IA, empezado: boolean, mostrar: boolean) {
    if (empezado) {
        if(!mostrar){
            return (
                <ul id="ul_cartas_dealer">
                    {dealer.getMano().getCartas().map((item, index) => (
                        <li id="li_cartas" key={index}>
                            <Carta carta={item} mostrar={index == 1? true : false}/>
                        </li>
                    ))}
                </ul>
            )
        }else{
            return (
                <ul id="ul_cartas_dealer">
                    {dealer.getMano().getCartas().map((item, index) => (
                        <li id="li_cartas" key={index}>
                            <Carta carta={item}/>
                        </li>
                    ))}
                </ul>
            )
        }
    } else {
        return (<></>)
    }
}

function mostrarMensajeFinal(mensaje: string, limpiarPartida: ()=>void){
    if(mensaje != ""){
        return(
            <div id="mensaje_final">
                <p>{mensaje}</p>
                <button id="regresar_button" onClick={limpiarPartida}>Continuar</button>
            </div>
        )
    } else {
        return (<></>)
    }
}

export default function ModoHumano({ navegar }: ModoHumanoProps) {
    const [empezar, setEmpezar] = useState(false);
    const [billeteraActual, setBilleteraActual] = useState(10000);
    const [apuestaActual, setApuestaActual] = useState(apuesta);
    const [empezado, setEmpezado] = useState(false);
    const [fichaDeshabilitada, setFichaDeshabilitada] = useState(false);
    const [jugador, setJugador] = useState(new Jugador(new Mano()));
    const [dealer, setDealer] = useState(new IA(new Mano()));
    const [mensajeFinal, setMensajeFinal] = useState("");
    const [doubleDown, setDoubleDown] = useState(false);
    const [doubleDownTrue, setDoubleDownTrue] = useState(false);

    useEffect(() => {
        if (empezar && !empezado) {
            if (apuestaActual > billeteraActual) {
                return;
            }
            const nuevaMano = new Mano();
            nuevaMano.agregarCarta(mazo.getMazo()[indice_mazo++]);
            nuevaMano.agregarCarta(mazo.getMazo()[indice_mazo++]);
            setJugador(new Jugador(nuevaMano));
            const nuevaManoD = new Mano();
            nuevaManoD.agregarCarta(mazo.getMazo()[indice_mazo++]);
            nuevaManoD.agregarCarta(mazo.getMazo()[indice_mazo++]);
            setDealer(new IA(nuevaManoD));

            setEmpezado(true);
            setFichaDeshabilitada(true);
            setDoubleDown(true);

            const jugadorTieneA = nuevaMano.getCartas().some(c => c.valor === "A");
            const jugadorTieneDiez = nuevaMano.getCartas().some(c => c.valor === "Q" || c.valor === "K" || c.valor === "J" || c.valor === "10");
            if (jugadorTieneA && jugadorTieneDiez) {
                setEmpezar(false);

                const dealerTieneA = nuevaManoD.getCartas().some(c => c.valor === "A");
                const dealerTieneDiez = nuevaManoD.getCartas().some(c => c.valor === "Q" || c.valor === "K" || c.valor === "J" || c.valor === "10");

                if (dealerTieneA && dealerTieneDiez) {
                    setMensajeFinal("EMPATE JACKBLACK");
                } else {
                    setMensajeFinal("JACKBLACK!");
                    setBilleteraActual(billeteraActual + apuestaActual);
                }
            }
        }
    }, [empezar, empezado, apuestaActual, billeteraActual]);

    const handlePedirCarta = () => {
        jugador.getMano().agregarCarta(mazo.getMazo()[indice_mazo++]);
        setJugador(new Jugador(jugador.getMano()));
        setDoubleDown(false);

        let puntaje = jugador.getMano().calcularPuntaje();
        if(puntaje > 21){
            setMensajeFinal("Busted");
            setEmpezar(false);
            setBilleteraActual(billeteraActual - apuestaActual);
        }
    };

    const standEvaluacion = ()=>{
        while(dealer.estrategiaFija()){
            dealer.getMano().agregarCarta(mazo.getMazo()[indice_mazo++]);
            setDealer(new IA(dealer.getMano()));
        }

        setEmpezar(false);
        let puntajeIA = dealer.getMano().calcularPuntaje();
        if(puntajeIA > 21){
            setMensajeFinal("DEALER BUSTED");
            setBilleteraActual(billeteraActual + apuestaActual);
            return;
        }

        let puntajeJugador = jugador.getMano().calcularPuntaje();
        

        if((21 - puntajeJugador) > (21 - puntajeIA)){
            setMensajeFinal("DEALER GANA");
            setBilleteraActual(billeteraActual - apuestaActual);
        }else if ((21 - puntajeIA) > (21 - puntajeJugador)){
            setMensajeFinal("TÚ GANAS");
            setBilleteraActual(billeteraActual + apuestaActual);
        }else {
            setMensajeFinal("EMPATE");
        }
    }

    const doubleDownEvaluacion = ()=>{
        const nuevaApuesta = apuestaActual * 2;
        setApuestaActual(nuevaApuesta);
        setDoubleDownTrue(true);
        jugador.getMano().agregarCarta(mazo.getMazo()[indice_mazo++]);
        setJugador(new Jugador(jugador.getMano()));

        let puntaje = jugador.getMano().calcularPuntaje();
        if(puntaje > 21){
            setMensajeFinal("Busted");
            setEmpezar(false);
            setBilleteraActual(billeteraActual - nuevaApuesta);
            return;
        }

         while(dealer.estrategiaFija()){
            dealer.getMano().agregarCarta(mazo.getMazo()[indice_mazo++]);
            setDealer(new IA(dealer.getMano()));
        }

        setEmpezar(false);
        let puntajeIA = dealer.getMano().calcularPuntaje();
        if(puntajeIA > 21){
            setMensajeFinal("DEALER BUSTED");
            setBilleteraActual(billeteraActual + nuevaApuesta);
            return;
        }

        let puntajeJugador = jugador.getMano().calcularPuntaje();
        
        if((21 - puntajeJugador) > (21 - puntajeIA)){
            setMensajeFinal("DEALER GANA");
            setBilleteraActual(billeteraActual - nuevaApuesta);
        }else if ((21 - puntajeIA) > (21 - puntajeJugador)){
            setMensajeFinal("TÚ GANAS");
            setBilleteraActual(billeteraActual + nuevaApuesta);
        }else {
            setMensajeFinal("EMPATE");
        }
    }

    const limpiarPartida = () => {
        setMensajeFinal("");
        setEmpezado(false);
        setApuestaActual(0);
        setFichaDeshabilitada(false);
        setDoubleDownTrue(false);
        indice_mazo = 0;
        mazo.shuffle();
    }

    return (
        <div id="div_principal">
            <img src={titulo} alt="Título" id="titulo" />
            <div>
                <div id="div_tablero">
                    <img src={tablero} alt="Tablero" id="tablero" />
                    {cartasDealer(dealer, empezado, !empezar)}
                    {mostrarMensajeFinal(mensajeFinal, limpiarPartida)}
                    {empezarJuego(empezar, empezado, handlePedirCarta, doubleDown, standEvaluacion, doubleDownEvaluacion)}
                    {mostrarApuesta(apuestaActual)}
                    {cartasJugador(jugador, empezado, doubleDownTrue)}
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