import React, { useState,useEffect } from "react";
import styles from "./Cadastro.module.css"
import FormInput from "../../components/formInput/FormImput";
import logoBuscar from "../../utils/assets/logo.svg"
import Botao from "../../components/botao/Botao";
import imagemFundo from "../../utils/assets/img-cadastro.svg"
import { api2 } from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cadastro = () => {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const capitalizeInitials = (str) => {
        return str.toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
    };
    

    async function handleCadastrar() {
        api2.post("/usuarios/cadastrar", {
            nome: capitalizeInitials(nome),
            sobrenome: capitalizeInitials(sobrenome),
            email: email.toLowerCase(),
            senha: senha
        }).then((response) => {
            console.log(response.data);
            toast.success("Cadastro realizado com sucesso!");
            navigate("/login")
        }).catch((e) => {
            if(e.response.status === 400){
                toast.error("Preencha todos os campos corretamente.")
                setVisualErrorEffects(400)
            }else if(e.response.status === 409){
                toast.error("Email já cadastrado.")
            }else{
                toast.error("Ocorreu um erro inesperado. Tente novamente ou entre em contato na nossa página")
            }
        })
    }


    useEffect(() => {
        let email = document.getElementById("inp_email")
        let senha = document.getElementById("inp_senha")
        let sobrenome = document.getElementById("inp_sobrenome")
        let nome = document.getElementById("inp_nome")

        const inps = [email, senha,sobrenome,nome]
        inps.forEach((inp) => {
            inp.addEventListener("focus", () => {
                inp.style.borderColor = "#4fa94d"
            })
            inp.addEventListener("focusout", () => {
                inp.style.borderColor = "#F8F7F4"
            })
        })
    },[]);
    function setVisualErrorEffects(status){
        let email = document.getElementById("inp_email")
        let senha = document.getElementById("inp_senha")
        let sobrenome = document.getElementById("inp_sobrenome")
        let nome = document.getElementById("inp_nome")

        const inps = [email, senha,sobrenome,nome]

        inps.forEach((inp) => {
            if(status === 400){
                if(inp.value === ""){
                    inp.style.borderColor = 'red'
                }
            }else{
                inp.style.borderColor = 'red'
            }
        })
        setTimeout(() => {
           inps.forEach((inp) => {
                inp.style.borderColor = '#F8F7F4'
           })
        }, 2500);
    }

    return (
        <div className={styles["content"]}>
            <div className={styles["left-side"]}>
                <h1>Busque por oficinas, serviços e peças.</h1>
                <img src={imagemFundo} alt="Imagem fundo" />
            </div>
            <div className={styles["right-side"]}>
                <div className={styles["container"]}>
                    <img src={logoBuscar} alt="Logo buscar" onClick={() => navigate("/")} />
                    <div className={styles["form"]}>
                        <FormInput label={"Nome*"} width={"9.99vw"} id={"inp_nome"} onChange={(e) => setNome(e.target.value)} />
                        <FormInput label={"Sobrenome*"} width={"9.99vw"} id={"inp_sobrenome"} onChange={(e) => setSobrenome(e.target.value)} />
                        <FormInput label={"Email*"} width={"23vw"} id={"inp_email"} onChange={(e) => setEmail(e.target.value)} />
                        <FormInput label={"Senha*"} width={"16vw"} id={"inp_senha"} onChange={(e) => setSenha(e.target.value)} type="password" />
                    </div>
                    <Botao texto={"Cadastrar"} width={"10vw"} onClick={(handleCadastrar)} />
                </div>
                <a href="/login">Já tem cadastro? Faça login</a>
            </div>
        </div>
    )
}
export default Cadastro;