import { useEffect, useState } from "react";
import CartaComp from "../components/Carta";
import IA from "../core/IA";
import { Mano } from "../core/Mano";
import type Mazo from "../core/Mazo";
import "./ModoSimulacion.css"
import type Carta from "../core/Carta";
import type Jugador from "../core/Jugador";
import tablero from "../assets/tablero.png"
import titulo from "../assets/title card.jpg"

let jugadorIA:IA, dealer:IA;
interface msProps {
    mazo: Mazo,
    navegar: (view: "inicio" | "modoHumano" | "modoIA") => void;
}
/**
 * Reparte las cartas al inicio del juego a los jugadores
 * @param mazo - el mazo ya combinado
 * @param numero - el numero de cartas a repartir
 * @returns Devuelve la mano del jugador con sus cartas respectivas del mazo
 */
function repartirCartas(mazo: Mazo, numero:number) {
    let mano = new Mano();
    let carta;
    for (let i = 0; i < numero; i++) {
        carta = mazo.getMazo().pop();
        if (carta !== undefined)
            mano.agregarCarta(carta);

        mazo.actualizarMazoDict(mano.cartas[i].valor);
    }

    // este if es para darle la segunda carta al dealer pero sin mazo.actualizarMazoDict
    if (numero === 1 && (carta = mazo.getMazo().pop()))
        mano.agregarCarta(carta);
    return mano;
}
// limpia las manos que tienen actualmente los jugadores
function limpiarManos() {
    jugadorIA.getMano().limpiar();
    dealer.getMano().limpiar();
}
/**
 * Verifica las manos de los jugadores para saber si empetaron o quien gano
 * @returns Empate si ambas manos son iguales | El jugador ganador (IA o Dealer)
 */
function verificarManos() {
    const manoJugadorIA = jugadorIA.getMano().calcularPuntaje();
    const manoDealer = dealer.getMano().calcularPuntaje();
    if (manoDealer === manoJugadorIA){
        return "Empate";
    } else if (jugadorIA.getMano().estaSePaso() || (!dealer.getMano().estaSePaso() && manoDealer > manoJugadorIA)) {
        return "Dealer Gana";
    } else if (dealer.getMano().estaSePaso() || (!jugadorIA.getMano().estaSePaso() && manoJugadorIA > manoDealer)) {
        return "Jugador Gana";
    }
    limpiarManos();
    return "";
}

function ModoSimulacion({mazo, navegar}: msProps) {
    const [turno, setTurno] = useState<"Esperando" | "IA" | "Dealer" | "Fin">("Esperando");
    const [estrategia, setEstrategia] = useState<"fija" | "probabilistica">();
    const [mostrarCarta, setMostrarCarta] = useState<boolean>(false);
    const [cartasIA, setCartasIA] = useState<Carta[]>();
    const [cartasDealer, setCartasDealer] = useState<Carta[]>();
    
    // recibe la estrategia con la que se quiere jugar e inicializamos a los jugadores repartiendo las cartas (IA y Dealer)
    const empezar = (estrategia:("fija" | "probabilistica")) => {
        jugadorIA = new IA(repartirCartas(mazo,2));
        dealer = new IA(repartirCartas(mazo, 1));
        setCartasIA(jugadorIA.getMano().cartas);
        setCartasDealer(dealer.getMano().cartas);
        setTurno("IA");
        setEstrategia(estrategia);
        setMostrarCarta(false);
        return true;
    }
    // recibe el tipo de jugador, si es jugadorIA o dealer y se le agrega la carta a ese jugador
    const agregarCarta = (jugador:Jugador, cartas: Carta[], setCartas: (value: React.SetStateAction<Carta[] | undefined>) => void) => {
        const carta = mazo.getMazo().pop()
        if (carta !== undefined) {
            jugador.getMano().agregarCarta(carta);
            setCartas([...cartas!, carta]);
            mazo.actualizarMazoDict(carta.valor); // actualizar el diccionario para las probabilidades
        }
    }

    useEffect(()=> {
        if (cartasDealer && turno === "Dealer") {
            setTimeout(() => {
                if (dealer.estrategiaFija()) { // si su mano es menor o igual a 16, pide carta el dealer
                    agregarCarta(dealer,cartasDealer,setCartasDealer);
                } else { // si su mano es mayor a 16, verificamos las manos de todos y termina la ronda
                    console.log(verificarManos());
                    setTurno("Fin");
                }
            }, 3000);
        } else if (cartasIA && turno === "IA") {
            let pedir: boolean;
            if (estrategia === "fija") {
                pedir = jugadorIA.estrategiaFija();
            } else if (estrategia === "probabilistica") {
                // recibe el diccionario para contar con exactitud las cartas que ya han salido para decidir si pedir o no
                pedir = jugadorIA.estrategiaPorProbabilidad(mazo.getMazoDict());
            }
            
            setTimeout(() => {
                if (pedir) {
                    agregarCarta(jugadorIA,cartasIA,setCartasIA);
                } else {
                    const cartaHaciaAtras = dealer.getMano().cartas.at(-1);
                    /* al repartir las cartas, una carta del dealer no actualiza el diccionario de cantidades de cartas porque no se sabe cual es
                    entonces cuando el jugador se planta, ahora si se puede restar la carta que estaba hacia atras en el diccionario, para que los
                    calculos de las probabilidades no sean erroneos*/
                    if (cartaHaciaAtras)
                        mazo.actualizarMazoDict(cartaHaciaAtras.valor);

                    setMostrarCarta(true);
                    if (!jugadorIA.getMano().estaSePaso()) { // si el jugador ya no pedira y no ha busteado, entonces es turno del dealer
                        setTurno("Dealer");
                    } else { // si el jugador busteo, termina la ronda y se verifica la mano
                        console.log(verificarManos());
                        setTurno("Fin");
                    }
                }
            }, 3000);
        }
    }, [cartasIA, cartasDealer, turno]);
    
    return (
        <>
            <div className="div_principal">
                <img src={titulo} alt="Título" id="titulo"/>
                <div className="div_tablero">
                    <img src={tablero} alt="Tablero" id="tablero"/>
                    <div className="div_cartas">
                        <div className="div_dealer">
                            {cartasDealer && dealer.getMano().cartas.map((value, index) => (
                                <CartaComp key={index} carta={value} mostrar={index === 1? mostrarCarta: true}/>
                            ))}
                        </div>
                        <div className="div_jugadorIA">
                            {cartasIA && jugadorIA.getMano().cartas.map((value, index) => (
                                <CartaComp key={index} carta={value}/>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="div_buttons">
                    <button className="buttons" onClick={()=> navegar("inicio")}>Regresar</button>
                    {(turno === "Esperando" || turno === "Fin") && <button className="buttons" onClick={() => empezar("fija")}>Estrategia 1</button>}
                    {(turno === "Esperando" || turno === "Fin") && <button className="buttons" onClick={() => empezar("probabilistica")}>Estrategia 2</button>}
                </div>
            </div>
        </>
    );
}
export default ModoSimulacion;