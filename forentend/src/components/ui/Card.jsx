import React from 'react';

const Card = ({ 
  children, 
  variant = 'default',
  hover = false,
  padding = true,
  className = '',
  onClick,
  ...props 
}) => {
  const baseStyles = 'rounded-2xl border transition-all duration-300';
  
  const variants = {
    default: 'bg-white border-neutral-100 shadow-soft',
    glass: 'bg-white/70 backdrop-blur-xl border-white/20 shadow-soft',
    elevated: 'bg-white border-neutral-100 shadow-medium',
    outline: 'bg-transparent border-neutral-200',
  };
  
  const hoverStyles = hover ? 'hover:shadow-medium hover:-translate-y-1 cursor-pointer' : '';
  const paddingStyles = padding ? 'p-6' : '';
  
  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${hoverStyles}
        ${paddingStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
