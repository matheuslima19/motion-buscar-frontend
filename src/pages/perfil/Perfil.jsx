import React, { useState, useRef, useEffect } from "react";
import styles from "./Perfil.module.css";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import FormInput from "../../components/formInput/FormImput";
import logoMotion from "../../utils/assets/motion-logo.svg";
import perfil from "../../utils/assets/perfil.svg";
import file from "../../utils/assets/file.svg";
import lapis from "../../utils/assets/lapis.svg";
import disquete from "../../utils/assets/disquete.svg";
import { api2 } from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Botao from "../../components/botao/Botao";
import Swal from 'sweetalert2'
import { createClient } from "@supabase/supabase-js";
import Loader from "../../components/loader/Loader";

const Perfil = () => {

    const navigate = useNavigate();
    const idUser = sessionStorage.getItem("idUsuario");
    
    const [isLoading, setIsLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [email, setEmail] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confSenha, setConfSenha] = useState("");
    const [mudandoSenha, setMudandoSenha] = useState(false);
    const perfilPadrao = sessionStorage.getItem("imagem");

    const supabaseUrl = "https://jeyoqssrkcibrvhoobsk.supabase.co"
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleW9xc3Nya2NpYnJ2aG9vYnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1MzYzOTMsImV4cCI6MjAyOTExMjM5M30.laseDYQK0WEdEY764voRE3nZMOqwqMth2mdVyJHO4wU"
    const supabase = createClient(supabaseUrl, supabaseKey)


    const saveButtonRef = useRef(null);
    const backModalRef = useRef(null);

    const config = {
        headers: {
            "Authorization": `Bearer ${window.atob(sessionStorage.getItem("token"))}`
        }
    }
    const data = {
        nome: nome,
        sobrenome: sobrenome,
        email: email,
    }

    async function saveChanges() {
        api2.put(`/usuarios/${idUser}`, data, config)
            .then((response) => {
                toast.success("Modificações salvas!")
                sessionStorage.setItem("nome", response.data.nome)
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            }).catch((e) => {
                console.log("Erro" + e)
                toast.error("Erro!")
            })
    }

    async function changePassword() {
        api2.put(`/usuarios/atualizar-senha/${idUser}`, {
            senhaAntiga: senhaAtual,
            senhaNova: novaSenha
        }, config).then(() => {
            changeModal()
            toast.success("Senha alterada com sucesso")
            sessionStorage.clear()
            navigate("/login")
        }).catch((e) => {
            console.log("Erro" + e)
            toast.error("Erro ao mudar senha")
        })
    }



    useEffect(() => {
        const getDados = async () => {
            try {
                const response = await api2.get(`/usuarios/${idUser}`);
                setNome(response.data.nome);
                setSobrenome(response.data.sobrenome);
                setEmail(response.data.email);
            } catch (e) {
                console.log("Erro: " + e);
                toast.error("Erro ao carregar os dados");
            }
        };

        getDados();
    }, [idUser]);

    useEffect(() => {
        if (editing && saveButtonRef.current) {
            saveButtonRef.current.style.display = "flex";
        } else if (!editing) {
            saveButtonRef.current.style.display = "none";
        }
    }, [editing]);

    function changeModal() {
        setMudandoSenha(!mudandoSenha)
        if (mudandoSenha) {
            backModalRef.current.style.display = "none"
        }
        else {
            backModalRef.current.style.display = "flex"
        }
    }

    function logout() {
        Swal.fire({
            title: 'Deseja realmente sair?',
            showCancelButton: true,
            confirmButtonText: `Sair`,
            cancelButtonText: `Cancelar`,
            confirmButtonColor: "#3B563C",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                toast.success("Deslogado com sucesso.. Redirecionando para login.", {
                    autoClose: 1500
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        })

    }

    const handleFileChange = (e) => {
        uploadImage(e.target.files[0]);
    };

    async function uploadImage(file){
        setIsLoading(true)
        const filePath = `fotosUsuario/${Math.random() + file.name}`
        const { error } = await supabase.storage.from('ofc-photos').upload(filePath, file)
        if (error){
            if(error.statusCode == 415){
                toast.error("Não foi possível alterar a imagem, tipo de arquivo não é suportado")
                setIsLoading(false)
                return
            }if (error.statusCode == 409) {
                toast.error("Não foi possível alterar a imagem, aquivo com nome duplicado, tente novamente!")
                setIsLoading(false)
                return
            }if (error.statusCode == 413) {
                toast.error("Não foi possível alterar a imagem, arquivo grande demais!")
                setIsLoading(false)
                return
            }
            toast.error("Erro desconhecido ao alterar imagem, tente novamente")
            return
        }

        const publicUrl = supabase.storage.from("ofc-photos").getPublicUrl(filePath).data.publicUrl

        await api2.put(`/usuarios/atualizar-foto/${idUser}`, {
            fotoUrl: publicUrl
        }, config).then((response) =>{
            setIsLoading(false)
            console.log(response)
            sessionStorage.setItem("imagem", publicUrl)
            toast.success("Imagem alterada com sucesso, atualizando em 2 segundos",{
                autoClose: 1900
            })
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }).catch((e) =>{
            setIsLoading(false)
            console.error("Erro ao atualizar imagem: " +e)
            toast.error("Erro ao atualizar imagem!" + e)
        })
    }

    



    const handleNavigate = () => {
        navigate(`/meusServicos`);
    }

    return (
        <>
            <Loader show={isLoading} />
            <div ref={backModalRef} className={styles["back-modal"]}>
                <div className={styles["modal-senha"]}>
                    <div className={styles["form-senha"]}>
                        <FormInput
                            backgroundColor={"#eceae59e"}
                            label={"Senha atual*"}
                            width={"11vw"}
                            id={"inp_senhaAtual"}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                            value={senhaAtual}
                            type={"password"}
                        />
                        <FormInput
                            backgroundColor={"#eceae59e"}
                            label={"Nova senha*"}
                            width={"11vw"}
                            id={"inp_novaSenha"}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            value={novaSenha}
                            type={"password"}
                        />
                        <FormInput
                            backgroundColor={"#eceae59e"}
                            label={"Confirmar senha*"}
                            width={"11vw"}
                            id={"inp_confSenha"}
                            onChange={(e) => setConfSenha(e.target.value)}
                            value={confSenha}
                            type={"password"}
                        />
                    </div>
                    <div className={styles["botoes"]}>
                        <Botao
                            texto={"Cancelar"}
                            width={"9vw"}
                            onClick={changeModal}
                            cor={"transparent"}
                            corFont={"#3B563C"}
                        />
                        <Botao
                            texto={"Salvar"}
                            width={"9vw"}
                            onClick={changePassword}
                        />
                    </div>
                </div>
            </div>
            <NavBar currentPage={"meusServicos"} />
            <section className={styles.content}>
                <div className={styles["left-side"]}>
                    <div className={styles.secoes}>
                        <div className={styles.secao}>
                            <img src={perfil} alt="" />
                            <p>Meu Perfil</p>
                        </div>
                        <div className={styles.secao} onClick={handleNavigate}>
                            <img src={file} alt="" />
                            <p>Meus Serviços</p>
                        </div>
                    </div>
                    <div className={styles["logo-motion"]}>
                        <img src={logoMotion} alt="" />
                    </div>
                </div>
                <div className={styles["right-side"]}>
                    <span onClick={() => setEditing(!editing)} className={styles.lapis}>
                        <img src={lapis} alt="" />
                    </span>
                    <div className={styles.fotoPerfil}>
                        <img src={perfilPadrao} alt="" />
                    </div>
                    <div className={styles.form}>
                        <FormInput
                            backgroundColor={"#eceae59e"}
                            label={"Nome"}
                            width={"10.9vw"}
                            id={"inp_nome"}
                            onChange={(e) => setNome(e.target.value)}
                            value={nome}
                            readOnly={!editing}
                        />
                        <FormInput
                            backgroundColor={"#eceae59e"}
                            label={"Sobrenome"}
                            width={"10.9vw"}
                            id={"inp_sobrenome"}
                            onChange={(e) => setSobrenome(e.target.value)}
                            value={sobrenome}
                            readOnly={!editing}
                        />
                        <FormInput
                            backgroundColor={"#eceae59e"}
                            label={"Email"}
                            width={"26vw"}
                            id={"inp_email"}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            readOnly={!editing}
                        />
                    </div>
                    <div className={styles["botoes"]}>
                        <Botao
                            texto={"Alterar Senha"}
                            width={"9vw"}
                            onClick={changeModal}
                        />
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Botao
                            texto={"Alterar Foto"}
                            width={"8vw"}
                            onClick={() => document.getElementById('fileInput').click()}
                        />
                        <Botao
                            texto={"Sair"}
                            width={"5vw"}
                            onClick={logout}
                        />
                        <div ref={saveButtonRef} className={styles.save} onClick={() => { saveChanges() }}>
                            <img src={disquete} alt="" />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Perfil;