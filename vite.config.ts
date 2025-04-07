import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Configurações do Vite
    plugins: [react()],
    
    // Resolve aliases para importações
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@services': path.resolve(__dirname, './src/services'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@types': path.resolve(__dirname, './src/types'),
      }
    },
    
    // Configurações do servidor de desenvolvimento
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Configuração de proxy para API
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    // Configurações de build
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          // Separar dependências de terceiros
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    },
    
    // Variáveis de ambiente globais
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version)
    }
  };
});