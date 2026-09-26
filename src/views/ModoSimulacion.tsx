import { useEffect, useState } from "react";
import CartaComp from "../components/Carta";
import IA from "../core/IA";
import { Mano } from "../core/Mano";
import type Mazo from "../core/Mazo";
import "./ModoSimulacion.css";
import type Carta from "../core/Carta";
import type Jugador from "../core/Jugador";
import tablero from "../assets/tablero.png";
import titulo from "../assets/title card.jpg";
import { registrarPartida } from "../components/registrarPartida";

let jugadorIA: IA, dealer: IA;

interface msProps {
    mazo: Mazo;
    navegar: (view: "inicio" | "modoHumano" | "modoIA") => void;
}

function repartirCartas(mazo: Mazo, numero: number) {
    let mano = new Mano();
    let carta;
    for (let i = 0; i < numero; i++) {
        carta = mazo.getMazo().pop();
        if (carta !== undefined)
            mano.agregarCarta(carta);

        mazo.actualizarMazoDict(mano.cartas[i].valor);
    }

    if (numero === 1 && (carta = mazo.getMazo().pop()))
        mano.agregarCarta(carta);
    return mano;
}

export default function ModoSimulacion({ mazo, navegar }: msProps) {
    const [turno, setTurno] = useState<"Esperando" | "IA" | "Dealer" | "Fin">("Esperando");
    const [estrategia, setEstrategia] = useState<"fija" | "probabilistica">("fija"); // Valor por defecto
    const [mostrarCarta, setMostrarCarta] = useState<boolean>(false);
    const [cartasIA, setCartasIA] = useState<Carta[]>();
    const [cartasDealer, setCartasDealer] = useState<Carta[]>();

    // Limpia las manos dentro del componente
    const limpiarManos = () => {
        jugadorIA.getMano().limpiar();
        dealer.getMano().limpiar();
    };

    // Verifica manos y registra automáticamente usando el estado "estrategia"
    const verificarManos = () => {
        const puntajeJugadorIA = jugadorIA.getMano().calcularPuntaje();
        const puntajeDealer = dealer.getMano().calcularPuntaje();

        let resultado = "";

        if (puntajeDealer === puntajeJugadorIA) {
            resultado = "empate";
        } else if (jugadorIA.getMano().estaSePaso() || (!dealer.getMano().estaSePaso() && puntajeDealer > puntajeJugadorIA)) {
            resultado = "derrota";
        } else if (dealer.getMano().estaSePaso() || (!jugadorIA.getMano().estaSePaso() && puntajeJugadorIA > puntajeDealer)) {
            resultado = "victoria";
        }

        // Definimos el modo exacto para el backend
        const modoPartida = estrategia === "probabilistica" ? "ia-dificil" : "ia-facil";

        // Llamada a la API para registrar la partida
        registrarPartida(modoPartida, resultado, puntajeJugadorIA, puntajeDealer, 0);

        limpiarManos();
        return resultado === "empate" ? "Empate" : resultado === "victoria" ? "Jugador Gana" : "Dealer Gana";
    };

    const empezar = (tipoEstrategia: ("fija" | "probabilistica")) => {
        setEstrategia(tipoEstrategia);
        jugadorIA = new IA(repartirCartas(mazo, 2));
        dealer = new IA(repartirCartas(mazo, 1));
        setCartasIA(jugadorIA.getMano().cartas);
        setCartasDealer(dealer.getMano().cartas);
        setTurno("IA");
        setMostrarCarta(false);
        return true;
    };

    const agregarCarta = (jugador: Jugador, cartas: Carta[], setCartas: (value: React.SetStateAction<Carta[] | undefined>) => void) => {
        const carta = mazo.getMazo().pop();
        if (carta !== undefined) {
            jugador.getMano().agregarCarta(carta);
            setCartas([...cartas!, carta]);
            mazo.actualizarMazoDict(carta.valor);
        }
    };

    useEffect(() => {
        if (cartasDealer && turno === "Dealer") {
            setTimeout(() => {
                if (dealer.estrategiaFija()) {
                    agregarCarta(dealer, cartasDealer, setCartasDealer);
                } else {
                    console.log(verificarManos());
                    setTurno("Fin");
                }
            }, 3000);
        } else if (cartasIA && turno === "IA") {
            let pedir: boolean;
            if (estrategia === "fija") {
                pedir = jugadorIA.estrategiaFija();
            } else if (estrategia === "probabilistica") {
                pedir = jugadorIA.estrategiaPorProbabilidad(mazo.getMazoDict());
            }

            setTimeout(() => {
                if (pedir) {
                    agregarCarta(jugadorIA, cartasIA, setCartasIA);
                } else {
                    const cartaHaciaAtras = dealer.getMano().cartas.at(-1);
                    if (cartaHaciaAtras)
                        mazo.actualizarMazoDict(cartaHaciaAtras.valor);

                    setMostrarCarta(true);
                    if (!jugadorIA.getMano().estaSePaso()) {
                        setTurno("Dealer");
                    } else {
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
                <img src={titulo} alt="Título" id="titulo" />
                <div className="div_tablero">
                    <img src={tablero} alt="Tablero" id="tablero" />
                    <div className="div_cartas">
                        <div className="div_dealer">
                            {cartasDealer && dealer.getMano().cartas.map((value, index) => (
                                <CartaComp key={index} carta={value} mostrar={index === 1 ? mostrarCarta : true} />
                            ))}
                        </div>
                        <div className="div_jugadorIA">
                            {cartasIA && jugadorIA.getMano().cartas.map((value, index) => (
                                <CartaComp key={index} carta={value} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="div_buttons">
                    <button className="buttons" onClick={() => navegar("inicio")}>Regresar</button>
                    {(turno === "Esperando" || turno === "Fin") && <button className="buttons" onClick={() => empezar("fija")}>Estrategia 1</button>}
                    {(turno === "Esperando" || turno === "Fin") && <button className="buttons" onClick={() => empezar("probabilistica")}>Estrategia 2</button>}
                </div>
            </div>
        </>
    );
}