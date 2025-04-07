import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SwitchProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'purple';
}

const Switch: React.FC<SwitchProps> = ({
  label,
  description,
  checked: controlledChecked,
  onChange,
  disabled = false,
  size = 'md',
  color = 'blue'
}) => {
  // Determinar se o switch é controlado ou não
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(false);

  // Usar valor controlado ou interno
  const checked = isControlled ? controlledChecked : internalChecked;

  // Definir tamanhos
  const sizeVariants = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: checked ? 'translate-x-4' : 'translate-x-0'
    },
    md: {
      switch: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: checked ? 'translate-x-6' : 'translate-x-0'
    },
    lg: {
      switch: 'w-16 h-8',
      thumb: 'w-6 h-6',
      translate: checked ? 'translate-x-8' : 'translate-x-0'
    }
  };

  // Definir cores
  const colorVariants = {
    blue: {
      background: checked ? 'bg-blue-500' : 'bg-gray-200',
      thumb: 'bg-white'
    },
    green: {
      background: checked ? 'bg-green-500' : 'bg-gray-200',
      thumb: 'bg-white'
    },
    red: {
      background: checked ? 'bg-red-500' : 'bg-gray-200',
      thumb: 'bg-white'
    },
    purple: {
      background: checked ? 'bg-purple-500' : 'bg-gray-200',
      thumb: 'bg-white'
    }
  };

  const handleToggle = () => {
    if (disabled) return;

    // Se não for um componente controlado, atualiza o estado interno
    if (!isControlled) {
      setInternalChecked(!checked);
    }

    // Chama o onChange se existir
    onChange?.(!checked);
  };

  return (
    <div className="flex items-center space-x-4">
      <div 
        className={`
          relative 
          inline-flex 
          items-center 
          cursor-pointer 
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={handleToggle}
      >
        <motion.div
          className={`
            ${sizeVariants[size].switch}
            rounded-full 
            ${colorVariants[color].background}
            transition-colors 
            duration-300
          `}
        >
          <motion.div
            layout
            transition={{
              type: 'spring',
              stiffness: 700,
              damping: 30
            }}
            className={`
              absolute 
              top-1/2 
              -translate-y-1/2 
              ${sizeVariants[size].thumb}
              ${colorVariants[color].thumb}
              rounded-full 
              shadow-md
              ${sizeVariants[size].translate}
            `}
          />
        </motion.div>
      </div>
      
      {(label || description) && (
        <div>
          {label && (
            <label 
              className={`
                block 
                text-sm 
                font-medium 
                ${disabled ? 'text-gray-400' : 'text-gray-700'}
              `}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={`
              text-sm 
              ${disabled ? 'text-gray-400' : 'text-gray-500'}
            `}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Switch;