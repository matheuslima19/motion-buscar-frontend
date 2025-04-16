import React, { useEffect, useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import PageStart from "../../components/pageStart/PageStart";
import Input from "../../components/input/Input";
import seta from "../../utils/assets/seta.svg";
import lupa from "../../utils/assets/lupa-branca.svg"
import styles from "./Oficinas.module.css";
import CardContent from "../../components/cardContent/CardContent";
import { api1, api2 } from "../../api";
import axios from "axios";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Oficinas = () => {
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState([]);
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [propulsao, setPropulsao] = useState("");
  const [marca, setMarca] = useState("");
  const [palavraChave, setPalavraChave] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const tipoVeiculoOptions = ["Carro", "Moto", "Caminhão", "Ônibus", ""];
  const propulsaoOptions = ["Combustão", "Híbrido", "Elétrico", ""];
  const marcaOptions = ["Agrale", "Bepobus", "Chevrolet", "Ciccobus", "Daf", "Effa-Jmc", "Fiat", "Ford", "Foton", "Gmc", "Hyundai", "Iveco", "Jac", "Man", "Marcopolo", "Mascarello", "Maxibus", "Mercedes-Benz", "Navistar", "Neobus", "Puma-Alfa", "Saab-Scania", "Scania", "Shacman", "Sinotruk", "Volkswagen", "Volvo", "Walkbus", "Acura", "Alfa Romeo", "Am Gen", "Asia Motors", "Aston Martin", "Audi", "Baby", "Bmw", "Brm", "Bugre", "Byd", "Cab Motors", "Cadillac", "Caoa Chery", "Caoa Chery/Chery", "Cbt Jipe", "Chana", "Changan", "Chrysler", "Citroën", "Cross Lander", "D2d Motors", "Daewoo", "Daihatsu", "Dfsk", "Dodge", "Effa", "Engesa", "Envelo", "Ferrari", "Fibravan", "Fyber", "Geely", "Gm - Chevrolet", "Great Wall", "Gurgel", "Gwm", "Hafei", "Hitech Electric", "Honda", "Isuzu", "Jaguar", "Jeep", "Jinbei", "Jpx", "Kia Motors", "Lada", "Lamborghini", "Land Rover", "Lexus", "Lifan", "Lobini", "Lotus", "Mahindra", "Maserati", "Matra", "Mazda", "Mclaren", "Mercury", "Mg", "Mini", "Mitsubishi", "Miura", "Nissan", "Peugeot", "Plymouth", "Pontiac", "Porsche", "Ram", "Rely", "Renault", "Rolls-Royce", "Rover", "Saab", "Saturn", "Seat", "Seres", "Shineray", "Smart", "Ssangyong", "Subaru", "Suzuki", "Tac", "Toyota", "Troller", "Vw - Volkswagen", "Wake", "Walk", "Adly", "Amazonas", "Aprilia", "Atala", "Avelloz", "Bajaj", "Bee", "Benelli", "Beta", "Bimota", "Brandy", "Brava", "Brp", "Buell", "Bueno", "Bull", "Bycristo", "Cagiva", "Caloi", "Daelim", "Dafra", "Dayang", "Dayun", "Derbi", "Ducati", "Emme", "Fever", "Fox", "Fusco Motosegura", "Fym", "Garinni", "Gas Gas", "Green", "Haobao", "Haojue", "Harley-Davidson", "Hartford", "Hero", "Husaberg", "Husqvarna", "Indian", "Iros", "Jiapeng Volcano", "Johnnypag", "Jonny", "Kahena", "Kasinski", "Kawasaki", "Ktm", "Kymco", "Landum", "L'Aquila", "Lavrale", "Lerivo", "Lon-V", "Magrão Triciclos", "Malaguti", "Miza", "Moto Guzzi", "Motocar", "Motorino", "Mrx", "Mv Agusta", "Mvk", "Niu", "Orca", "Pegassi", "Piaggio", "Polaris", "Regal Raptor", "Riguete", "Royal Enfield", "Sanyang", "Siamoto", "Sundown", "Super Soco", "Targos", "Tiger", "Traxx", "Triumph", "Ventane Motors", "Vento", "Voltz", "Watts", "Wuyang", "Yamaha", "Zontes", ""];

  const validateInput = (value, options) => {
    return options.includes(value);
  };

  const getOficinas = async (tipoVeiculo, propulsao, marca, palavraChave) => {
    if (!validateInput(tipoVeiculo, tipoVeiculoOptions)) {
      toast.error('Tipo de Veículo inválido');
      return;
    }

    if (!validateInput(propulsao, propulsaoOptions)) {
      toast.error('Propulsão inválida');
      return;
    }

    if (!validateInput(marca, marcaOptions)) {
      toast.error('Marca inválida');
      return;
    }

    try {
      const response = await api1.get(`/oficinas/tipo-veiculo-propulsao-marca-nome?tipoVeiculo=${tipoVeiculo}&tipoPropulsao=${propulsao}&marca=${marca}&nome=${palavraChave}`);
      const { data } = response;
      
      if (response.status === 204){
        setCardsData("")
        document.getElementById("no-content").style.display = "flex"
        setIsLoading(false)
        return
      }

      const promises = data.map(async (oficina) => {
        if (!oficina.hasBuscar) return null;

        try {
          const viaCepPromise = axios.get(`https://viacep.com.br/ws/${oficina.cep}/json/`);
          const notaPromise = api2.get(`/avaliacoes/media-notas-oficina/${oficina.id}`);

          const [viaCepResponse, notaResponse] = await Promise.all([viaCepPromise, notaPromise]);

          const viaCepData = viaCepResponse.data;
          const notaOficina = notaResponse.data;

          return {
            ...oficina,
            logradouro: viaCepData.logradouro,
            nota: parseFloat(notaOficina.nota).toFixed(1)
          };
        } catch (error) {
          setIsLoading(false);
          console.error(`Erro ao buscar dados para o CEP ${oficina.cep}:`, error);
          return {
            ...oficina,
            logradouro: 'Logradouro não encontrado',
          };
        }
      });

      const updatedData = await Promise.all(promises);
      const filteredData = updatedData.filter((item) => item !== null);

      setCardsData(filteredData);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log("Erro: ", e);
    }
  };

  useEffect(() => {
    getOficinas(tipoVeiculo, propulsao, marca, palavraChave);
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
      <Input 
        id={"inp_propulsao"} 
        texto={"Propulsão"} 
        imagem={seta} 
        height={"6vh"} 
        width={"9vw"} 
        tamImg={"1vh"} 
        marginRight={"1.5vw"} 
        onChange={(e) => setPropulsao(e.target.value)} 
        value={propulsao} 
        options={propulsaoOptions} 
      />
      <Input 
        id={"inp_marca"} 
        texto={"Marca"} 
        imagem={seta} 
        height={"6vh"} 
        width={"9vw"} 
        tamImg={"1vh"} 
        marginRight={"1.5vw"} 
        onChange={(e) => setMarca(e.target.value)} 
        value={marca} 
        options={marcaOptions} 
      />
    </>
  );

  return (
    <main>
      <ToastContainer />
      <Loader show={isLoading} />
      <NavBar currentPage={"oficinas"} />
      <PageStart pagina={"Oficinas"} filtro={filtros} setPalavraChave={setPalavraChave} />
      <div onClick={() => getOficinas(tipoVeiculo, propulsao, marca, palavraChave)} className={styles["pesquisa"]}>
        <img src={lupa} alt="Buscar" />
      </div>
      {!cardsData.length == 0 ? (
        <div className={styles["content"]}>
        {cardsData.map((data) => (
            <CardContent
              key={data.id}
              type={"Oficina"}
              titulo={data.nome}
              end={data.logradouro + ", " + data.numero}
              tel={data.informacoesOficina.whatsapp || "N/A"}
              nota={data.nota}
              imagem={data.logoUrl}
              onclickCard={() => handleCard(data.id)}
            />
          ))}
      </div>
      ) :(
        <div id="no-content" className={styles["no-content"]}>
          Nenhuma oficina foi encontrada com esses filtros!
        </div>
      )}
      
      <Footer />
    </main>
  );
};

export default Oficinas;