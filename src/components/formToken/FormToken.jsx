import React, { useState } from 'react';
import InputResponsive from '../inputResponsive/InputResponsive';
import Botao from '../botao/Botao';

const LoginForm = () => {
  const [id, setId] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica para lidar com o envio do formulário
    console.log('ID:', id, 'Token:', token);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <InputResponsive 
        label="Token"
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <Botao texto={"Acessar"} cor={"#3B563C"}/>
    </form>
  );
};

export default LoginForm;
