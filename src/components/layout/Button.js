import React from 'react';

const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
  secondary: 'bg-secondary-800 hover:bg-secondary-900 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
  warning: 'bg-accent-500 hover:bg-accent-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
  outline: 'border border-secondary-300 hover:border-secondary-400 text-secondary-700 hover:bg-secondary-50 hover:text-secondary-800',
  link: 'text-primary-600 hover:text-primary-800 underline bg-transparent',
  ghost: 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900 bg-transparent',
};

const buttonSizes = {
  xs: 'px-2 py-1 text-xs rounded',
  sm: 'px-3 py-1.5 text-sm rounded',
  md: 'px-4 py-2 text-base rounded-md',
  lg: 'px-5 py-2.5 text-lg rounded-md',
  xl: 'px-6 py-3 text-xl rounded-lg',
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
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none';
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
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button; 