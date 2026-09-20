import "./Inicio.css";
import type { Vista } from "../App";
import Video from "../assets/casino.mp4";
import titulo from "../assets/title card.jpg";

interface InicioProps {
  navegar: (view: Vista) => void;
}

export default function Inicio({ navegar }: InicioProps) {
  return (
    <section className="inicio">
      <video className="inicio__video" src={Video} autoPlay loop muted playsInline>
        Tu navegador no soporta video.
      </video>
      <div className="inicio__velo" />
      <div className="inicio__contenido">
        <img src={titulo} alt="Blackjack" className="inicio__titulo" />
        <p className="inicio__subtitulo">Juega, compara estrategias y analiza los resultados.</p>
        <div className="inicio__menu">
          <button className="boton boton--principal" onClick={() => navegar("modoHumano")}>Jugar</button>
          <button className="boton" onClick={() => navegar("modoIA")}>Simular IA</button>
          <button className="boton" onClick={() => navegar("estadisticas")}>Historial</button>
        </div>
      </div>
    </section>
  );
}

