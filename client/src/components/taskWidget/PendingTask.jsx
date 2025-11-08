import React from "react";
import "./TaskWidget.css";

    function PendingTask({title, pendingTaskCount, className}){
        return(
            <div className={className}>
                <h2>{title}</h2>
                <h1>{pendingTaskCount}</h1>
            </div>
        );
    }

export default PendingTask