import "../views/ModoHumano.css";

export interface FichaProps {
  valor: number;
  img: string;
  onSelect: (valor: number) => void;
  deshabilitado: boolean;
}

export default function Ficha({ valor, img, deshabilitado, onSelect }: FichaProps) {
  return (
    <button
      className="ficha"
      onClick={() => onSelect(valor)}
      disabled={deshabilitado}
      aria-label={`Apostar ${valor}`}
    >
      <img src={img} alt="" />
      <span>${valor}</span>
    </button>
  );
}

