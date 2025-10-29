import React from "react";
import './Header.css';

function Header({children, className}){
    
    const combinedText = `textHeader ${className || '' }`;
    return(
        <header className={combinedText}>
            {children}
        </header>
    );
}

export default Header