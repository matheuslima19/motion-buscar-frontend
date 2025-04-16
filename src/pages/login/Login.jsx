import React, { useEffect, useState } from "react";
import styles from "./Login.module.css"
import FormInput from "../../components/formInput/FormImput";
import logoBuscar from "../../utils/assets/logo.svg"
import Botao from "../../components/botao/Botao";
import imagemFundo from "../../utils/assets/img-login.svg"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api2 } from "../../api";
import {
    useGoogleLogin,
} from "@react-oauth/google";
import Loader from "../../components/loader/Loader";
import perfilPadrao from "../../utils/assets/userpadrao.svg"

const Login = () => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [sub, setSub] = React.useState("");

    async function handleEntrar() {
        setIsLoading(true)
        api2.post("/usuarios/login", {
            email: email.toLowerCase(),
            senha: senha
        }).then((response) => {
            toast.success("Login realizado com sucesso!");
            navigate("/")
            sessionStorage.setItem("logged", true)
            sessionStorage.setItem("nome", response.data.nome)
            sessionStorage.setItem("idUsuario", response.data.idUsuario)
            sessionStorage.setItem("token", window.btoa(response.data.token))
            sessionStorage.setItem("imagem", response.data.fotoUrl || perfilPadrao)
            console.log(response.data.fotoUrl)
        }).catch((e) => {
            if (e.response.status === 401 || e.response.status === 404) {
                toast.error("Email ou senha incorretos.")
                setVisualErrorEffects()
            } else if (e.response.status === 400) {
                toast.error("Preencha todos os campos corretamente.")
                setVisualErrorEffects(400)
            } else if (e.response.status === 409) {
                toast.error("Email cadastrado com Google. Por favor, faça login com o Google.")
                setVisualErrorEffects()
            } 
            else {
                toast.error("Ocorreu um erro inesperado. Tente novamente ou entre em contato na nossa página")
            }
            setIsLoading(false)
        })
    }

    useEffect(() => {
        let email = document.getElementById("inp_email")
        let senha = document.getElementById("inp_senha")

        const inps = [email, senha]
        inps.forEach((inp) => {
            inp.addEventListener("focus", () => {
                inp.style.borderColor = "#4fa94d"
            })
            inp.addEventListener("focusout", () => {
                inp.style.borderColor = "#F8F7F4"
            })
        })
    }, []);
    function setVisualErrorEffects(status) {
        let email = document.getElementById("inp_email")
        let senha = document.getElementById("inp_senha")
        const inps = [email, senha]

        inps.forEach((inp) => {
            if (status === 400) {
                if (inp.value === "") {
                    inp.style.borderColor = 'red'
                }
            } else {
                inp.style.borderColor = 'red'
            }
        })
        setTimeout(() => {
            inps.forEach((inp) => {
                inp.style.borderColor = '#F8F7F4'
            })
        }, 2500);
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);

        await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ` + credentialResponse.access_token,
            },
        })
            .then(response => response.json())
            .then(async data => {
                api2.post("/usuarios/login-google", {
                    email: data.email,
                    googleSub: data.sub
                })
                    .then(async response => {
                        toast.success('Login realizado com sucesso!');
                        navigate("/");
                        sessionStorage.setItem("logged", true)
                        sessionStorage.setItem("nome", response.data.nome)
                        sessionStorage.setItem("idUsuario", response.data.idUsuario)
                        sessionStorage.setItem("token", window.btoa(response.data.token))
                        sessionStorage.setItem("imagem", response.data.fotoUrl || perfilPadrao)
                        setIsLoading(false);
                    })
                    .catch(async error => {
                        api2.post("/usuarios/cadastrar-google", {
                            email: data.email,
                            googleSub: data.sub,
                            nome: data.given_name,
                            fotoUrl: data.picture,
                            sobrenome: data.family_name
                        })
                            .then(async response => {
                                toast.success('Cadastro realizado com sucesso!');
                                api2.post("/usuarios/login-google", {
                                    email: data.email,
                                    googleSub: data.sub
                                })
                                    .then(async response => {
                                        toast.success('Login realizado com sucesso!');
                                        navigate("/");
                                        sessionStorage.setItem("logged", true)
                                        sessionStorage.setItem("nome", response.data.nome)
                                        sessionStorage.setItem("idUsuario", response.data.idUsuario)
                                        sessionStorage.setItem("token", window.btoa(response.data.token))
                                        sessionStorage.setItem("imagem", response.data.fotoUrl || perfilPadrao)
                                    })
                                    .catch(error => {
                                        console.log(error);
                                        toast.error('Erro ao realizar login após cadastro.');
                                    });
                            })
                            .catch(error => {
                                if (error.response.status === 409) {
                                    toast.error('Email cadastrado com validação comum, por favor, faça login com email e senha.');
                                    setIsLoading(false);
                                }else{
                                toast.error('Erro ao realizar cadastro.');
                                setIsLoading(false);
                                }
                            });
                    });
            })
            .catch(error => {
                console.log("Erro ao obter informações do usuário:", error);
                toast.error('Erro ao conectar com o Google');
                setIsLoading(false);
            });
    };

    const handleGoogleFail = () => {
        toast.error('Falha ao logar com o Google');
    }

    const handleGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleFail,
        ux_mode: 'popup'
    });

    return (
        <>
            <Loader show={isLoading} />
            <div className={styles["content"]}>
                <div className={styles["left-side"]}>
                    <div className={styles["container"]}>
                        <img src={logoBuscar} alt="Logo buscar" width={"25%"} onClick={() => navigate("/")} />
                        <div className={styles["form"]}>
                            <FormInput label={"Email*"} width={"20vw"} id={"inp_email"} onChange={(e) => {
                                setEmail(e.target.value)
                            }} />
                            <FormInput label={"Senha*"} width={"20vw"} id={"inp_senha"} onChange={(e) => setSenha(e.target.value)} type="password" />
                            <a href="/recuperarSenha">Esqueci minha senha</a>
                        </div>
                        <Botao texto={"Entrar"} width={"10vw"} onClick={(handleEntrar)} />
                        <Botao texto={"G"} cor={"#F4F2ED"} corFont={"#3B563C"} width={"3vw"} onClick={(handleGoogle)} />
                    </div>
                    <a href="/cadastro">Sem login? Cadastre-se</a>
                </div>
                <div className={styles["right-side"]}>
                    <h1>Onde a busca ganha velocidade.</h1>
                    <img src={imagemFundo} alt="Imagem fundo" />
                </div>
            </div>
        </>
    )
}
export default Login;