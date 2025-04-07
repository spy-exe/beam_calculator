import { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
};

// Função utilitária para aplicar tema
export const applyTheme = (isDarkMode: boolean) => {
  const root = window.document.documentElement;
  
  root.classList.remove('light', 'dark');
  root.classList.add(isDarkMode ? 'dark' : 'light');
  
  // Atualizar cor do tema para dispositivos móveis
  const themeColor = isDarkMode ? '#111827' : '#ffffff';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
};