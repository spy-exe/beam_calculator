import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos de animação
type AnimationType = 'fade' | 'slide' | 'scale';

interface FadeInOutProps {
  children: React.ReactNode;
  type?: AnimationType;
  duration?: number;
  delay?: number;
  className?: string;
  isVisible?: boolean;
}

const FadeInOut: React.FC<FadeInOutProps> = ({
  children,
  type = 'fade',
  duration = 0.3,
  delay = 0,
  className = '',
  isVisible = true
}) => {
  // Definir variantes de animação
  const animationVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={animationVariants[type].initial}
          animate={animationVariants[type].animate}
          exit={animationVariants[type].exit}
          transition={{
            duration,
            delay,
            type: 'tween'
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FadeInOut;