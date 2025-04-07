import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter 
} from 'lucide-react';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import BaseModal from '../components/modals/BaseModal';
import { MaterialType } from '../types/Beam';

const MaterialLibrary: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialType[]>([
    {
      id: 'steel',
      name: 'Aço Estrutural',
      elasticModulus: 210e9,
      density: 7850,
      yieldStrength: 250e6
    },
    {
      id: 'aluminum',
      name: 'Alumínio 6061-T6',
      elasticModulus: 69e9,
      density: 2700,
      yieldStrength: 240e6
    },
    {
      id: 'concrete',
      name: 'Concreto (25 MPa)',
      elasticModulus: 30e9,
      density: 2400,
      yieldStrength: 25e6
    }
  ]);

  const [filteredMaterials, setFilteredMaterials] = useState<MaterialType[]>(materials);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<MaterialType>>({});

  // Filtrar materiais
  useEffect(() => {
    const filtered = materials.filter(material => 
      material.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
  }, [searchTerm, materials]);

  // Adicionar novo material
  const handleAddMaterial = () => {
    if (!currentMaterial.name) return;

    const newMaterial: MaterialType = {
      id: Date.now().toString(),
      name: currentMaterial.name || '',
      elasticModulus: currentMaterial.elasticModulus || 0,
      density: currentMaterial.density || 0,
      yieldStrength: currentMaterial.yieldStrength
    };

    setMaterials(prev => [...prev, newMaterial]);
    setIsAddMaterialModalOpen(false);
    setCurrentMaterial({});
  };

  // Editar material
  const handleEditMaterial = (material: MaterialType) => {
    setCurrentMaterial(material);
    setIsAddMaterialModalOpen(true);
  };

  // Remover material
  const handleRemoveMaterial = (materialId: string) => {
    setMaterials(prev => prev.filter(m => m.id !== materialId));
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Biblioteca de Materiais
        </h1>
        <Button 
          variant="primary" 
          leftIcon={<Plus />}
          onClick={() => setIsAddMaterialModalOpen(true)}
        >
          Adicionar Material
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-grow">
          <Input
            leftIcon={<Search />}
            placeholder="Buscar material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" leftIcon={<Filter />}>
          Filtros
        </Button>
      </div>

      {/* Lista de Materiais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((material) => (
          <div 
            key={material.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{material.name}</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditMaterial(material)}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveMaterial(material.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Módulo de Elasticidade:</span>
                <span>{(material.elasticModulus / 1e9).toFixed(2)} GPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Densidade:</span>
                <span>{material.density} kg/m³</span>
              </div>
              {material.yieldStrength && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tensão de Escoamento:</span>
                  <span>{(material.yieldStrength / 1e6).toFixed(2)} MPa</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para Adicionar/Editar Material */}
      <BaseModal
        isOpen={isAddMaterialModalOpen}
        onClose={() => {
          setIsAddMaterialModalOpen(false);
          setCurrentMaterial({});
        }}
        title={currentMaterial.id ? 'Editar Material' : 'Adicionar Material'}
      >
        <div className="space-y-4">
          <Input
            label="Nome do Material"
            value={currentMaterial.name || ''}
            onChange={(e) => setCurrentMaterial(prev => ({
              ...prev, 
              name: e.target.value 
            }))}
          />
          <Input
            label="Módulo de Elasticidade (GPa)"
            type="number"
            value={(currentMaterial.elasticModulus || 0) / 1e9}
            onChange={(e) => setCurrentMaterial(prev => ({
              ...prev, 
              elasticModulus: parseFloat(e.target.value) * 1e9
            }))}
          />
          <Input
            label="Densidade (kg/m³)"
            type="number"
            value={currentMaterial.density || ''}
            onChange={(e) => setCurrentMaterial(prev => ({
              ...prev, 
              density: parseFloat(e.target.value)
            }))}
          />
          <Input
            label="Tensão de Escoamento (MPa)"
            type="number"
            value={currentMaterial.yieldStrength ? (currentMaterial.yieldStrength / 1e6) : ''}
            onChange={(e) => setCurrentMaterial(prev => ({
              ...prev, 
              yieldStrength: parseFloat(e.target.value) * 1e6
            }))}
          />
          <Button
            variant="primary"
            fullWidth
            onClick={handleAddMaterial}
          >
            {currentMaterial.id ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </BaseModal>
    </div>
  );
};

export default MaterialLibrary;