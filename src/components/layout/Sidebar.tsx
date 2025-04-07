import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Layers, 
  Database, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const sidebarItems: SidebarItem[] = [
    {
      icon: Calculator,
      label: 'Calculadora',
      active: true
    },
    {
      icon: Layers,
      label: 'Seções Transversais'
    },
    {
      icon: Database,
      label: 'Biblioteca de Materiais'
    },
    {
      icon: Settings,
      label: 'Configurações'
    },
    {
      icon: HelpCircle,
      label: 'Ajuda'
    }
  ];

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <motion.aside 
      initial={{ width: 250 }}
      animate={{ 
        width: isExpanded ? 250 : 80,
        transition: { duration: 0.3 }
      }}
      className="
        fixed 
        left-0 
        top-16 
        bottom-0 
        bg-white 
        dark:bg-gray-900 
        border-r 
        dark:border-gray-800 
        shadow-md 
        z-40 
        overflow-hidden
      "
    >
      <div className="h-full flex flex-col">
        <nav className="flex-grow pt-4">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ 
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                transition: { duration: 0.2 }
              }}
              className={`
                flex 
                items-center 
                px-4 
                py-3 
                cursor-pointer 
                ${item.active ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                hover:bg-blue-50 
                dark:hover:bg-blue-900/20
              `}
            >
              <item.icon 
                size={24} 
                className={`
                  ${item.active ? 'text-blue-600' : 'text-gray-600'}
                  dark:text-gray-300
                `} 
              />
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isExpanded ? 1 : 0,
                    transition: { duration: 0.2 }
                  }}
                  className={`
                    ml-4 
                    ${item.active ? 'text-blue-600 font-semibold' : 'text-gray-700'}
                    dark:text-gray-300
                  `}
                >
                  {item.label}
                </motion.span>
              )}
            </motion.div>
          ))}
        </nav>

        <div 
          className="
            border-t 
            dark:border-gray-800 
            p-2 
            flex 
            justify-center 
            items-center
            cursor-pointer
            hover:bg-gray-100
            dark:hover:bg-gray-800
          "
          onClick={toggleSidebar}
        >
          {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;