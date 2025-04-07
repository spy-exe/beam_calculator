import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

// Variantes de cores
const colorVariants = {
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-indigo-100 text-indigo-800',
  gray: 'bg-gray-100 text-gray-800'
};

// Variantes de tamanho
const sizeVariants = {
  sm: 'text-xs px-2 py-0.5 rounded',
  md: 'text-sm px-3 py-1 rounded-md',
  lg: 'text-base px-4 py-1.5 rounded-lg'
};

interface BadgeProps {
  children: React.ReactNode;
  color?: keyof typeof colorVariants;
  size?: keyof typeof sizeVariants;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  size = 'md',
  removable = false,
  onRemove,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        inline-flex 
        items-center 
        justify-center 
        font-medium 
        ${colorVariants[color]}
        ${sizeVariants[size]}
        ${removable ? 'pr-1' : ''}
        ${className}
      `}
    >
      {children}
      {removable && (
        <motion.button
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          className="ml-2 text-current hover:opacity-75 transition-opacity"
          aria-label="Remove badge"
        >
          <X size={16} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default Badge;