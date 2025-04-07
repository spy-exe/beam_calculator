import { BeamType } from '../types/Beam';

class StorageService {
  private BEAM_PROJECTS_KEY = 'beam_calculator_projects';

  // Salvar projeto de viga
  saveBeamProject(project: BeamType) {
    try {
      const projects = this.getBeamProjects();
      
      // Verificar se já existe um projeto com este ID
      const existingProjectIndex = projects.findIndex(p => p.id === project.id);
      
      if (existingProjectIndex !== -1) {
        // Atualizar projeto existente
        projects[existingProjectIndex] = project;
      } else {
        // Adicionar novo projeto
        projects.push(project);
      }

      // Salvar no localStorage
      localStorage.setItem(
        this.BEAM_PROJECTS_KEY, 
        JSON.stringify(projects)
      );

      return project;
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      throw new Error('Não foi possível salvar o projeto');
    }
  }

  // Recuperar todos os projetos
  getBeamProjects(): BeamType[] {
    try {
      const projectsJson = localStorage.getItem(this.BEAM_PROJECTS_KEY);
      return projectsJson ? JSON.parse(projectsJson) : [];
    } catch (error) {
      console.error('Erro ao recuperar projetos:', error);
      return [];
    }
  }

  // Recuperar projeto específico por ID
  getBeamProjectById(id: string): BeamType | null {
    const projects = this.getBeamProjects();
    return projects.find(p => p.id === id) || null;
  }

  // Remover projeto
  deleteBeamProject(id: string) {
    try {
      const projects = this.getBeamProjects();
      const updatedProjects = projects.filter(p => p.id !== id);
      
      localStorage.setItem(
        this.BEAM_PROJECTS_KEY, 
        JSON.stringify(updatedProjects)
      );

      return updatedProjects;
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      throw new Error('Não foi possível excluir o projeto');
    }
  }

  // Limpar todos os projetos
  clearAllProjects() {
    try {
      localStorage.removeItem(this.BEAM_PROJECTS_KEY);
    } catch (error) {
      console.error('Erro ao limpar projetos:', error);
      throw new Error('Não foi possível limpar os projetos');
    }
  }

  // Exportar projetos para JSON
  exportProjects(): string {
    const projects = this.getBeamProjects();
    return JSON.stringify(projects, null, 2);
  }

  // Importar projetos de JSON
  importProjects(jsonString: string) {
    try {
      const projects: BeamType[] = JSON.parse(jsonString);
      
      // Validar estrutura básica
      if (!Array.isArray(projects)) {
        throw new Error('Formato de importação inválido');
      }

      localStorage.setItem(
        this.BEAM_PROJECTS_KEY, 
        JSON.stringify(projects)
      );

      return projects;
    } catch (error) {
      console.error('Erro ao importar projetos:', error);
      throw new Error('Não foi possível importar os projetos');
    }
  }
}

export default new StorageService();