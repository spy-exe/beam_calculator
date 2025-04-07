import React, { 
    createContext, 
    useState, 
    useContext, 
    useCallback 
  } from 'react';
  import { BeamType } from '../types/Beam';
  import StorageService from '../services/storageService';
  
  // Tipo para o contexto do Project Manager
  interface ProjectManagerContextType {
    projects: BeamType[];
    currentProject: BeamType | null;
    createProject: (project: BeamType) => BeamType;
    updateProject: (project: BeamType) => BeamType;
    deleteProject: (projectId: string) => void;
    selectProject: (projectId: string) => BeamType | null;
    exportProjects: () => string;
    importProjects: (jsonString: string) => BeamType[];
    clearAllProjects: () => void;
  }
  
  // Criação do contexto
  const ProjectManagerContext = createContext<ProjectManagerContextType>({
    projects: [],
    currentProject: null,
    createProject: () => ({ id: '', name: '', length: 0 } as BeamType),
    updateProject: () => ({ id: '', name: '', length: 0 } as BeamType),
    deleteProject: () => {},
    selectProject: () => null,
    exportProjects: () => '',
    importProjects: () => [],
    clearAllProjects: () => {}
  });
  
  // Provider do contexto
  export const ProjectManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<BeamType[]>(() => 
      StorageService.getBeamProjects()
    );
    const [currentProject, setCurrentProject] = useState<BeamType | null>(null);
  
    // Criar novo projeto
    const createProject = useCallback((project: BeamType) => {
      const savedProject = StorageService.saveBeamProject(project);
      
      setProjects(prev => {
        const existingIndex = prev.findIndex(p => p.id === savedProject.id);
        
        if (existingIndex !== -1) {
          const updatedProjects = [...prev];
          updatedProjects[existingIndex] = savedProject;
          return updatedProjects;
        }
        
        return [...prev, savedProject];
      });
  
      setCurrentProject(savedProject);
      return savedProject;
    }, []);
  
    // Atualizar projeto existente
    const updateProject = useCallback((project: BeamType) => {
      const updatedProject = StorageService.saveBeamProject(project);
      
      setProjects(prev => prev.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      ));
  
      // Atualizar projeto atual se for o mesmo
      if (currentProject?.id === updatedProject.id) {
        setCurrentProject(updatedProject);
      }
  
      return updatedProject;
    }, [currentProject]);
  
    // Excluir projeto
    const deleteProject = useCallback((projectId: string) => {
      StorageService.deleteBeamProject(projectId);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      // Limpar projeto atual se for o projeto excluído
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
    }, [currentProject]);
  
    // Selecionar projeto atual
    const selectProject = useCallback((projectId: string) => {
      const project = StorageService.getBeamProjectById(projectId);
      setCurrentProject(project);
      return project;
    }, []);
  
    // Exportar projetos
    const exportProjects = useCallback(() => {
      return StorageService.exportProjects();
    }, []);
  
    // Importar projetos
    const importProjects = useCallback((jsonString: string) => {
      const importedProjects = StorageService.importProjects(jsonString);
      setProjects(importedProjects);
      return importedProjects;
    }, []);
  
    // Limpar todos os projetos
    const clearAllProjects = useCallback(() => {
      StorageService.clearAllProjects();
      setProjects([]);
      setCurrentProject(null);
    }, []);
  
    return (
      <ProjectManagerContext.Provider value={{
        projects,
        currentProject,
        createProject,
        updateProject,
        deleteProject,
        selectProject,
        exportProjects,
        importProjects,
        clearAllProjects
      }}>
        {children}
      </ProjectManagerContext.Provider>
    );
  };
  
  // Hook personalizado para usar o contexto
  export const useProjectManager = () => {
    const context = useContext(ProjectManagerContext);
    
    if (!context) {
      throw new Error('useProjectManager must be used within a ProjectManagerProvider');
    }
    
    return context;
  };
  
  export default ProjectManagerContext;