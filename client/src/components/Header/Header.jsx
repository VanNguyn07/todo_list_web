import React from "react";
import Logo from "../../assets/images/logo.png";
import './Header.css';

function Header({children, className}){
    
    return(
        <header className={className}>
            {children}
        </header>
    );
}

export default Header