import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home"
import Oficinas from "./pages/oficinas/Oficinas";
import Servicos from "./pages/servicos/Servicos";
import Pecas from "./pages/pecas/Pecas";
import MeusServicos from "./pages/meusServicos/MeusServicos";
import PagOficina from "./pages/pagOficina/PagOficina";
import Login from "./pages/login/Login";
import Cadastro from "./pages/cadastro/Cadastro";
import RecuperarSenha from "./pages/recuperarSenha/RecuperarSenha";
import Perfil from "./pages/perfil/Perfil";
import OrdemServico from "./pages/ordemServico/OrdemServico";
function Rotas() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="/recuperarSenha" element={<RecuperarSenha />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/oficinas" element={<Oficinas />} />
                    <Route path="/servicos" element={<Servicos />} />
                    <Route path="/pecas" element={<Pecas />} />
                    <Route path="/meusServicos" element={<MeusServicos />} />
                    <Route path="/oficinas/:id" element={<PagOficina />} />
                    <Route path="/ordemServico/:token" element={<OrdemServico />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}
export default Rotas;