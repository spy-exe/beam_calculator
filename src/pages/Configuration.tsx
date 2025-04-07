import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Palette, 
  Globe, 
  Download, 
  Upload, 
  Trash2 
} from 'lucide-react';

import { useThemeContext } from '../hooks/useTheme';
import { useProjectManager } from '../hooks/useProjectManager';
import { useAnalytics } from '../hooks/useAnalytics';

import Button from '../components/ui/Button';
import Switch from '../components/ui/Switch';
import Select from '../components/ui/Select';
import BaseModal from '../components/modals/BaseModal';

const Configuration: React.FC = () => {
  const { theme, setTheme } = useThemeContext();
  const { 
    exportProjects, 
    importProjects, 
    clearAllProjects 
  } = useProjectManager();
  const { clearAllAnalyticsData } = useAnalytics();

  const [language, setLanguage] = useState('pt-BR');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Opções de idioma
  const languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español (España)' }
  ];

  // Importar projetos
  const handleImportProjects = async () => {
    if (importFile) {
      try {
        const fileContent = await importFile.text();
        importProjects(fileContent);
        setIsImportModalOpen(false);
        setImportFile(null);
      } catch (error) {
        console.error('Erro ao importar projetos:', error);
      }
    }
  };

  // Exportar projetos
  const handleExportProjects = () => {
    const projectsJson = exportProjects();
    const blob = new Blob([projectsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beam_calculator_projects_${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Redefinir dados
  const handleResetData = () => {
    clearAllProjects();
    clearAllAnalyticsData();
    setIsResetModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center mb-6">
        <Settings className="mr-4 text-gray-700 dark:text-gray-300" size={32} />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Configurações
        </h1>
      </div>

      {/* Seção de Tema */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Palette className="mr-2 text-blue-500" />
          Aparência
        </h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">
            Modo Escuro
          </span>
          <Switch
            checked={theme === 'dark'}
            onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
      </div>

      {/* Seção de Idioma */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Globe className="mr-2 text-green-500" />
          Idioma
        </h2>
        <Select
          label="Selecione o Idioma"
          options={languageOptions}
          value={language}
          onChange={(value) => setLanguage(value as string)}
        />
      </div>

      {/* Seção de Gerenciamento de Dados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Download className="mr-2 text-purple-500" />
          Gerenciamento de Dados
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">
              Exportar Projetos
            </span>
            <Button 
              variant="secondary"
              onClick={handleExportProjects}
              leftIcon={<Download />}
            >
              Exportar
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">
              Importar Projetos
            </span>
            <Button 
              variant="secondary"
              onClick={() => setIsImportModalOpen(true)}
              leftIcon={<Upload />}
            >
              Importar
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-700 dark:text-red-400">
              Redefinir Todos os Dados
            </span>
            <Button 
              variant="danger"
              onClick={() => setIsResetModalOpen(true)}
              leftIcon={<Trash2 />}
            >
              Redefinir
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Importação */}
      <BaseModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar Projetos"
      >
        <div className="space-y-4">
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImportFile(file);
            }}
            className="w-full p-2 border rounded"
          />
          <Button
            variant="primary"
            fullWidth
            onClick={handleImportProjects}
            disabled={!importFile}
          >
            Importar
          </Button>
        </div>
      </BaseModal>

      {/* Modal de Confirmação de Redefinição */}
      <BaseModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Confirmar Redefinição"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Tem certeza que deseja redefinir todos os dados? 
            Esta ação não pode ser desfeita.
          </p>
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={handleResetData}
            >
              Redefinir
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default Configuration;