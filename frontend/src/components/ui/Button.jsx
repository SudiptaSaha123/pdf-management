import React from 'react';

const Button = ({ 
  children, 
  type = "button", 
  variant = "primary", 
  disabled = false, 
  onClick,
  className = "",
  isLoading = false
}) => {
  const baseStyles = "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    secondary: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
  };

  const LoadingSpinner = () => (
    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  );
};

export default Button; 