import React from 'react';
import './Footer.css';

function Footer({children, className}) {
    return(
        <footer className={className}>
            {children}
        </footer>
    );
}

export default Footer