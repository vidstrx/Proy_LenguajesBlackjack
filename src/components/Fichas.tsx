import "../views/ModoHumano.css"

export type FichaProps = {
    valor: number;
    img: string;
    onPressAction?: (empezar : boolean) => void;
    onPressMessage?: (apuesta: number) => void;
    deshabilitado: boolean;
}

const Ficha = ({ valor, img, deshabilitado, onPressAction, onPressMessage }: FichaProps) =>{
    const onPress = () => {
        onPressAction?.(true);
        onPressMessage?.(valor);
    };

    return(
        <button id="fichas_button" onClick={onPress} disabled={deshabilitado} >
            <img src={img} alt={`Ficha ${valor}`} style={{height: "5vw"}}/>
        </button>
    )
}

export default Ficha;