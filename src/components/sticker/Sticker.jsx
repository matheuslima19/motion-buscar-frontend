import styles from "./Sticker.module.css";
import galao from "../../utils/assets/galao-combustivel.svg";
import raio from "../../utils/assets/raio.svg";
import hibrido from "../../utils/assets/hibrido.svg";
import carro from "../../utils/assets/stick-carro.svg";
import moto from "../../utils/assets/moto.svg";
import caminhao from "../../utils/assets/caminhao.svg";
import onibus from "../../utils/assets/onibus.svg";
import wpp from "../../utils/assets/wppIcon.svg";
import local from "../../utils/assets/localizacao.svg";

const Sticker = ({ label, type, onClick = null }) => {
    const imageMap = {
        "combustão": galao,
        "elétrico": raio,
        "hibrido": hibrido,
        "carro": carro,
        "moto": moto,
        "caminhão": caminhao,
        "ônibus": onibus,
        "local": local,
        "wpp": wpp
    };

    const srcImagem = imageMap[type] || null;

    const containerClass = onClick ? `${styles.container} ${styles.clickable}` : styles.container;

    return (
        <div onClick={onClick} className={containerClass}>
            <div className={styles["box-img"]}>
                {srcImagem && <img src={srcImagem} alt={`Ícone do ${type}`} />}
            </div>
            <p>{label}</p>
        </div>
    );
}

export default Sticker;
