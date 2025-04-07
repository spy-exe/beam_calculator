import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

// Variantes de estilo para diferentes tipos de botões
const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
};

// Variantes de tamanho
const sizeVariants = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

// Tipos de propriedades para o componente de Botão
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof sizeVariants;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  className,
  disabled,
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={`
        inline-flex items-center justify-center 
        rounded-lg 
        font-medium 
        focus:outline-none 
        focus:ring-2 
        focus:ring-offset-2
        transition-all 
        duration-200 
        ${buttonVariants[variant]}
        ${sizeVariants[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className || ''}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg 
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;