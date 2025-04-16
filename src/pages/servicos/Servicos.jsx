import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/navbar/NavBar";
import PageStart from "../../components/pageStart/PageStart";
import Input from "../../components/input/Input";
import seta from "../../utils/assets/seta.svg";
import styles from "./Servicos.module.css";
import CardContent from "../../components/cardContent/CardContent";
import { api1, api2 } from "../../api";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import lupa from "../../utils/assets/lupa-branca.svg"

const Servicos = () => {
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState([]);
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [palavraChave, setPalavraChave] = useState("");
  const [isLoading, setIsLoading] = useState(true)

  const tipoVeiculoOptions = ["Carro", "Moto", "Caminhão", "Ônibus", ""];

  const validateInput = (value, options) => {
    return options.includes(value);
  };

  const getServicos = async (tipoVeiculo, palavraChave) => {
    if (!validateInput(tipoVeiculo, tipoVeiculoOptions)) {
      toast.error('Tipo de Veículo inválido');
      return;
    }

    try {
      const response = await api1.get(`/buscar-servicos/tipo-veiculo-nome?tipoVeiculo=${tipoVeiculo}&nome=${palavraChave}`);
      const { data } = response;

      if (response.status === 204) {
        setCardsData("")
        document.getElementById("no-content").style.display = "flex"
        setIsLoading(false)
        return
      }

      const updatedData = await Promise.all(
        data.map(async (servico) => {
          if (!servico.oficina.hasBuscar) return null;

          try {
            const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${servico.oficina.cep}/json/`);
            const notaResponse = await api2.get(`/avaliacoes/media-notas-oficina/${servico.oficina.id}`);

            const viaCepData = viaCepResponse.data;
            const notaOficina = notaResponse.data;

            return {
              ...servico,
              logradouro: viaCepData.logradouro,
              nota: parseFloat(notaOficina.nota).toFixed(1),
            };
          } catch (error) {
            setIsLoading(false)
            console.error(`Erro ao buscar dados para o CEP ${servico.oficina.cep}:`, error);
            return {
              ...servico,
              logradouro: "Logradouro não encontrado",
              nota: "N/A", // Padrão para "N/A" se houver um erro ao buscar a nota
            };
          }
        })
      );

      const filteredData = updatedData.filter((item) => item !== null);

      setIsLoading(false)
      setCardsData(filteredData);
    } catch (e) {
      console.error("Erro ao buscar serviços:", e);
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getServicos(tipoVeiculo, palavraChave);
  }, [palavraChave]);

  const handleCard = (id) => {
    navigate(`/oficinas/${id}`);
  };

  const filtros = (
    <>
      <Input
        id={"inp_tpVeiculo"}
        texto={"Tipo de Veículo"}
        imagem={seta}
        height={"6vh"}
        width={"9vw"}
        tamImg={"1vh"}
        marginRight={"1.5vw"}
        onChange={(e) => setTipoVeiculo(e.target.value)}
        value={tipoVeiculo}
        options={tipoVeiculoOptions}
      />

    </>
  );

  return (
    <main>
      <Loader show={isLoading} />
      <NavBar currentPage={"servicos"} />
      <PageStart pagina={"Serviços"} filtro={filtros} setPalavraChave={setPalavraChave} />
      <div onClick={() => getServicos(tipoVeiculo, palavraChave)} className={styles["pesquisa"]}>
        <img src={lupa} alt="Buscar" />
      </div>
      {!cardsData.length == 0 ? (
        <div className={styles["content"]}>
          {cardsData.map((data) => (
            <CardContent
              key={data.id}
              type={"Servico"}
              titulo={data.nome}
              subT={data.oficina.nome}
              end={data.logradouro + ", " + data.oficina.numero}
              tel={data.oficina.informacoesOficina.whatsapp || "N/A"}
              nota={data.nota}
              onclickCard={() => handleCard(data.oficina.id)}
              imagem={"https://jeyoqssrkcibrvhoobsk.supabase.co/storage/v1/object/public/ofc-photos/servicoPadrao.jpg"}
            />
          ))}
        </div>
      ) : (
        <div id="no-content" className={styles["no-content"]}>
          Nenhum serviço encontrado com esses filtros!
        </div>
      )}

      <Footer />
    </main>
  );
};

export default Servicos;
