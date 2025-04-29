import React from 'react';

const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 border border-primary-700 active:shadow-inner',
  secondary: 'bg-secondary-800 hover:bg-secondary-900 text-white shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 border border-secondary-900 active:shadow-inner',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 border border-red-700 active:shadow-inner',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 border border-green-700 active:shadow-inner',
  warning: 'bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 border border-accent-600 active:shadow-inner',
  accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 border border-accent-600 active:shadow-inner',
  outline: 'border border-secondary-300 hover:border-secondary-400 text-secondary-700 hover:bg-secondary-50 hover:text-secondary-800 shadow-sm hover:shadow transform hover:-translate-y-1 active:translate-y-0',
  link: 'text-primary-600 hover:text-primary-800 underline hover:bg-primary-50 rounded bg-transparent',
  ghost: 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900 bg-transparent transform hover:-translate-y-1 active:translate-y-0',
  glass: 'bg-white/30 backdrop-blur-md hover:bg-white/40 border border-white/30 text-white shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0',
};

const buttonSizes = {
  xs: 'px-2.5 py-1 text-xs rounded-lg',
  sm: 'px-3.5 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-lg',
  xl: 'px-7 py-3.5 text-xl rounded-xl',
};

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none';
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
    </button>
  );
};

export default Button; 