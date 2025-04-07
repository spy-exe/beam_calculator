import axios from 'axios';
import { BeamAnalysisRequest, AnalysisResult } from '../types/Beam';

class BeamAnalysisService {
  private apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000
  });

  async analyzeBeam(data: BeamAnalysisRequest): Promise<AnalysisResult> {
    try {
      // Validações básicas
      if (data.beamLength <= 0) {
        throw new Error('Comprimento da viga deve ser positivo');
      }

      if (data.supports.length < 2) {
        throw new Error('Pelo menos dois apoios são necessários');
      }

      // Chamada para API de análise
      const response = await this.apiClient.post<AnalysisResult>('/beam/analyze', data);
      return response.data;
    } catch (error) {
      // Tratamento de erros
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Erro na análise da viga';
        console.error('Beam Analysis Error:', message);
        throw new Error(message);
      }
      
      console.error('Unexpected error:', error);
      throw new Error('Erro inesperado na análise da viga');
    }
  }

  // Método para buscar materiais pré-configurados
  async getMaterials() {
    try {
      const response = await this.apiClient.get('/materials');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar materiais:', error);
      throw error;
    }
  }

  // Método para buscar seções transversais
  async getBeamSections() {
    try {
      const response = await this.apiClient.get('/sections');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar seções:', error);
      throw error;
    }
  }
}

export default new BeamAnalysisService();