import React, { useState } from "react";
import styles from "./MeusServicos.module.css"
import FormInput from "../../components/formInput/FormImput";
import logoBuscar from "../../utils/assets/logo.svg"
import Botao from "../../components/botao/Botao";
import imagemFundo from "../../utils/assets/img-login.svg"
import { useNavigate } from "react-router-dom";
import { api1 } from "../../api";
import { toast } from "react-toastify";

const MeusServicos = () => {

  const navigate = useNavigate();

  const [token, setToken] = useState("");

  const handleOs = (token) => {
    api1.get(`ordemDeServicos/token/${token}`).then(() =>{
      navigate(`/ordemServico/${token}`);
    }).catch((e) =>{
      console.log(e)
      if(e.response.status === 404){
        toast.error("Ordem de serviço não encontrada");
        return
      }
    })
  };


  return (
    <>
      <div className={styles["content"]}>
        <h1>Meus Serviços</h1>
        <p>Informe o Token que sua oficina forneceu para visualização</p>
        <div className={styles["container"]}>
          <div className={styles["form"]}>
            <FormInput label={"Token*"} width={"20vw"} id={"inp_token"} onChange={(e) => setToken(e.target.value)} value={token} />
          </div>
          <div className={styles["botoes"]}>
            <Botao texto={"Voltar"} cor={"#F4F2ED"} corFont={"#3B563C"} width={"8vw"} onClick={() => navigate("/")} />
            <Botao texto={"Acessar"} width={"8vw"} onClick={() => handleOs(token)}/>
          </div>
        </div>
        <div className={styles["logo"]}>
          <img src={logoBuscar} alt="Logo Buscar" onClick={() => navigate("/")} style={{ cursor: "pointer" }} />
        </div>
        <div className={styles["background-img"]}>
          <img src={imagemFundo} alt="Imagem fundo" />
        </div>
      </div>
    </>
  )
}
export default MeusServicos;