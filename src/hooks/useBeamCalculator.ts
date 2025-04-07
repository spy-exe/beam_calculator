import { useState, useCallback } from 'react';
import { BeamType, LoadType, SupportType } from '../types/Beam';
import BeamAnalysisService from '../services/beamAnalysisService';

export const useBeamCalculation = () => {
  const [beam, setBeam] = useState<BeamType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const addLoad = useCallback((load: LoadType) => {
    if (!beam) return;

    const updatedBeam = {
      ...beam,
      loads: [...beam.loads, { ...load, id: Date.now().toString() }]
    };

    setBeam(updatedBeam);
  }, [beam]);

  const addSupport = useCallback((support: SupportType) => {
    if (!beam) return;

    const updatedBeam = {
      ...beam,
      supports: [...beam.supports, { ...support, id: Date.now().toString() }]
    };

    setBeam(updatedBeam);
  }, [beam]);

  const calculateBeam = useCallback(async () => {
    if (!beam) {
      setError('Nenhuma viga definida');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const analysisResult = await BeamAnalysisService.analyzeBeam({
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
        analysisResults: analysisResult.results
      };

      setBeam(updatedBeam);
      return updatedBeam;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [beam]);

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

  return {
    beam,
    createBeam,
    addLoad,
    addSupport,
    calculateBeam,
    isLoading,
    error
  };
};