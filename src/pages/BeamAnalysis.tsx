import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Ruler, 
  Layers, 
  BarChart2, 
  Settings, 
  Save, 
  Download, 
  Zap 
} from 'lucide-react';

import { useBeamCalculation } from '../hooks/useBeamCalculator';
import { useProjectManager } from '../hooks/useProjectManager';
import { useAnalytics } from '../hooks/useAnalytics';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import BaseModal from '../components/modals/BaseModal';

import { BeamType, LoadType, SupportType } from '../types/Beam';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BeamAnalysis: React.FC = () => {
  const { 
    beam, 
    createBeam, 
    addLoad, 
    addSupport, 
    calculateBeam,
    isLoading,
    error 
  } = useBeamCalculation();

  const { createProject } = useProjectManager();
  const { logBeamAnalysis } = useAnalytics();

  const [isAddLoadModalOpen, setIsAddLoadModalOpen] = useState(false);
  const [isAddSupportModalOpen, setIsAddSupportModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState<'shearForce' | 'bendingMoment' | 'deflection'>('shearForce');

  // Estados para novos elementos
  const [newLoad, setNewLoad] = useState<Partial<LoadType>>({
    type: 'point',
    value: 1000,
    position: beam?.length ? beam.length / 2 : 5
  });

  const [newSupport, setNewSupport] = useState<Partial<SupportType>>({
    type: 'simple',
    position: beam?.length ? beam.length / 2 : 5
  });

  // Inicializar viga se não existir
  useEffect(() => {
    if (!beam) {
      createBeam({
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
        }
      });
    }
  }, [beam, createBeam]);

  // Salvar projeto
  const handleSaveProject = () => {
    if (beam) {
      createProject(beam);
    }
  };

  // Realizar análise
  const handleAnalyzeBeam = async () => {
    if (beam) {
      const result = await calculateBeam();
      if (result) {
        logBeamAnalysis(beam, result.analysisResults!);
      }
    }
  };

  // Renderizar gráfico ativo
  const renderActiveChart = () => {
    if (!beam?.analysisResults) return null;

    const chartData = {
      shearForce: beam.analysisResults.shearForce,
      bendingMoment: beam.analysisResults.bendingMoment,
      deflection: beam.analysisResults.deflection
    }[activeChart];

    const chartConfig = {
      shearForce: {
        color: '#FF6384',
        label: 'Esforço Cortante (N)'
      },
      bendingMoment: {
        color: '#36A2EB',
        label: 'Momento Fletor (N·m)'
      },
      deflection: {
        color: '#FFCE56',
        label: 'Deflexão (m)'
      }
    }[activeChart];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="x" 
            label={{ value: 'Posição (m)', position: 'insideBottomRight', offset: -10 }} 
          />
          <YAxis 
            label={{ value: chartConfig.label, angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={chartConfig.color} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Análise de Viga
        </h1>
        <div className="flex space-x-2">
          <Button 
            variant="primary" 
            leftIcon={<Zap />}
            onClick={handleAnalyzeBeam}
            isLoading={isLoading}
          >
            Calcular
          </Button>
          <Button 
            variant="secondary" 
            leftIcon={<Save />}
            onClick={handleSaveProject}
          >
            Salvar Projeto
          </Button>
        </div>
      </div>

      {/* Informações Básicas da Viga */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <Ruler className="mr-2 text-blue-500" />
            <h3 className="font-semibold">Comprimento</h3>
          </div>
          <Input 
            type="number" 
            value={beam?.length || 0}
            onChange={(e) => createBeam({ length: parseFloat(e.target.value) })}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <Layers className="mr-2 text-green-500" />
            <h3 className="font-semibold">Material</h3>
          </div>
          <Select 
            options={[
              { value: 'steel', label: 'Aço' },
              { value: 'aluminum', label: 'Alumínio' },
              { value: 'concrete', label: 'Concreto' }
            ]}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-2">
            <BarChart2 className="mr-2 text-purple-500" />
            <h3 className="font-semibold">Seção Transversal</h3>
          </div>
          <Select 
            options={[
              { value: 'rectangular', label: 'Retangular' },
              { value: 'circular', label: 'Circular' },
              { value: 'i_beam', label: 'Perfil I' }
            ]}
          />
        </div>
      </div>

      {/* Cargas e Apoios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Cargas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Cargas</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsAddLoadModalOpen(true)}
            >
              Adicionar Carga
            </Button>
          </div>
          {beam?.loads.map((load, index) => (
            <div 
              key={load.id} 
              className="flex justify-between items-center p-2 border-b"
            >
              <span>{load.type} - {load.value} N</span>
              <span>Pos: {load.position}m</span>
            </div>
          ))}
        </div>

        {/* Apoios */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Apoios</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsAddSupportModalOpen(true)}
            >
              Adicionar Apoio
            </Button>
          </div>
          {beam?.supports.map((support, index) => (
            <div 
              key={support.id} 
              className="flex justify-between items-center p-2 border-b"
            >
              <span>{support.type}</span>
              <span>Pos: {support.position}m</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {beam?.analysisResults && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex space-x-4 mb-4">
            {['shearForce', 'bendingMoment', 'deflection'].map((chart) => (
              <Button
                key={chart}
                variant={activeChart === chart ? 'primary' : 'ghost'}
                onClick={() => setActiveChart(chart as any)}
              >
                {chart === 'shearForce' && 'Esforço Cortante'}
                {chart === 'bendingMoment' && 'Momento Fletor'}
                {chart === 'deflection' && 'Deflexão'}
              </Button>
            ))}
          </div>
          {renderActiveChart()}
        </div>
      )}

      {/* Modal para Adicionar Carga */}
      <BaseModal
        isOpen={isAddLoadModalOpen}
        onClose={() => setIsAddLoadModalOpen(false)}
        title="Adicionar Carga"
      >
        <div className="space-y-4">
          <Select
            label="Tipo de Carga"
            options={[
              { value: 'point', label: 'Pontual' },
              { value: 'distributed', label: 'Distribuída' },
              { value: 'moment', label: 'Momento' }
            ]}
            value={newLoad.type}
            onChange={(value) => setNewLoad({ ...newLoad, type: value as any })}
          />
          <Input
            label="Valor da Carga"
            type="number"
            value={newLoad.value}
            onChange={(e) => setNewLoad({ ...newLoad, value: parseFloat(e.target.value) })}
          />
          <Input
            label="Posição"
            type="number"
            value={newLoad.position}
            onChange={(e) => setNewLoad({ ...newLoad, position: parseFloat(e.target.value) })}
          />
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              addLoad(newLoad as LoadType);
              setIsAddLoadModalOpen(false);
            }}
          >
            Adicionar
          </Button>
        </div>
      </BaseModal>

      {/* Modal para Adicionar Apoio */}
      <BaseModal
        isOpen={isAddSupportModalOpen}
        onClose={() => setIsAddSupportModalOpen(false)}
        title="Adicionar Apoio"
      >
        <div className="space-y-4">
          <Select
            label="Tipo de Apoio"
            options={[
              { value: 'simple', label: 'Simples' },
              { value: 'fixed', label: 'Engastado' },
              { value: 'roller', label: 'Rolete' }
            ]}
            value={newSupport.type}
            onChange={(value) => setNewSupport({ ...newSupport, type: value as any })}
          />
          <Input
            label="Posição"
            type="number"
            value={newSupport.position}
            onChange={(e) => setNewSupport({ ...newSupport, position: parseFloat(e.target.value) })}
          />
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              addSupport(newSupport as SupportType);
              setIsAddSupportModalOpen(false);
            }}
          >
            Adicionar
          </Button>
        </div>
      </BaseModal>
    </div>
  );
};

export default BeamAnalysis;