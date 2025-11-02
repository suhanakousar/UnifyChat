import React from 'react';

const Avatar = ({ 
  src, 
  alt = '', 
  size = 'md', 
  fallback,
  status,
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-success',
    away: 'bg-warning',
    busy: 'bg-error',
    offline: 'bg-neutral-400',
  };

  return (
    <div className={`relative inline-flex ${className}`} {...props}>
      <div 
        className={`
          ${sizes[size]} 
          rounded-full overflow-hidden bg-neutral-200
          flex items-center justify-center font-medium text-neutral-600
          ring-2 ring-white
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{fallback}</span>
        )}
      </div>
      {status && (
        <span 
          className={`
            absolute bottom-0 right-0 
            ${statusSizes[size]} 
            ${statusColors[status]} 
            rounded-full border-2 border-white
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
