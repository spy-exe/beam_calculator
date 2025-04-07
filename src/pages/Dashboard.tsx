import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Plus, 
  FileText, 
  Settings, 
  Book, 
  Activity 
} from 'lucide-react';

import { useProjectManager } from '../hooks/useProjectManager';
import { useAnalytics } from '../hooks/useAnalytics';
import { BeamType } from '../types/Beam';
import Button from '../components/ui/Button';
import BaseModal from '../components/modals/BaseModal';
import FadeInOut from '../components/animations/FadeInOut';

const Dashboard: React.FC = () => {
  const { 
    projects, 
    createProject, 
    selectProject 
  } = useProjectManager();

  const { 
    analytics, 
    events 
  } = useAnalytics();

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<'projects' | 'analytics' | 'recent'>('projects');

  const handleCreateNewProject = () => {
    const newProject: BeamType = {
      id: Date.now().toString(),
      name: `Projeto ${projects.length + 1}`,
      length: 10,
      material: {
        id: 'steel',
        name: 'Aço',
        elasticModulus: 210e9,
        density: 7850
      },
      section: {
        id: 'rectangular',
        type: 'rectangle',
        dimensions: {
          width: 0.1,
          height: 0.2
        }
      },
      supports: [
        { id: '1', type: 'simple', position: 0 },
        { id: '2', type: 'simple', position: 10 }
      ],
      loads: [
        { 
          id: '1', 
          type: 'point', 
          value: 1000, 
          position: 5 
        }
      ]
    };

    createProject(newProject);
    setIsNewProjectModalOpen(false);
  };

  const renderProjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <motion.div
          key={project.id}
          whileHover={{ scale: 1.05 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer"
          onClick={() => selectProject(project.id)}
        >
          <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Comprimento: {project.length}m</span>
            <span>Material: {project.material.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <BarChart2 className="mr-2" />
          Projetos Criados
        </h3>
        <p className="text-3xl font-bold">{analytics.totalProjectsCreated}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <Activity className="mr-2" />
          Análises Realizadas
        </h3>
        <p className="text-3xl font-bold">{analytics.totalAnalysesMade}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <FileText className="mr-2" />
          Comprimento Médio
        </h3>
        <p className="text-3xl font-bold">{analytics.averageBeamLength.toFixed(2)}m</p>
      </div>
    </div>
  );

  const renderRecentEvents = () => (
    <div className="space-y-4">
      {events.slice(-10).reverse().map((event, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold">{event.type}</span>
            <span className="text-sm text-gray-500">
              {new Date(event.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Painel Principal
        </h1>
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            leftIcon={<Plus />}
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            Novo Projeto
          </Button>
          <Button 
            variant="ghost"
            leftIcon={<Settings />}
          >
            Configurações
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        {['projects', 'analytics', 'recent'].map(view => (
          <Button
            key={view}
            variant={selectedView === view ? 'primary' : 'ghost'}
            onClick={() => setSelectedView(view as any)}
          >
            {view === 'projects' && 'Projetos'}
            {view === 'analytics' && 'Analytics'}
            {view === 'recent' && 'Eventos Recentes'}
          </Button>
        ))}
      </div>

      <FadeInOut type="fade" isVisible={true}>
        {selectedView === 'projects' && renderProjects()}
        {selectedView === 'analytics' && renderAnalytics()}
        {selectedView === 'recent' && renderRecentEvents()}
      </FadeInOut>

      <BaseModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        title="Criar Novo Projeto"
        size="md"
      >
        <div className="space-y-4">
          <p>Deseja criar um novo projeto de viga?</p>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="secondary" 
              onClick={() => setIsNewProjectModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreateNewProject}
            >
              Criar Projeto
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default Dashboard;