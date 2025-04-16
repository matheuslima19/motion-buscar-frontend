import React from "react";
import styles from "./BoxAvaliacao.module.css";
import estrela from "../../utils/assets/estrela.svg";
import estrelaVazia from "../../utils/assets/estrelaCinza.svg";

const BoxAvaliacao = ({ nota, autor, comentario, fotoPerfil }) => {
    const renderEstrelas = (nota) => {
        const maxEstrelas = 5;
        const estrelas = [];

        for (let i = 0; i < maxEstrelas; i++) {
            if (i < nota) {
                estrelas.push(<img key={i} src={estrela} alt="Estrela preenchida" />);
            } else {
                estrelas.push(<img key={i} src={estrelaVazia} alt="Estrela vazia" />);
            }
        }

        return estrelas;
    };

    return (
        <div className={styles["container"]}>
            <div className={styles["infos"]}>
                <div className={styles["imagemPerfil"]}>
                    <img src={fotoPerfil} alt="" />
                </div>
                <div className={styles["dados"]}>
                    <p>{autor}</p>
                    <div className={styles["nota"]}>
                        {renderEstrelas(nota)}
                    </div>
                </div>
            </div>
            <div className={styles["comentario"]}>
                <p>"{comentario}"</p>
            </div>
        </div>
    );
};

export default BoxAvaliacao;
