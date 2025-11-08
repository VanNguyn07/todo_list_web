import React from "react";
import './Header.css';

function Header({children, className}){
    
    return(
        <header className={className}>
            {children}
        </header>
    );
}

export default Header