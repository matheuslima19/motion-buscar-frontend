import React, { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import imgHome from "../../utils/assets/home.svg";
import imgOficinas from "../../utils/assets/carro.svg";
import imgPecas from "../../utils/assets/maleta.svg";
import imgServicos from "../../utils/assets/ferramenta.svg";
import imgMeusServicos from "../../utils/assets/file.svg"
import logo from "../../utils/assets/logo.svg";
import Botao from "../botao/Botao";
import imgPerfil from "../../utils/assets/perfil.svg"
import { useNavigate } from "react-router-dom";

const NavBar = ({ currentPage }) => {
    var navigate = useNavigate();

    const [logado, setLogado] = useState("")
    const [nome, setNome] = useState("");
    const imagem = sessionStorage.getItem("imagem")

    function mudarPagina(pagina) {
        navigate(pagina);
    }

    const pageClasses = {
        home: currentPage === "home" ? styles.active : "",
        oficinas: currentPage === "oficinas" ? styles.active : "",
        servicos: currentPage === "servicos" ? styles.active : "",
        pecas: currentPage === "pecas" ? styles.active : "",
        meusServicos: currentPage === "meusServicos" ? styles.active : "",
    };

    useEffect(() => {
        setLogado(sessionStorage.getItem("logged"))
        setNome(sessionStorage.getItem("nome"))
    }, [])

    return (
        <nav>
            <div className={styles["logo"]}>
                <img src={logo} alt="Logo" onClick={() => navigate("/")} />
            </div>
            <div className={styles["menu"]}>
                <span onClick={() => mudarPagina("/")} className={pageClasses.home}>
                    <img src={imgHome} alt="Home" />
                    <p>Home</p>
                </span>
                <span onClick={() => mudarPagina("/oficinas")} className={pageClasses.oficinas}>
                    <img src={imgOficinas} alt="Oficinas" />
                    <p>Oficinas</p>
                </span>
                <span onClick={() => mudarPagina("/servicos")} className={pageClasses.servicos}>
                    <img src={imgServicos} alt="Serviços" />
                    <p>Serviços</p>
                </span>
                <span onClick={() => mudarPagina("/pecas")} className={pageClasses.pecas}>
                    <img src={imgPecas} alt="Peças" />
                    <p>Peças</p>
                </span>
                {logado ? (
                    <span onClick={() => mudarPagina("/perfil")} className={pageClasses.meusServicos}>
                        <img src={imgPerfil} alt="Perfil" />
                        <p>Meu Perfil</p>
                    </span>
                ) : (
                    <span onClick={() => mudarPagina("/meusServicos")} className={pageClasses.meusServicos}>
                        <img src={imgMeusServicos} alt="Meus Serviços" />
                        <p>Meus Serviços</p>
                    </span>
                )}
            </div>
            {logado ? (
                <div className={styles["perfil"]}>
                    <div className={styles["fotoPerfil"]}>
                        <img src={imagem} alt="" />
                    </div>
                    <div className={styles["infosPessoais"]}>
                        <p>Boa Tarde,</p>
                        <span>{nome}</span>
                    </div>
                </div>
            ) :
                (
                    <div className={styles["botoes"]}>
                        <Botao texto={"Cadastrar"} cor={"#3B563C"} onClick={() => navigate("/cadastro")} />
                        <Botao texto={"Entrar"} cor={"#F4F2ED"} corFont={"#3B563C"} onClick={() => navigate("/login")} />
                    </div>
                )}
        </nav>
    );
};

export default NavBar;
