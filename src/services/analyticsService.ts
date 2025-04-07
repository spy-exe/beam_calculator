import { BeamType, AnalysisResultType } from '../types/Beam';

interface AnalyticsEvent {
  type: string;
  timestamp: number;
  data?: any;
}

interface BeamAnalytics {
  totalProjectsCreated: number;
  totalAnalysesMade: number;
  averageBeamLength: number;
  materialUsageCount: Record<string, number>;
  loadTypeDistribution: Record<string, number>;
}

class AnalyticsService {
  private EVENTS_KEY = 'beam_calculator_events';
  private ANALYTICS_KEY = 'beam_calculator_analytics';

  // Registrar evento
  logEvent(type: string, data?: any) {
    try {
      const event: AnalyticsEvent = {
        type,
        timestamp: Date.now(),
        data
      };

      const events = this.getEvents();
      events.push(event);

      // Limitar número de eventos
      const trimmedEvents = events.slice(-100);
      
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(trimmedEvents));
      
      // Atualizar analytics
      this.updateAnalytics(event);
    } catch (error) {
      console.error('Erro ao registrar evento:', error);
    }
  }

  // Recuperar eventos
  getEvents(): AnalyticsEvent[] {
    try {
      const eventsJson = localStorage.getItem(this.EVENTS_KEY);
      return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
      console.error('Erro ao recuperar eventos:', error);
      return [];
    }
  }

  // Atualizar analytics
  private updateAnalytics(event: AnalyticsEvent) {
    try {
      const analytics = this.getAnalytics();

      switch (event.type) {
        case 'PROJECT_CREATED':
          analytics.totalProjectsCreated++;
          break;
        case 'BEAM_ANALYSIS':
          analytics.totalAnalysesMade++;
          
          const beamData = event.data as BeamType;
          if (beamData) {
            // Atualizar comprimento médio
            analytics.averageBeamLength = (
              (analytics.averageBeamLength * (analytics.totalAnalysesMade - 1) + 
              beamData.length) / analytics.totalAnalysesMade
            );

            // Contagem de uso de materiais
            const materialId = beamData.material.id;
            analytics.materialUsageCount[materialId] = 
              (analytics.materialUsageCount[materialId] || 0) + 1;

            // Distribuição de tipos de carga
            beamData.loads.forEach(load => {
              analytics.loadTypeDistribution[load.type] = 
                (analytics.loadTypeDistribution[load.type] || 0) + 1;
            });
          }
          break;
      }

      localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error('Erro ao atualizar analytics:', error);
    }
  }

  // Recuperar analytics
  getAnalytics(): BeamAnalytics {
    try {
      const analyticsJson = localStorage.getItem(this.ANALYTICS_KEY);
      
      if (analyticsJson) {
        return JSON.parse(analyticsJson);
      }

      // Valor inicial se não existir
      return {
        totalProjectsCreated: 0,
        totalAnalysesMade: 0,
        averageBeamLength: 0,
        materialUsageCount: {},
        loadTypeDistribution: {}
      };
    } catch (error) {
      console.error('Erro ao recuperar analytics:', error);
      return {
        totalProjectsCreated: 0,
        totalAnalysesMade: 0,
        averageBeamLength: 0,
        materialUsageCount: {},
        loadTypeDistribution: {}
      };
    }
  }

  // Análise de resultados de viga
  analyzeBeamResults(results: AnalysisResultType) {
    return {
      maxShear: results.maxValues.shear,
      maxMoment: results.maxValues.moment,
      maxDeflection: results.maxValues.deflection,
      criticalPoints: this.findCriticalPoints(results)
    };
  }

  // Encontrar pontos críticos na análise
  private findCriticalPoints(results: AnalysisResultType) {
    return {
      maxShearLocation: this.findExtremePointLocation(results.shearForce, 'max'),
      maxMomentLocation: this.findExtremePointLocation(results.bendingMoment, 'max'),
      maxDeflectionLocation: this.findExtremePointLocation(results.deflection, 'max')
    };
  }

  // Encontrar localização de ponto extremo
  private findExtremePointLocation(
    data: { x: number, value: number }[], 
    type: 'max' | 'min'
  ) {
    const compareFunc = type === 'max' 
      ? (a: number, b: number) => Math.abs(a) > Math.abs(b)
      : (a: number, b: number) => Math.abs(a) < Math.abs(b);

    return data.reduce((extreme, current) => 
      compareFunc(current.value, extreme.value) ? current : extreme
    );
  }

  // Limpar todos os dados
  clearAllData() {
    try {
      localStorage.removeItem(this.EVENTS_KEY);
      localStorage.removeItem(this.ANALYTICS_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }
}

export default new AnalyticsService();