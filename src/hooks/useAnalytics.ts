import { useState, useCallback, useEffect } from 'react';
import AnalyticsService from '../services/analyticsService';
import { BeamType, AnalysisResultType } from '../types/Beam';

export const useAnalytics = () => {
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
  }, []);

  // Log de análise de viga
  const logBeamAnalysis = useCallback((project: BeamType, results: AnalysisResultType) => {
    AnalyticsService.logEvent('BEAM_ANALYSIS', project);
    
    const analysisDetails = AnalyticsService.analyzeBeamResults(results);
    AnalyticsService.logEvent('BEAM_ANALYSIS_DETAILS', analysisDetails);
    
    setAnalytics(AnalyticsService.getAnalytics());
    setEvents(AnalyticsService.getEvents());
  }, []);

  // Atualizar eventos periodicamente
  useEffect(() => {
    const intervalId = setInterval(() => {
      setEvents(AnalyticsService.getEvents());
      setAnalytics(AnalyticsService.getAnalytics());
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Limpar todos os dados
  const clearAllAnalyticsData = useCallback(() => {
    AnalyticsService.clearAllData();
    setAnalytics(AnalyticsService.getAnalytics());
    setEvents([]);
  }, []);

  return {
    analytics,
    events,
    logProjectCreation,
    logBeamAnalysis,
    clearAllAnalyticsData
  };
};