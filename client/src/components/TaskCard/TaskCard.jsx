import React from "react";
import './TaskCard.css';

function TaskCard({children, className}){
    return(
        <form action="" className={className}>
            {children}
        </form>
    );
}   
export default TaskCard