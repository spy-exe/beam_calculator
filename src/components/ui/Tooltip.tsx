import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Posições do tooltip
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

// Variantes de estilo
const positionVariants = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
};

// Setas do tooltip
const arrowPositionVariants = {
  top: 'bottom-0 left-1/2 -translate-x-1/2 rotate-180',
  bottom: 'top-0 left-1/2 -translate-x-1/2',
  left: 'right-0 top-1/2 -translate-y-1/2 rotate-90',
  right: 'left-0 top-1/2 -translate-y-1/2 -rotate-90'
};

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  theme?: 'dark' | 'light';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  theme = 'dark',
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const handler = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setDelayHandler(handler);
  };

  const hideTooltip = () => {
    if (delayHandler) {
      clearTimeout(delayHandler);
    }
    setIsVisible(false);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20 
            }}
            className={`
              absolute 
              z-50 
              ${positionVariants[position]}
              ${theme === 'dark' 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-800 border'}
              px-3 
              py-2 
              rounded-lg 
              text-sm 
              shadow-lg
              pointer-events-none
            `}
          >
            {content}
            
            {/* Seta do tooltip */}
            <div 
              className={`
                absolute 
                w-0 
                h-0 
                border-[6px] 
                border-transparent 
                ${theme === 'dark' 
                  ? 'border-b-gray-900' 
                  : 'border-b-white border-b-solid'}
                ${arrowPositionVariants[position]}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;