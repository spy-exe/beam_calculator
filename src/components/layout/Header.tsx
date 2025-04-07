import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';

interface HeaderProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onToggleTheme,
  isDarkMode,
  userName = 'Usuário',
  userEmail = 'usuario@exemplo.com',
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo e Nome do Aplicativo */}
        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            🏗️ Beam Calculator
          </motion.div>
        </div>

        {/* Menu de Navegação */}
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            Calculadora
          </Button>
          <Button variant="ghost" size="sm">
            Materiais
          </Button>
          <Button variant="ghost" size="sm">
            Seções
          </Button>
        </nav>

        {/* Controles de Usuário */}
        <div className="flex items-center space-x-4">
          {/* Modo Escuro */}
          <Tooltip content={isDarkMode ? "Modo Claro" : "Modo Escuro"}>
            <Button 
              variant="ghost" 
              onClick={onToggleTheme}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </Tooltip>

          {/* Perfil do Usuário */}
          <div className="relative">
            <Button 
              variant="ghost" 
              onClick={toggleProfileDropdown}
            >
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                {userName.charAt(0).toUpperCase()}
              </div>
            </Button>

            {isProfileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700"
              >
                <div className="p-4 border-b dark:border-gray-700">
                  <p className="font-semibold">{userName}</p>
                  <p className="text-sm text-gray-500">{userEmail}</p>
                </div>
                <div className="py-1">
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    leftIcon={<Settings size={16} />}
                  >
                    Configurações
                  </Button>
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    leftIcon={<HelpCircle size={16} />}
                  >
                    Ajuda
                  </Button>
                  <Button 
                    variant="ghost" 
                    fullWidth 
                    leftIcon={<LogOut size={16} />}
                    onClick={onLogout}
                  >
                    Sair
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white dark:bg-gray-900 shadow-md"
        >
          <nav className="px-4 py-4 space-y-2">
            <Button variant="ghost" fullWidth>
              Calculadora
            </Button>
            <Button variant="ghost" fullWidth>
              Materiais
            </Button>
            <Button variant="ghost" fullWidth>
              Seções
            </Button>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;