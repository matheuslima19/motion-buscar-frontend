import React from "react";
import style from "./Input.module.css";

const Input = ({ texto, type = "text", width, height, maxLength = 255, imagem, tamImg, marginRight, id, onChange, value, options = [] }) => {
  return (
    <div className={style['container-input']}>
      <img className={style["imagem"]} src={imagem} alt="" style={{ height: tamImg }} />
      <input
        id={id}
        onChange={onChange}
        className={style['input']}
        type={type}
        style={{ width: width, height: height, marginRight: marginRight }}
        maxLength={maxLength}
        placeholder={texto}
        value={value}
        list={`datalist-${id}`}
      />
      {options.length > 0 && (
        <datalist id={`datalist-${id}`} className={style['datalist']}>
          {options.map((option, index) => (
            <option key={index} value={option} />
          ))}
        </datalist>
      )}

    </div>
  );
};

export default Input;