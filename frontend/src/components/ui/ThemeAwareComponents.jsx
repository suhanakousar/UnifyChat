import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'font-semibold font-["Montserrat"] transition-all duration-200 active:scale-[0.98] focus:outline-none';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    icon: 'btn-icon',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${variant !== 'icon' ? sizeClasses[size] : ''} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const IconButton = ({ 
  icon, 
  onClick, 
  className = '',
  ariaLabel,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn-icon ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </button>
  );
};

export const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  variant = 'modern',
  ...props 
}) => {
  const variantClasses = {
    modern: 'input-modern',
    search: 'input-search',
  };
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

export const TextArea = ({
  placeholder,
  value,
  onChange,
  rows = 3,
  className = '',
  ...props
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`input-modern resize-none ${className}`}
      {...props}
    />
  );
};

export const Badge = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const variantClasses = {
    default: 'badge bg-brand-grey-200 dark:bg-brand-grey-600 text-brand-grey-dark dark:text-brand-white',
    unread: 'badge-unread',
    admin: 'badge-admin',
    success: 'badge bg-success/20 text-success',
    warning: 'badge bg-warning/20 text-warning',
    error: 'badge bg-error/20 text-error',
  };
  
  return (
    <span className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export const Card = ({ 
  children, 
  className = '',
  hoverable = false,
  ...props 
}) => {
  const hoverClass = hoverable ? 'hover:shadow-medium transform hover:-translate-y-1' : '';
  
  return (
    <div className={`card-modern ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`btn-icon ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FaMoon className="text-brand-grey-dark text-lg" />
      ) : (
        <FaSun className="text-brand-yellow text-lg" />
      )}
    </button>
  );
};

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-brand-grey-200 dark:border-brand-grey-600 border-t-brand-yellow ${sizeClasses[size]} ${className}`} />
  );
};

export const LoadingSkeleton = ({ className = '', variant = 'default' }) => {
  const variantClasses = {
    default: 'h-4 w-full rounded',
    circle: 'h-12 w-12 rounded-full',
    text: 'h-4 w-3/4 rounded',
    title: 'h-6 w-1/2 rounded',
  };
  
  return (
    <div className={`animate-pulse bg-brand-grey-200 dark:bg-brand-grey-600 ${variantClasses[variant]} ${className}`} />
  );
};

export const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  fallback,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };
  
  const [imageError, setImageError] = React.useState(false);
  
  if (!src || imageError) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full bg-brand-yellow dark:bg-brand-yellow-light flex items-center justify-center font-semibold text-brand-grey-dark ${className}`}
        {...props}
      >
        {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImageError(true)}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      {...props}
    />
  );
};

export const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div className={`absolute ${positionClasses[position]} z-50 px-3 py-2 text-sm text-brand-white bg-brand-grey-dark dark:bg-brand-white dark:text-brand-grey-dark rounded-lg whitespace-nowrap shadow-lg animate-fade-in`}>
          {content}
        </div>
      )}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  React.useEffect(() => {
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
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`bg-brand-white dark:bg-brand-grey-medium rounded-2xl w-full max-w-md shadow-large animate-scale-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-brand-grey-200 dark:border-brand-grey-light">
            <h2 className="text-xl font-bold text-brand-grey-dark dark:text-brand-white font-['Montserrat']">
              {title}
            </h2>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Divider = ({ className = '' }) => {
  return (
    <hr className={`border-brand-grey-200 dark:border-brand-grey-light ${className}`} />
  );
};

export const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  const typeClasses = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-brand-grey-dark',
    info: 'bg-brand-yellow text-brand-grey-dark',
  };
  
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-2xl shadow-large ${typeClasses[type]} animate-slide-up z-50`}>
      <p className="font-['Inter'] font-medium">{message}</p>
    </div>
  );
};

export const DateSeparator = ({ date }) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex-1 border-t border-brand-grey-200 dark:border-brand-grey-light"></div>
      <span className="px-4 text-xs font-medium text-brand-grey-500 dark:text-brand-grey-300 font-['Inter']">
        {date}
      </span>
      <div className="flex-1 border-t border-brand-grey-200 dark:border-brand-grey-light"></div>
    </div>
  );
};

export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-3 bg-brand-white dark:bg-brand-grey-light rounded-2xl rounded-bl-sm shadow-sm w-16">
      <div className="h-2 w-2 bg-brand-grey-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="h-2 w-2 bg-brand-grey-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="h-2 w-2 bg-brand-grey-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};
