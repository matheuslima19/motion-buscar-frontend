import React, { useState, useRef, useEffect } from "react";
import styles from "./OrdemServico.module.css";
import logo from "../../utils/assets/pit&buscar.svg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Botao from "../../components/botao/Botao";
import { useNavigate, useParams } from "react-router-dom";
import { api1 } from "../../api";
import axios from "axios";

const OrdemServico = () => {
    const contentRef = useRef();
    const { token } = useParams();
    const navigate = useNavigate();

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [status, setStatus] = useState("");
    const [classificacao, setClassificacao] = useState("");
    const [garantia, setGarantia] = useState("");
    const [oficina, setOficina] = useState({});
    const [cliente, setCliente] = useState({});
    const [veiculo, setVeiculo] = useState({});
    const [produtos, setProdutos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [valorTotal, setValorTotal] = useState("");
    const [numeroOficina, setNumeroOficina] = useState("")
    const [enderecoOficina, setEnderecoOficina] = useState({});
    const [idOs, setIdOs] = useState("");

    function formatarData(data) {
        const dataObj = new Date(data);
        const dia = dataObj.getDate().toString().padStart(2, '0');
        const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0'); // Mês é base 0, por isso soma-se 1
        const ano = dataObj.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    async function consultarViaCEP(cep) {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data.erro) {
                console.log("CEP não encontrado.");
            } else {
                setEnderecoOficina({
                    rua: response.data.logradouro,
                    cidade: response.data.localidade,
                    estado: response.data.uf
                });
            }
        } catch (error) {
            console.log("Erro ao consultar Via CEP:", error);
        }
    }

    useEffect(() => {
        async function getOs() {
            try {
                const response = await api1.get(`/ordemDeServicos/token/${token}`);
                setIdOs(response.data.id);
                setDataInicio(formatarData(response.data.dataInicio));
                setDataFim(formatarData(response.data.dataFim));
                setStatus(response.data.status);
                setClassificacao(response.data.tipoOs);
                setGarantia(response.data.garantia);
                setOficina({
                    nome: response.data.oficina.nome,
                    telefone: response.data.oficina.informacoesOficina.whatsapp,
                    cep: response.data.oficina.cep
                });
                setCliente({
                    nome: response.data.nomeCliente,
                    telefone: response.data.telefoneCliente,
                    email: response.data.emailCliente,
                });
                setVeiculo({
                    placa: response.data.placaVeiculo,
                    cor: response.data.corVeiculo,
                    modelo: response.data.modeloVeiculo,
                    ano: response.data.anoVeiculo,
                    marca: response.data.marcaVeiculo,
                });
                setProdutos(response.data.produtos);
                setServicos(response.data.servicos);
                setValorTotal(response.data.valorTotal);
                setNumeroOficina(response.data.oficina.numero);

                await consultarViaCEP(response.data.oficina.cep);
            } catch (erro) {
                console.log("Erro ao buscar ordem de serviço:", erro);
                // if (erro.response.status === 404) {
                //     navigate("/meusServicos")
                // }
            }
        }
        getOs();
    }, [token, navigate]);

    const gerarPDF = () => {
        const content = contentRef.current;

        html2canvas(content, { scale: 3 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // Largura A4 em mm
            const imgProps = canvas.width / canvas.height;
            const pdfHeight = imgWidth / imgProps;
            const pdf = new jsPDF('p', 'mm', [imgWidth, pdfHeight]);
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, pdfHeight);
            pdf.save("ordem-servico.pdf");
        });
    };

    return (
        <div>
            <div className={styles["botao"]}>
                <Botao onClick={gerarPDF} cor="#435d44" texto="Gerar OS" />
            </div>
            <div ref={contentRef} className={styles["body"]}>
                <div className={styles["folha"]}>
                    <div className={styles["id"]}>
                        <div className={styles["id_tag"]}>
                            <span className={styles["fonte-grande1"]}>#</span><span className={styles["fonte-grande1"]}>{idOs}</span>
                        </div>
                        <div className={styles["token"]}>
                            <span className={styles["fonte-pequena"]}>Token: </span><span className={styles["fonte-pequena"]}>{token}</span>
                        </div>
                    </div>

                    <div className={styles["infosGerais"]}>
                        <div className={styles["infos1"]}>
                            <span className={styles["fonte-negrito"]}>Início</span>
                            <span className={styles["fonte-pequena"]}>{dataInicio}</span>
                            <span className={styles["fonte-negrito"]}>Término</span>
                            <span className={styles["fonte-pequena"]}>{dataFim}</span>
                        </div>
                        <div className={styles["infos2"]}>
                            <span className={styles["fonte-negrito"]}>Status</span>
                            <span className={styles["fonte-pequena"]}>{status}</span>
                            <span className={styles["fonte-negrito"]}>Classificação</span>
                            <span className={styles["fonte-pequena"]}>{classificacao}</span>
                        </div>
                        <div className={styles["infos3"]}>
                            <span className={styles["fonte-negrito"]}>Garantia</span>
                            <span className={styles["fonte-pequena"]}>{garantia}</span>
                        </div>
                    </div>

                    <div className={styles["clienteOficina"]}>
                        <div className={styles["oficina"]}>
                            <span className={styles["fonte-media"]}>Dados da Oficina</span>
                            <span className={styles["fonte-pequena"]}>{oficina.nome}</span>
                            <span className={styles["fonte-pequena"]}>{oficina.telefone}</span>
                            <div>
                                <span className={styles["fonte-pequena"]}>{enderecoOficina.rua}</span>
                                <span className={styles["fonte-pequena"]}>, </span>
                                <span className={styles["fonte-pequena"]}>{numeroOficina}</span>
                            </div>
                            <div>
                                <span className={styles["fonte-pequena"]}>{enderecoOficina.cidade}</span>
                                <span className={styles["fonte-pequena"]}>, </span>
                                <span className={styles["fonte-pequena"]}>{enderecoOficina.estado}</span>
                            </div>
                        </div>

                        <div className={styles["cliente"]}>
                            <span className={styles["fonte-media"]}>Dados do Cliente</span>
                            <span className={styles["fonte-pequena"]}>{cliente.nome}</span>
                            <span className={styles["fonte-pequena"]}>{cliente.telefone}</span>
                            <span className={styles["fonte-pequena"]}>{cliente.email}</span>
                        </div>
                    </div>

                    <div className={styles["veiculo"]}>
                        <div className={styles["titulo1"]}>
                            <span className={styles["fonte-media"]}>Dados do Veículo</span>
                        </div>

                        <div className={styles["titulos2"]}>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Placa</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Cor</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Marca</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Modelo</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Ano</span>
                            </div>
                        </div>

                        <div className={styles["linhaRegistro"]}>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-pequena"]}>{veiculo.placa}</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-pequena"]}>{veiculo.cor}</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-pequena"]}>{veiculo.marca}</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-pequena"]}>{veiculo.modelo}</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-pequena"]}>{veiculo.ano}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles["produto"]}>
                        <div className={styles["titulo1"]}>
                            <span className={styles["fonte-media"]}>Produtos</span>
                        </div>

                        <div className={styles["titulos2"]}>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Nome</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Valor Unidade</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Quantidade</span>
                            </div>
                        </div>
                        {produtos.length > 0 ? (
                            produtos.map((produto, index) => (
                                <div className={styles["linhaRegistro"]} key={index}>
                                    <div className={styles["unico"]}>
                                        <span className={styles["fonte-pequena"]}>{produto.nome}</span>
                                    </div>
                                    <div className={styles["unico"]}>
                                        <span className={styles["fonte-pequena"]}>R$ {Number(produto.valor)}</span>
                                    </div>
                                    <div className={styles["unico"]}>
                                        <span className={styles["fonte-pequena"]}>Quantidade {produto.quantidade}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles["linhaRegistro"]}>
                                <div className={styles["unico"]}>
                                    <span className={styles["fonte-pequena"]}>Não há produtos</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles["servicos"]}>
                        <div className={styles["titulo1"]}>
                            <span className={styles["fonte-media"]}>Serviços</span>
                        </div>

                        <div className={styles["titulos2"]}>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Nome</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Valor Total</span>
                            </div>
                            <div className={styles["unico"]}>
                                <span className={styles["fonte-negrito"]}>Garantia</span>
                            </div>
                        </div>

                        {servicos.length > 0 ? (
                            servicos.map((servico, index) => (
                                <div className={styles["linhaRegistro"]} key={index}>
                                    <div className={styles["unico"]}>
                                        <span className={styles["fonte-pequena"]}>{servico.nome}</span>
                                    </div>
                                    <div className={styles["unico"]}>
                                        <span className={styles["fonte-pequena"]}>R$ {servico.valor}</span>
                                    </div>
                                    <div className={styles["unico"]}>
                                        <span className={styles["fonte-pequena"]}>{servico.garantia}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles["linhaRegistro"]}>
                                <div className={styles["unico"]}>
                                    <span className={styles["fonte-pequena"]}>Não há serviços</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles["total"]}>
                        <div>
                            <span className={styles["fonte-grande"]}>Valor Total</span>
                        </div>
                        <div>
                            <span className={styles["fonte-grande"]}>R$ {valorTotal}</span>
                        </div>
                    </div>

                    <div className={styles["footer"]}>
                        <img src={logo} alt="" width={"200px"} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdemServico;