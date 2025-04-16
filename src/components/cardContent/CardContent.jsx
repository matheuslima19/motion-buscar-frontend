import React, { useEffect, useRef } from "react";
import styles from "./CardContent.module.css";
import local from "../../utils/assets/localizacao.svg";
import wppIcon from "../../utils/assets/wppIcon.svg";
import estrela from "../../utils/assets/estrela.svg";

const CardContent = ({ type, titulo, subT, end, tel, nota, onclickCard, valor,imagem }) => {
    const subTRef = useRef(null);
    const containerRef = useRef(null);
    const estrelaRef = useRef(null);
    const precoRef = useRef(null)
    const infosRef = useRef(null)
    const avaliacaoRef = useRef(null)
    const titleRef = useRef(null)
    const valorRef = useRef(null)
    const textoTituloRef = useRef(null)

    useEffect(() => {
        if (type === "Peca") {
            estrelaRef.current.style.display = "none"
            precoRef.current.style.fontSize = "2.5vh"
            precoRef.current.style.fontFamily = "Product-Sans-Bold"
            precoRef.current.style.color = "#3B563C"
        } else if (type === "Oficina") {
            subTRef.current.style.display = "none";
            containerRef.current.style.height = "50vh";
        } else if (type === "miniServico"){
            infosRef.current.style.display = "none"
            containerRef.current.style.height = "38vh"
            avaliacaoRef.current.style.display = "none"
            containerRef.current.style.gap = "2vh"
            containerRef.current.style.marginBottom = "2vh"
            textoTituloRef.current.style.maxWidth = "100%"
        } else if (type === "miniPeca"){
            infosRef.current.style.display = "none"
            containerRef.current.style.height = "45vh"
            avaliacaoRef.current.style.display = "none"
            containerRef.current.style.gap = "2vh"
            titleRef.current.style.flexDirection = "column"
            titleRef.current.style.alignItems = "start"
            titleRef.current.style.gap = "1vh"
            valorRef.current.style.display = "flex"
            containerRef.current.style.marginBottom = "2vh"
            textoTituloRef.current.style.maxWidth = "100%"
        }
    }, [type]);


    return (
        <div onClick={onclickCard} ref={containerRef} className={styles["container"]}>
            <div className={styles["imagem"]}>
                <img src={imagem} alt="" />
            </div>
            <div ref={titleRef} className={styles["title"]}>
                <h3 className={styles["titulo-style"]} ref={textoTituloRef}>{titulo}</h3>
                <p className={styles["valor"]} ref={valorRef}>{valor}</p>
                <div ref={avaliacaoRef} className={styles["avaliacao"]}>
                    <img ref={estrelaRef} src={estrela} alt="" />
                    <p ref={precoRef}>{nota}</p>
                </div>
            </div>
            <div ref={infosRef} className={styles["infos"]}>
                <div ref={subTRef} className={styles["subT"]}>
                    <p>{subT}</p>
                </div>
                <div className={styles["box"]}>
                    <div className={styles["alignner"]}>
                        <img src={local} alt="" />
                    </div>
                    <p>{end}</p>
                </div>
                <div className={styles["box"]}>
                    <div className={styles["alignner"]}>
                        <img src={wppIcon} alt="" />
                    </div>
                    <p>{tel}</p>
                </div>
            </div>
        </div>
    );
};

export default CardContent;
