import React,{useEffect} from "react";
import "./utils/global.css"
import Rotas from "./routes";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
function App() {
  
  useEffect(() => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.setAttribute('draggable', false);
    });
  }, []);

  return (
    <>
      <Rotas />
      <ToastContainer />
    </>
  );
}

export default App;