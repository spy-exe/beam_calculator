import { useState, useCallback, useEffect } from 'react';
import { BeamType } from '../types/Beam';
import StorageService from '../services/storageService';

export const useProjectManager = () => {
  const [projects, setProjects] = useState<BeamType[]>([]);
  const [currentProject, setCurrentProject] = useState<BeamType | null>(null);

  // Carregar projetos ao inicializar
  useEffect(() => {
    const savedProjects = StorageService.getBeamProjects();
    setProjects(savedProjects);
  }, []);

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

    setCurrentProject(updatedProject);
    return updatedProject;
  }, []);

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

  return {
    projects,
    currentProject,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    exportProjects,
    importProjects,
    clearAllProjects
  };
};