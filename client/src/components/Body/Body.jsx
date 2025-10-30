import React from "react";
import "./Body.css";

    function Body({children, className}){
        return(
            <main className={className}>
                {children}
            </main>
        );
    }

export default Body