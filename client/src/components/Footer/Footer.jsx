import React from 'react';
import './Footer.css';

function Footer({children, className, onClick}) {
    return(
        <footer className={className} onClick={onClick}>
            {children}
        </footer>
    );
}

export default Footer