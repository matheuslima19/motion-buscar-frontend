import React from 'react';
import style from './InputResponsive.module.css';

const InputResponsive= ({ label, type, value, onChange }) => {
  return (
    <div className={style["input-responsive"]}>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
};

export default InputResponsive;
