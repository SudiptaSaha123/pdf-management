import React from 'react';

const Card = ({ 
  children, 
  className = "", 
  padding = "p-6",
  hasError = false 
}) => {
  return (
    <div className={`
      overflow-hidden 
      rounded-xl 
      bg-white 
      shadow-sm 
      ring-1 
      ring-gray-900/5
      ${hasError ? 'border-red-100' : ''}
      ${padding}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card; 