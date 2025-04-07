import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

// Variantes de estilo para diferentes tipos de input
const inputVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500'
};

// Tipos de propriedades para o componente de Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: keyof typeof inputVariants;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  variant = 'default',
  fullWidth = false,
  type = 'text',
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderPasswordToggle = () => {
    if (type !== 'password') return null;
    
    const PasswordIcon = showPassword ? EyeOff : Eye;
    return (
      <button 
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <PasswordIcon size={20} />
      </button>
    );
  };

  const actualType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'}`}>
      {label && (
        <label 
          className="block text-sm font-medium text-gray-700 mb-2"
          htmlFor={props.id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <motion.input
          ref={ref}
          type={actualType}
          className={`
            block w-full 
            rounded-lg 
            shadow-sm 
            border
            py-2 
            transition-all 
            duration-200
            ${leftIcon ? 'pl-10' : 'pl-3'}
            ${rightIcon || type === 'password' ? 'pr-10' : 'pr-3'}
            ${inputVariants[variant]}
            ${error ? inputVariants.error : ''}
            ${className || ''}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {renderPasswordToggle()}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
          id={`${props.id}-error`}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;