import React from 'react';
import { motion } from 'framer-motion';

interface StaggerAnimationProps {
  children: React.ReactNode[];
  direction?: 'vertical' | 'horizontal';
  staggerDelay?: number;
  className?: string;
}

const StaggerAnimation: React.FC<StaggerAnimationProps> = ({
  children,
  direction = 'vertical',
  staggerDelay = 0.1,
  className = ''
}) => {
  // Configurações de variantes baseadas na direção
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      ...(direction === 'vertical' 
        ? { y: 20 }
        : { x: -20 }
      )
    },
    visible: { 
      opacity: 1,
      ...(direction === 'vertical' 
        ? { y: 0 }
        : { x: 0 }
      ),
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggerAnimation;