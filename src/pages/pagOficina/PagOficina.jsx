import React, { useState, useEffect } from "react";
import styles from "./PagOficina.module.css";
import Sticker from "../../components/sticker/Sticker";
import estrela from "../../utils/assets/estrela.svg";
import localCinza from "../../utils/assets/localizacao-cinza.svg";
import telCinza from "../../utils/assets/telefone-cinza.svg";
import relogioCinza from "../../utils/assets/relogio-cinza.svg";
import calendarioCinza from "../../utils/assets/calendario-cinza.svg";
import checkCinza from "../../utils/assets/check-cinza.svg";
import check from "../../utils/assets/check.svg";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import { api1, api2 } from "../../api";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import CardContent from "../../components/cardContent/CardContent";
import leftArrow from "../../utils/assets/leftArrow.svg";
import Botao from "../../components/botao/Botao";
import estrelaCinza from "../../utils/assets/estrelaCinza.svg"
import { toast } from "react-toastify";
import BoxAvaliacao from "../../components/boxAvaliacao/BoxAvaliacao";
import perfilPadrao from "../../utils/assets/perfilPadrao.png"

const PagOficina = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para navegação
  const [nomeOficina, setNomeOficina] = useState("");
  const [nota, setNota] = useState("");
  const [qtdAvaliacoes, setQtdAvaliacoes] = useState("");
  const [veiculosTrabalha, setVeiculosTrabalha] = useState([]);
  const [propulsaoTrabalha, setPropulsaoTrabalha] = useState([]);
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [inicioTrabalho, setInicioTrabalho] = useState([]);
  const [fimTrabalho, setFimTrabalho] = useState([]);
  const [imagem, setImagem] = useState("");
  const [diasTrabalha, setDiasTrabalha] = useState([]);
  const [hasBuscar, setHasBuscar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [servicos, setServicos] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComentario, setUserComentario] = useState("");
  const token = atob(sessionStorage.getItem("token"));

  const responsive = {
    0: { items: 1 },
    568: { items: 3 },
    1024: { items: 4 },
  };


  useEffect(() => {
    const isValidId = /^\d+$/.test(id);

    if (!isValidId) {
      navigate("/servicos");
      return;
    }

    async function getOficinaDetails() {
      try {
        const response = await api1.get(`/oficinas/${id}`);
        const data = response.data;
        const avaliacao = await api2.get(`/avaliacoes/media-notas-oficina/${id}`);
        const avaliacaoOficina = avaliacao.data;

        if (!data) {
          navigate("/servicos");
          return;
        }

        setHasBuscar(data.hasBuscar);

        if (!data.hasBuscar) {
          navigate("/servicos");
          return;
        }

        setNomeOficina(data.nome);
        setNota(parseFloat(avaliacaoOficina.nota).toFixed(1));
        setQtdAvaliacoes(avaliacaoOficina.quantidadeAvaliacoes);
        setVeiculosTrabalha(data.informacoesOficina.tipoVeiculosTrabalha.split(";"));
        setPropulsaoTrabalha(data.informacoesOficina.tipoPropulsaoTrabalha.split(";"));
        setTelefone(data.informacoesOficina.whatsapp || "N/A");
        setInicioTrabalho(data.informacoesOficina.horarioIniSem.split(":"));
        setFimTrabalho(data.informacoesOficina.horarioFimSem.split(":"));
        setImagem(data.logoUrl);

        const diasAbertos = data.informacoesOficina.diasSemanaAberto.split(";").map(value => value === "true");
        setDiasTrabalha(diasAbertos);

        buscarEnderecoFormatado(data.cep, data.numero);
        getServicos();
        getPecas();
        getAvaliacoes();
      } catch (error) {
        console.log("Erro ao buscar dados da oficina:", error);
        navigate("/servicos");
      } finally {
        setLoading(false);
      }
    }

    async function buscarEnderecoFormatado(cep, numero) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const { logradouro, bairro, localidade, uf } = response.data;
        const enderecoFormatado = `${logradouro}, ${numero} - ${bairro}, ${localidade}, ${uf}`;
        setEndereco(enderecoFormatado);
      } catch (error) {
        console.error("Erro ao buscar endereço:", error);
        setEndereco("Endereço não encontrado");
      }
    }

    async function getServicos() {
      try {
        const response = await api1.get(`/buscar-servicos/oficina/${id}`);
        setServicos(response.data);
      } catch (error) {
        console.error("Erro ao buscar serviços: ", error);
      }
    }

    async function getPecas() {
      try {
        const response = await api1.get(`/produtoEstoque/oficina/${id}`);
        setPecas(response.data);
      } catch (error) {
        console.error("Erro ao buscar serviços: ", error);
      }
    }

    async function getAvaliacoes() {
      try {
        const response = await api2.get(`/avaliacoes/oficina/${id}`);
        setAvaliacoes(response.data)
      } catch (error) {
        console.error("Erro ao buscar avaliações: " + error)
      }
    }

    getOficinaDetails();
  }, [id, navigate]);

  const capitalizeInitials = (str) => {
    return str.toLowerCase().replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
  };

  function limparTelefone(telefone) {
    return telefone.replace(/\D/g, '');
  }

  const handleMouseOver = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index) => {
    setUserRating(index);
  };

  async function handleSubmit() {
    try {
      const response = await api2.post(`/avaliacoes`, {
        nota: userRating,
        comentario: userComentario,
        fkUsuario: sessionStorage.getItem("idUsuario"),
        fkOficina: id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Após enviar a avaliação com sucesso, obter a nova avaliação do response.data
      const novaAvaliacao = response.data;

      // Adicionar a nova avaliação ao estado local de avaliações
      setAvaliacoes([...avaliacoes, novaAvaliacao]);

      // Limpar o estado local de nota e comentário
      setUserRating(0);
      setUserComentario("");

      toast.success("Avaliação enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  }



  if (loading) {
    return <div>Loading...</div>; // Renderiza um indicador de carregamento enquanto os dados estão sendo obtidos
  }

  if (!hasBuscar) {
    return null; // Se hasBuscar for false, não renderiza nada
  }


  return (
    <main>
      <NavBar currentPage={"oficinas"} />
      <div className={styles["title"]}>
        <div className={styles["nome-ofc"]}>
          <h1>{nomeOficina}</h1>
        </div>
        <div className={styles["redirecionadores"]}>
          <Sticker label={"Google Maps"} type={"local"} onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${endereco}`)} />
          <Sticker label={"WhatsApp"} type={"wpp"} onClick={() => window.open(`https://wa.me/+55${limparTelefone(telefone)}/`)} />
        </div>
      </div>
      <div className={styles["informacoes"]}>
        <div className={styles["left-side"]}>
          <div className={styles["avaliacao"]}>
            <img src={estrela} alt="estrela das avaliações" />
            <p>{nota}</p>
            <p>{`(${qtdAvaliacoes} avaliações)`}</p>
          </div>
          <div className={styles["all-stickers"]}>
            <div className={styles["stickers"]}>
              {propulsaoTrabalha.map((propulsao, index) => (
                <Sticker key={index} label={capitalizeInitials(propulsao)} type={propulsao.toLowerCase()} />
              ))}
            </div>
            <div className={styles["stickers"]}>
              {veiculosTrabalha.map((veiculo, index) => (
                <Sticker key={index} label={capitalizeInitials(veiculo)} type={veiculo.toLowerCase()} />
              ))}
            </div>
          </div>
          <div className={styles["loc-ctt"]}>
            <div className={styles["campo"]}>
              <div className={styles["img-box"]}>
                <img src={localCinza} alt="" />
              </div>
              <p>{endereco}</p>
            </div>
            <div className={styles["campo"]}>
              <div className={styles["img-box"]}>
                <img src={telCinza} alt="" />
              </div>
              <p>{telefone}</p>
            </div>
            <div className={styles["campo"]}>
              <div className={styles["img-box"]}>
                <img src={relogioCinza} alt="" />
              </div>
              <p>{`${inicioTrabalho[0]}:${inicioTrabalho[1]} às ${fimTrabalho[0]}:${fimTrabalho[1]}`}</p>
            </div>
            <div style={{ alignItems: "start" }} className={styles["campo"]}>
              <div className={styles["img-box"]}>
                <img src={calendarioCinza} alt="" />
              </div>
              <div className={styles["checks"]}>
                {diasTrabalha.map((dia, index) => (
                  <div key={index} className={styles["dias"]}>
                    <img src={dia ? check : checkCinza} alt="" />
                    <p>{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][index]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles["right-side"]}>
          <div className={styles["img-mock"]}>
            <img src={imagem} style={{width:'30vw', borderRadius:'5vh', height:'40vh', objectFit:'cover'}} alt="Imagem da Oficina" />
          </div>
        </div>
      </div>
      <section className={styles["carrosel"]}>
        <h2>Serviços</h2>
        <AliceCarousel
          mouseTracking
          items={(servicos && servicos.length > 0 ? servicos : []).map((servico, index) => (
            <CardContent key={index} type={"miniServico"} titulo={servico.nome} imagem={"https://jeyoqssrkcibrvhoobsk.supabase.co/storage/v1/object/public/ofc-photos/servicoPadrao.jpg"}/>
          ))}
          responsive={responsive}
          infinite={servicos.length >= 4}
          disableDotsControls={true}
          autoPlay={servicos.length >= 4}
          autoPlayInterval={2000}
          renderPrevButton={() => {
            return <div className={`${styles.arrows}`}><img src={leftArrow} alt="Previous" /></div>;
          }}
          renderNextButton={() => {
            return <div style={{ rotate: "180deg" }} className={`${styles.arrows}`}><img src={leftArrow} alt="Next" /></div>;
          }}
          autoWidth={true}
          disableButtonsControls={servicos.length < 4}
        />
      </section>
      <section className={styles["carrosel"]}>
        <h2>Produtos</h2>
        <AliceCarousel
          mouseTracking
          items={(pecas && pecas.length > 0 ? pecas : []).map((peca, index) => (
            <CardContent key={index} type={"miniPeca"} titulo={peca.nome} valor={`R$${peca.valorVenda}`} imagem={"https://jeyoqssrkcibrvhoobsk.supabase.co/storage/v1/object/public/ofc-photos/pecaPadrao.jpg"}/>
          ))}
          responsive={responsive}
          infinite={pecas.length >= 4}
          disableDotsControls={true}
          autoPlay={pecas.length >= 4}
          autoPlayInterval={2000}
          renderPrevButton={() => {
            return <div className={`${styles.arrows}`}><img src={leftArrow} alt="Previous" /></div>;
          }}
          renderNextButton={() => {
            return <div style={{ rotate: "180deg" }} className={`${styles.arrows}`}><img src={leftArrow} alt="Next" /></div>;
          }}
          autoWidth={true}
          disableButtonsControls={pecas.length < 4}
        />
      </section>
      <section className={styles["avaliacoes"]}>
        <div className={styles["left-side"]}>
          <h1>Avaliações</h1>
          <div className={styles["cards-avaliacoes"]}>
            {
            avaliacoes.length > 0 ? (
              avaliacoes.slice().reverse().map((avaliacao, index) => (
                <BoxAvaliacao
                  key={index}
                  autor={`${avaliacao.usuarioAvaliacao.nome} ${avaliacao.usuarioAvaliacao.sobrenome || ""}`.trim()}
                  nota={avaliacao.nota.toFixed(1)}
                  comentario={avaliacao.comentario}
                  fotoPerfil={avaliacao.usuarioAvaliacao.fotoUrl || perfilPadrao}
                />
              ))
            ) : (
              <p>As avaliações dessa oficina aparecerão aqui.</p>
            )}
          </div>
        </div>
        <div className={styles["right-side"]}>
          <h1 style={{ width: "25.1vw" }}>Sua Avaliação</h1>
          <div className={styles["nota"]}>
            <p>Nota</p>
            <div className={styles["estrelas"]}>
              {[1, 2, 3, 4, 5].map((index) => (
                <img
                  key={index}
                  src={index <= (hoverRating || userRating) ? estrela : estrelaCinza}
                  alt={`Star ${index}`}
                  onMouseOver={() => handleMouseOver(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(index)}
                />
              ))}
            </div>
          </div>
          <div className={styles["container-textArea"]}>
            <label htmlFor="ta_comment">Comentário</label>
            <textarea style={{ fontSize: '22px' }} maxLength={255} id="ta_comment" onChange={(e) => setUserComentario(e.target.value)}></textarea>
          </div>
          <Botao texto={"Enviar"} width={"9vw"} onClick={handleSubmit} />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default PagOficina;