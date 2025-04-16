import React from "react";
import style from "./FormImput.module.css";

const FormInput = ({label, type = "text", width, height = "6vh", maxLength = 255, id, onChange, value, backgroundColor, readOnly = false}) => {
  return (
    <div className={style['container-input']}>
        <label htmlFor={id}>{label}</label>
        <input 
            value={value} 
            type={type} 
            name={label} 
            id={id} 
            maxLength={maxLength} 
            onChange={onChange} 
            style={{height: height, width: width, backgroundColor: backgroundColor}} 
            readOnly={readOnly} 
        />
    </div>
  );
};

export default FormInput;
