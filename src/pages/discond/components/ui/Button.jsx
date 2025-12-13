import React from 'react';

const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  variant = 'primary',
  disabled = false,
  ariaLabel,
  ...rest
}) => {
  const base = 'inline-flex items-center justify-center rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-400',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-200',
  };

  const disabledClass = disabled ? 'opacity-50 pointer-events-none' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} px-3 py-1 ${variants[variant] || variants.primary} ${disabledClass} ${className}`}
      aria-label={ariaLabel}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
