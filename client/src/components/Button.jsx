import React from 'react';

const Button = ({
  children,
  variant = 'primary', // primary / secondary / outline
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  className = '',
}) => {
  // สีพื้นฐานตาม variant
  const colors = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600',
    outline: 'border border-gray-500 text-white hover:bg-gray-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-medium rounded-lg px-4 py-2 transition-all duration-200
        ${colors[variant] || colors.primary}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
