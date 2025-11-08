import React from "react";
import './TaskCard.css';

function TaskCard({ children, className }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}  
export default TaskCard