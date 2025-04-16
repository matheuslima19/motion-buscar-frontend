import React, { useState } from "react";
import Input from "../input/Input";
import styles from "./PageStart.module.css";
import local from "../../utils/assets/localizacao.svg";
import lupa from "../../utils/assets/lupa.svg";

const PageStart = ({ pagina, filtro, setPalavraChave }) => {
  const [localizacao, setLocalizacao] = useState("");

  return (
    <div className={styles["container"]}>
      <div className={styles["loc"]}>
      
      </div>
      <div className={styles["page-name"]}>
        <span className={styles["titulo"]}>{pagina}</span>
        <Input
          id={"inp_b"}
          texto={"Palavra-Chave"}
          imagem={lupa}
          height={"6vh"}
          width={"12vw"}
          onChange={(e) => setPalavraChave(e.target.value)}
        />
      </div>
      <div className={styles["filtros"]}>
        {filtro}
      </div>
    </div>
  );
};

export default PageStart;
