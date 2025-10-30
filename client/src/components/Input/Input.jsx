import React from 'react';
import './Input.css';

function Input({ className, ...props }) {
  // Kết hợp custom-input với className được truyền vào
  const combinedClassName = `custom-input ${className || ''}`.trim();
  
  return (
    <input 
      className={combinedClassName}
      {...props} 
    />
  );
}

export default Input;