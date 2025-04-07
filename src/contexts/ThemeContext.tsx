import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect 
  } from 'react';
  
  // Tipos de tema
  type Theme = 'light' | 'dark' | 'system';
  
  // Interface do contexto de tema
  interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDarkMode: boolean;
  }
  
  // Criação do contexto
  const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    setTheme: () => {},
    isDarkMode: false
  });
  
  // Hook personalizado para usar o contexto de tema
  export const useTheme = () => useContext(ThemeContext);
  
  // Provedor de tema
  export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
      // Recuperar tema salvo ou usar configuração do sistema
      const savedTheme = localStorage.getItem('app-theme') as Theme;
      return savedTheme || 'system';
    });
  
    // Determinar se o modo escuro está ativo
    const isDarkMode = theme === 'dark' || (
      theme === 'system' && 
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  
    // Atualizar tema
    const setTheme = (newTheme: Theme) => {
      setThemeState(newTheme);
      localStorage.setItem('app-theme', newTheme);
    };
  
    // Efeito para aplicar tema
    useEffect(() => {
      const root = window.document.documentElement;
      
      // Remover classes anteriores
      root.classList.remove('light', 'dark');
      
      // Adicionar classe de tema
      root.classList.add(isDarkMode ? 'dark' : 'light');
  
      // Configurar meta tag de cor para mobile
      const themeColor = isDarkMode ? '#111827' : '#ffffff';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);
    }, [isDarkMode]);
  
    // Observar mudanças no tema do sistema
    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        if (theme === 'system') {
          setThemeState('system');
        }
      };
  
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);
  
    return (
      <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  
  export default ThemeContext;