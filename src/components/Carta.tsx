import Carta from "../core/Carta"
import "./Carta.css"
import carta_atras from "../assets/carta_atras.png"

interface cartaProps  {
    carta: Carta,
    mostrar?: boolean
}

/**
 * Consigue el palo de la carta para dibujarlo
 * @param palo - el palo de la carta 
 * @returns El simbolo en Unicode y el color de ese simbolo
 */
function getPaloCarta(palo:string) {
    if (palo === "heart"){
        return {simbolo: '♥', color: "rojo"}
    } else if (palo === "diamond") {
        return {simbolo: '♦', color: "rojo"}
    } else if (palo === "club") {
        return {simbolo: '♣', color: "negro"}
    } else if (palo === "spade") {
        return {simbolo: '♠', color: "negro"}
    }
    return {simbolo: '?', color:"negro"}
}

/**
 * Dibuja solo una carta de frente o de atras 
 * @param carta - el objeto carta que contiene (valor y palo) 
 * @param mostrar - (opcional) false -> si no se quiere mostrar la carta, por defecto es true
 */
function CartaComp({carta, mostrar = true}:cartaProps) {
    const {simbolo, color} = getPaloCarta(carta.palo);
    
    // muestra el contenido de la carta
    if(mostrar) {
        return (
            <div className={`carta-contenedor ${color}`}>
                <div className="esquina top-left">
                    <span className="valor">{carta.valor}</span>
                </div>
                <div className="palo">
                    <span>{simbolo}</span>
                </div>
                <div className="esquina bottom-right">
                    <span className="valor">{carta.valor}</span>
                </div>
            </div>
        );
    }
    
    //muestra la parte de atras de la carta
    return (
        <div className="carta-contenedor">
            <img src={carta_atras} alt="Carta por atras" />
        </div>
    );
}

export default CartaComp;