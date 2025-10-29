import React from "react"; 
import './Button.css';

function Button({children, onClick, className}){

    const combinedClassName = `my-button ${className || ''}`;

    return (
        <>
        <button className={combinedClassName} onClick={onClick}>
            {/* content of button  */}
            {children}
        </button>
        </>
    );
}

export default Button;