import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}) => {
  // Definir tamanhos do modal
  const sizeVariants = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
          onClick={onClose}
        >
          {/* Fundo escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
          />

          {/* Conteúdo do Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30 
            }}
            className={`
              relative 
              w-full 
              ${sizeVariants[size]} 
              mx-auto 
              bg-white 
              dark:bg-gray-800 
              rounded-xl 
              shadow-2xl 
              ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="
              flex 
              items-center 
              justify-between 
              p-6 
              border-b 
              dark:border-gray-700
            ">
              <h3 className="
                text-xl 
                font-semibold 
                text-gray-900 
                dark:text-white
              ">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="
                  text-gray-400 
                  hover:text-gray-600 
                  dark:hover:text-gray-200 
                  transition-colors
                "
                aria-label="Fechar modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BaseModal;