import React from "react";
import "./TaskWidget.css";

    function CompeledTask({title, compeledTaskCount, className}){
        return(
            <div className={className}>
                <h2>{title}</h2>
                <h1>{compeledTaskCount}</h1>
            </div>
        );
    }

export default CompeledTask