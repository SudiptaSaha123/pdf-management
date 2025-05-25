import React from 'react';

const Input = ({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon,
  className = "",
  autoComplete
}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative mt-1">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          className={`block w-full rounded-lg border border-gray-300 ${
            icon ? 'pl-10' : 'pl-4'
          } px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            error ? 'border-red-300' : ''
          } ${className}`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input; 