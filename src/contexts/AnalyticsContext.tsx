import React, { 
    createContext, 
    useState, 
    useContext, 
    useCallback, 
    useEffect 
  } from 'react';
  import AnalyticsService from '../services/analyticsService';
  import { BeamType, AnalysisResultType } from '../types/Beam';
  
  // Interface para o contexto de Analytics
  interface AnalyticsContextType {
    analytics: {
      totalProjectsCreated: number;
      totalAnalysesMade: number;
      averageBeamLength: number;
      materialUsageCount: Record<string, number>;
      loadTypeDistribution: Record<string, number>;
    };
    events: Array<{
      type: string;
      timestamp: number;
      data?: any;
    }>;
    logProjectCreation: (project: BeamType) => void;
    logBeamAnalysis: (project: BeamType, results: AnalysisResultType) => void;
    clearAllAnalyticsData: () => void;
  }
  
  // Criação do contexto
  const AnalyticsContext = createContext<AnalyticsContextType>({
    analytics: {
      totalProjectsCreated: 0,
      totalAnalysesMade: 0,
      averageBeamLength: 0,
      materialUsageCount: {},
      loadTypeDistribution: {}
    },
    events: [],
    logProjectCreation: () => {},
    logBeamAnalysis: () => {},
    clearAllAnalyticsData: () => {}
  });
  
  // Provider do contexto
  export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [analytics, setAnalytics] = useState(() => 
      AnalyticsService.getAnalytics()
    );
    const [events, setEvents] = useState(() => 
      AnalyticsService.getEvents()
    );
  
    // Log de evento de criação de projeto
    const logProjectCreation = useCallback((project: BeamType) => {
      AnalyticsService.logEvent('PROJECT_CREATED', project);
      setAnalytics(AnalyticsService.getAnalytics());
      setEvents(AnalyticsService.getEvents());
    }, []);
  
    // Log de análise de viga
    const logBeamAnalysis = useCallback((project: BeamType, results: AnalysisResultType) => {
      AnalyticsService.logEvent('BEAM_ANALYSIS', project);
      
      const analysisDetails = AnalyticsService.analyzeBeamResults(results);
      AnalyticsService.logEvent('BEAM_ANALYSIS_DETAILS', analysisDetails);
      
      setAnalytics(AnalyticsService.getAnalytics());
      setEvents(AnalyticsService.getEvents());
    }, []);
  
    // Limpar todos os dados de analytics
    const clearAllAnalyticsData = useCallback(() => {
      AnalyticsService.clearAllData();
      setAnalytics(AnalyticsService.getAnalytics());
      setEvents([]);
    }, []);
  
    // Atualizar eventos periodicamente
    useEffect(() => {
      const intervalId = setInterval(() => {
        setEvents(AnalyticsService.getEvents());
        setAnalytics(AnalyticsService.getAnalytics());
      }, 5000);
  
      return () => clearInterval(intervalId);
    }, []);
  
    return (
      <AnalyticsContext.Provider value={{
        analytics,
        events,
        logProjectCreation,
        logBeamAnalysis,
        clearAllAnalyticsData
      }}>
        {children}
      </AnalyticsContext.Provider>
    );
  };
  
  // Hook personalizado para usar o contexto
  export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    
    if (!context) {
      throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    
    return context;
  };
  
  export default AnalyticsContext;