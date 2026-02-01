import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  padding = 'md',
  dark = false, // เพิ่ม prop dark
}) => {
  // baseClasses จะปรับพื้นหลังตาม dark หรือ light
  const baseClasses = `${dark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl shadow-md transition-all duration-300`;

  const hoverClasses = hover 
    ? 'hover:shadow-lg cursor-pointer transform hover:-translate-y-1' 
    : '';

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${paddings[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
