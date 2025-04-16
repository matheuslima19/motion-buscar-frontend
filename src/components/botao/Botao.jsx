import React from "react";
import style from "./Botao.module.css"

const Botao = ({texto, cor = "#3B563C", corFont = "#FFFFFF", onClick = null, width}) => {
  return (
    <button className={style["botao"]} onClick={onClick} style={{backgroundColor: cor, color: corFont, width:width}}>{texto}</button>
  );
};

export default Botao;