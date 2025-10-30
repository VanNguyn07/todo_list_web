import React from "react"; 
import './Button.css';

function Button({children, className}){


    return (
        <>
        <button className={className}>
            {/* content of button  */}
            {children}
        </button>
        </>
    );
}

export default Button;