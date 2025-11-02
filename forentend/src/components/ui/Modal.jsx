import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showClose = true,
  className = '' 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      <div 
        className={`
          relative bg-white rounded-2xl shadow-large 
          w-full ${sizes[size]} animate-scale-in
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            {title && (
              <h2 className="text-2xl font-semibold text-neutral-900">
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="ml-auto p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <FaTimes size={20} />
              </button>
            )}
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
