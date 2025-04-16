import React from "react";
import { TailSpin } from "react-loader-spinner";
import style from "./Loader.module.css";

function Loader({ show }) {
  if (!show) return null;
  return (
    <div
        className={style["loader-base"]}
    >
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default Loader;
