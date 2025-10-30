import React from "react";
import './Textarea.css';

function Textarea({ className, ...props }){
    const combinedClassName = `custom-textarea ${className || ''}`.trim();
    return(
        <textarea
            className={combinedClassName}
            {...props}
        />
    );
}
export default Textarea