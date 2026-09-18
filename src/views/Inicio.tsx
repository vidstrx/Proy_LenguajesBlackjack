import "./Inicio.css"
import Video from "../assets/casino.mp4"
import titulo from "../assets/title card.jpg"

interface inicioProps{
    navegar: (view: "inicio" | "modoHumano" | "modoIA") => void;
}

export default function Inicio({navegar}: inicioProps){
    return (
        <div className="video-container">
        <video className="video-bg" src={Video} autoPlay loop muted playsInline/>Navegador no soporta video
        <div className="overlay">
            <img src={titulo} alt="Título" id="titulo"/>
            <ul id = "ul_menu">
                <li>
                    <button className="button">Modo IA</button>
                </li>
                <li>
                    <button className="button" onClick={() => navegar("modoHumano")}>Jugar</button>
                </li>
                <li>
                    <button className="button">Estadísticas</button>
                </li>
            </ul>
        </div>
        </div>
    );
}