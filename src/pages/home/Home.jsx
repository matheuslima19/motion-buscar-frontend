import React, { useState, useEffect } from "react";
import NavBar from "../../components/navbar/NavBar";
import styles from "./Home.module.css";
import axios from "axios";
import { api1, api2 } from "../../api";
import Input from "../../components/input/Input";
import local from "../../utils/assets/localizacao.svg";
import CardContent from "../../components/cardContent/CardContent";
import { useNavigate } from "react-router-dom";
import lupa from "../../utils/assets/lupa-branca.svg"
import carrosCinza from "../../utils/assets/carrosSombreados.svg"
import Footer from "../../components/footer/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [carrosData, setCarrosData] = useState([]);
  const [motosData, setMotosData] = useState([]);

  const fetchOficinas = async (tipo) => {
    try {
      const response = await api1.get(`/oficinas/tipo-veiculo?tipo=${tipo}`);
      const { data } = response;

      const updatedData = await Promise.all(
        data.map(async (oficina) => {
          try {
            if (!oficina.hasBuscar) return null;

            const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${oficina.cep}/json/`);
            const notaResponse = await api2.get(`/avaliacoes/media-notas-oficina/${oficina.id}`);
            const viaCepData = viaCepResponse.data;
            const notaOficina = notaResponse.data;

            return {
              ...oficina,
              logradouro: viaCepData.logradouro,
              nota: parseFloat(notaOficina.nota).toFixed(1),
            };
          } catch (error) {
            console.error(`Erro ao buscar dados para o CEP ${oficina.cep}:`, error);
            return {
              ...oficina,
              logradouro: 'Logradouro não encontrado',
            };
          }
        })
      );

      return updatedData.filter((item) => item !== null).sort((a, b) => b.nota - a.nota).slice(0, 4);
    } catch (e) {
      console.log("Erro: ", e);
      return [];
    }
  };

  useEffect(() => {
    const getOficinas = async () => {
      const carros = await fetchOficinas('carro');
      const motos = await fetchOficinas('moto');
      setCarrosData(carros);
      setMotosData(motos);
    };
    getOficinas();
  }, []);

  const handleCard = (id) => {
    navigate(`/oficinas/${id}`);
  };

  return (
    <main>
      <NavBar currentPage={"home"} />
      <div className={styles["startPage"]}>
        <div className={styles["titulo"]}>
          <h1>Onde a busca ganha velocidade.</h1>
          <p>Encontre sua oficina!</p>
        </div>
      
      </div>
      <div className={styles["carros"]}>
        <img src={carrosCinza} width={"120%"}  alt="" />
      </div>
      <div className={styles["oficinas"]}>
        <div className={styles["title"]}>
          <h2>Para seu Carro</h2>
          <p>Oficinas Bem avaliadas nos últimos dias</p>
        </div>
        <div className={styles["cards"]}>
          {carrosData &&
            carrosData.map((data) => (
              <CardContent
                key={data.id}
                type={"Oficina"}
                titulo={data.nome}
                end={`${data.logradouro}, ${data.numero}`}
                tel={data.informacoesOficina.whatsapp || "N/A"}
                nota={data.nota}
                imagem={data.logoUrl}
                onclickCard={() => handleCard(data.id)}
              />
            ))}
        </div>
        <div className={styles["title"]}>
          <h2>Para sua Moto</h2>
          <p>Oficinas Bem avaliadas nos últimos dias</p>
        </div>
        <div className={styles["cards"]}>
          {motosData &&
            motosData.map((data) => (
              <CardContent
                key={data.id}
                type={"Oficina"}
                titulo={data.nome}
                end={`${data.logradouro}, ${data.numero}`}
                tel={data.informacoesOficina.whatsapp || "N/A"}
                nota={data.nota}
                imagem={data.logoUrl}
                onclickCard={() => handleCard(data.id)}
              />
            ))}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Home;