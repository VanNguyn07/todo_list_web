import React from "react"; 
import './Button.css';

function Button({children, className,onClick}){
    return (
        <>
        <button className={className} onClick={onClick}>
            {/* content of button  */}
            {children}
        </button>
        </>
    );
}

export default Button;