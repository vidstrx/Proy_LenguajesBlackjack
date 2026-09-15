import "../views/ModoHumano.css"

export type FichaProps = {
    valor: number;
    img: string;
    onPress?: (empeza : boolean) => void;
}

const Ficha = ({ valor, img, onPress }: FichaProps) =>{
    return(
        <button id="fichas_button" onClick={() => onPress && onPress(true)}>
            <img src={img} alt={`Ficha ${valor}`} style={{height: "5vw"}}/>
        </button>
    )
}

export default Ficha;