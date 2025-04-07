import React, { 
    createContext, 
    useState, 
    useContext, 
    useCallback 
  } from 'react';
  import BeamAnalysisService from '../services/beamAnalysisService';
  import { 
    BeamType, 
    LoadType, 
    SupportType, 
    AnalysisResultType 
  } from '../types/Beam';
  
  // Interface para o contexto de Cálculo de Viga
  interface BeamCalculationContextType {
    beam: BeamType | null;
    isLoading: boolean;
    error: string | null;
    createBeam: (initialData: Partial<BeamType>) => BeamType;
    addLoad: (load: LoadType) => void;
    removeLoad: (loadId: string) => void;
    updateLoad: (loadId: string, updates: Partial<LoadType>) => void;
    addSupport: (support: SupportType) => void;
    removeSupport: (supportId: string) => void;
    updateSupport: (supportId: string, updates: Partial<SupportType>) => void;
    calculateBeam: () => Promise<BeamType | null>;
    resetBeam: () => void;
  }
  
  // Criação do contexto
  const BeamCalculationContext = createContext<BeamCalculationContextType>({
    beam: null,
    isLoading: false,
    error: null,
    createBeam: () => ({ id: '', name: '', length: 0 } as BeamType),
    addLoad: () => {},
    removeLoad: () => {},
    updateLoad: () => {},
    addSupport: () => {},
    removeSupport: () => {},
    updateSupport: () => {},
    calculateBeam: async () => null,
    resetBeam: () => {}
  });
  
  // Provider do contexto
  export const BeamCalculationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [beam, setBeam] = useState<BeamType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    // Criar nova viga
    const createBeam = useCallback((initialData: Partial<BeamType>) => {
      const newBeam: BeamType = {
        id: Date.now().toString(),
        name: initialData.name || 'Nova Viga',
        length: initialData.length || 10,
        material: initialData.material || {
          id: 'steel',
          name: 'Aço',
          elasticModulus: 210e9,
          density: 7850
        },
        section: initialData.section || {
          id: 'rectangular',
          type: 'rectangle',
          dimensions: {
            width: 0.1,
            height: 0.2
          }
        },
        supports: initialData.supports || [
          { id: '1', type: 'simple', position: 0 },
          { id: '2', type: 'simple', position: 10 }
        ],
        loads: initialData.loads || [
          { 
            id: '1', 
            type: 'point', 
            value: 1000, 
            position: 5 
          }
        ]
      };
  
      setBeam(newBeam);
      return newBeam;
    }, []);
  
    // Adicionar carga
    const addLoad = useCallback((load: LoadType) => {
      if (!beam) return;
  
      const updatedBeam = {
        ...beam,
        loads: [...beam.loads, { ...load, id: Date.now().toString() }]
      };
  
      setBeam(updatedBeam);
    }, [beam]);
  
    // Remover carga
    const removeLoad = useCallback((loadId: string) => {
      if (!beam) return;
  
      const updatedBeam = {
        ...beam,
        loads: beam.loads.filter(load => load.id !== loadId)
      };
  
      setBeam(updatedBeam);
    }, [beam]);
  
    // Atualizar carga
    const updateLoad = useCallback((loadId: string, updates: Partial<LoadType>) => {
      if (!beam) return;
  
      const updatedBeam = {
        ...beam,
        loads: beam.loads.map(load => 
          load.id === loadId ? { ...load, ...updates } : load
        )
      };
  
      setBeam(updatedBeam);
    }, [beam]);
  
    // Adicionar apoio
    const addSupport = useCallback((support: SupportType) => {
      if (!beam) return;
  
      const updatedBeam = {
        ...beam,
        supports: [...beam.supports, { ...support, id: Date.now().toString() }]
      };
  
      setBeam(updatedBeam);
    }, [beam]);
  
    // Remover apoio
    const removeSupport = useCallback((supportId: string) => {
      if (!beam) return;
  
      const updatedBeam = {
        ...beam,
        supports: beam.supports.filter(support => support.id !== supportId)
      };
  
      setBeam(updatedBeam);
    }, [beam]);
  
    // Atualizar apoio
    const updateSupport = useCallback((supportId: string, updates: Partial<SupportType>) => {
      if (!beam) return;
  
      const updatedBeam = {
        ...beam,
        supports: beam.supports.map(support => 
          support.id === supportId ? { ...support, ...updates } : support
        )
      };
  
      setBeam(updatedBeam);
    }, [beam]);
  
    // Calcular viga
    const calculateBeam = useCallback(async () => {
      if (!beam) {
        setError('Nenhuma viga definida');
        return null;
      }
  
      setIsLoading(true);
      setError(null);
  
      try {
        const result = await BeamAnalysisService.analyzeBeam({
          beamLength: beam.length,
          loads: beam.loads.map(load => ({
            type: load.type,
            value: load.value,
            position: load.position,
            length: load.type === 'distributed' ? load.length : undefined
          })),
          supports: beam.supports.map(support => ({
            type: support.type,
            position: support.position
          })),
          elasticModulus: beam.material.elasticModulus,
          momentOfInertia: calculateMomentOfInertia(beam)
        });
  
        const updatedBeam = {
          ...beam,
          analysisResults: result.results
        };
  
        setBeam(updatedBeam);
        setIsLoading(false);
        return updatedBeam;
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Erro desconhecido ao calcular a viga';
        
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    }, [beam]);
  
    // Resetar viga
    const resetBeam = useCallback(() => {
      setBeam(null);
      setIsLoading(false);
      setError(null);
    }, []);
  
    // Função auxiliar para calcular momento de inércia
    const calculateMomentOfInertia = (beam: BeamType) => {
      const { type, dimensions } = beam.section;
      
      switch (type) {
        case 'rectangle':
          return (dimensions.width * Math.pow(dimensions.height, 3)) / 12;
        case 'circle':
          const radius = (dimensions.width || 0) / 2;
          return (Math.PI * Math.pow(radius, 4)) / 4;
        default:
          return 1e-6; // Valor padrão
      }
    };
  
    return (
      <BeamCalculationContext.Provider value={{
        beam,
        isLoading,
        error,
        createBeam,
        addLoad,
        removeLoad,
        updateLoad,
        addSupport,
        removeSupport,
        updateSupport,
        calculateBeam,
        resetBeam
      }}>
        {children}
      </BeamCalculationContext.Provider>
    );
  };
  
  // Hook personalizado para usar o contexto
  export const useBeamCalculation = () => {
    const context = useContext(BeamCalculationContext);
    
    if (!context) {
      throw new Error('useBeamCalculation must be used within a BeamCalculationProvider');
    }
    
    return context;
  };
  
  export default BeamCalculationContext;