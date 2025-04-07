import React from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  Monitor 
} from 'lucide-react';
import { useThemeContext } from '../../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDarkMode } = useThemeContext();

  const themeOptions = [
    { 
      value: 'light', 
      icon: Sun,
      label: 'Modo Claro'
    },
    { 
      value: 'dark', 
      icon: Moon,
      label: 'Modo Escuro'
    },
    { 
      value: 'system', 
      icon: Monitor,
      label: 'Sistema'
    }
  ];

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;

        return (
          <motion.button
            key={option.value}
            onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
            className={`
              p-2 
              rounded-full 
              flex 
              items-center 
              justify-center
              transition-colors
              duration-300
              ${isActive 
                ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600' 
                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}
            `}
            whileTap={{ scale: 0.9 }}
            title={option.label}
          >
            <Icon size={20} />
          </motion.button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;