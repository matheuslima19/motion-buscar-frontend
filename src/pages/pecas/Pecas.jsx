import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/navbar/NavBar";
import PageStart from "../../components/pageStart/PageStart";
import Input from "../../components/input/Input";
import seta from "../../utils/assets/seta.svg";
import styles from "./Pecas.module.css";
import CardContent from "../../components/cardContent/CardContent";
import { api1 } from "../../api";
import Footer from "../../components/footer/Footer";
import lupa from "../../utils/assets/lupa-branca.svg"
import Loader from "../../components/loader/Loader";

const Pecas = () => {
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState([]);
  const [valorMinimo, setValorMinimo] = useState("")
  const [valorMaximo, setValorMaximo] = useState("")
  const [palavraChave, setPalavraChave] = useState("");
  const [isLoading, setIsLoading] = useState(true)

  const getPecas = async (valorMinimo, valorMaximo, palavraChave) => {
    try {
      const response = await api1.get(`/produtoEstoque/preco-nome?precoMinimo=${valorMinimo}&precoMaximo=${valorMaximo}&nome=${palavraChave}`);
      const { data } = response;

      if (response.status === 204) {
        setCardsData("")
        document.getElementById("no-content").style.display = "flex"
        setIsLoading(false)
        return
      }

      const updatedData = await Promise.all(
        data.map(async (peca) => {
          if (!peca.oficina.hasBuscar) return null;

          try {
            const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${peca.oficina.cep}/json/`);

            const viaCepData = viaCepResponse.data;

            return {
              ...peca,
              logradouro: viaCepData.logradouro,
            };
          } catch (error) {
            setIsLoading(false)
            console.error(`Erro ao buscar dados para o CEP ${peca.oficina.cep}:`, error);
            return {
              ...peca,
              logradouro: "Logradouro não encontrado",
            };
          }
        })
      );

      const filteredData = updatedData.filter((item) => item !== null);

      setCardsData(filteredData);
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
      console.error("Erro ao buscar peças:", e);
    }
  };

  useEffect(() => {
    getPecas(valorMinimo, valorMaximo, palavraChave);
  }, [palavraChave]);

  const handleCard = (id) => {
    navigate(`/oficinas/${id}`);
  };

  const filtros = (
    <>
      <Input
        texto={"Valor mínimo"}
        imagem={seta}
        height={"6vh"}
        width={"7vw"}
        tamImg={"1vh"}
        marginRight={"1.5vw"}
        onChange={(e) => setValorMinimo(e.target.value)}
        value={valorMinimo}
      />

      <Input
        texto={"Valor máximo"}
        imagem={seta}
        height={"6vh"}
        width={"7vw"}
        tamImg={"1vh"}
        marginRight={"1.5vw"}
        onChange={(e) => setValorMaximo(e.target.value)}
        value={valorMaximo}
      />
    </>
  );

  return (
    <main>
      <Loader show={isLoading} />
      <NavBar currentPage={"pecas"} />
      <PageStart pagina={"Peças"} filtro={filtros} setPalavraChave={setPalavraChave} />
      <div onClick={() => getPecas(valorMinimo, valorMaximo, palavraChave)} className={styles["pesquisa"]}>
        <img src={lupa} alt="Buscar" />
      </div>
      {!cardsData == 0 ? (
        <div className={styles["content"]}>
          {cardsData.map((data) => (
            <CardContent
              key={data.id}
              type={"Peca"}
              titulo={data.nome}
              subT={data.oficina.nome}
              end={data.logradouro + ", " + data.oficina.numero}
              tel={data.oficina.informacoesOficina.whatsapp || "N/A"}
              nota={"R$" + data.valorVenda}
              onclickCard={() => handleCard(data.oficina.id)}
              imagem={"https://jeyoqssrkcibrvhoobsk.supabase.co/storage/v1/object/public/ofc-photos/pecaPadrao.jpg"}
            />
          ))}
        </div>
      ) :
        (
          <div id="no-content" className={styles["no-content"]}>Nenhuma peça encontrada com esses filtros!</div>
        )}

      <Footer />
    </main>
  );
};

export default Pecas;
