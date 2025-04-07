// Tipos de cargas
export type LoadType = 
  | PointLoadType 
  | DistributedLoadType 
  | MomentLoadType;

export interface BaseLoadType {
  id: string;
  position: number;
}

export interface PointLoadType extends BaseLoadType {
  type: 'point';
  value: number;
}

export interface DistributedLoadType extends BaseLoadType {
  type: 'distributed';
  value: number;
  length: number;
}

export interface MomentLoadType extends BaseLoadType {
  type: 'moment';
  value: number;
}

// Tipos de apoios
export type SupportType = 
  | SimpleSupportType 
  | FixedSupportType 
  | RollerSupportType;

export interface BaseSupportType {
  id: string;
  position: number;
}

export interface SimpleSupportType extends BaseSupportType {
  type: 'simple';
}

export interface FixedSupportType extends BaseSupportType {
  type: 'fixed';
}

export interface RollerSupportType extends BaseSupportType {
  type: 'roller';
}

// Tipos de seções transversais
export type SectionType = 
  | RectangularSectionType 
  | CircularSectionType 
  | IBeamSectionType;

export interface BaseSectionType {
  id: string;
  type: 'rectangle' | 'circle' | 'i_beam';
}

export interface RectangularSectionType extends BaseSectionType {
  type: 'rectangle';
  dimensions: {
    width: number;
    height: number;
  };
}

export interface CircularSectionType extends BaseSectionType {
  type: 'circle';
  dimensions: {
    width: number; // diâmetro
  };
}

export interface IBeamSectionType extends BaseSectionType {
  type: 'i_beam';
  dimensions: {
    width: number;
    height: number;
    webThickness: number;
    flangeThickness: number;
  };
}

// Tipo de Material
export interface MaterialType {
  id: string;
  name: string;
  elasticModulus: number;
  density: number;
  yieldStrength?: number;
}

// Resultados de Análise
export interface AnalysisResultType {
  reactions: {
    position: number;
    value: number;
    type: string;
  }[];
  shearForce: {
    x: number;
    value: number;
  }[];
  bendingMoment: {
    x: number;
    value: number;
  }[];
  deflection: {
    x: number;
    value: number;
  }[];
  maxValues: {
    shear: number;
    moment: number;
    deflection: number;
  };
}

// Definição completa da Viga
export interface BeamType {
  id: string;
  name: string;
  length: number;
  material: MaterialType;
  section: SectionType;
  supports: SupportType[];
  loads: LoadType[];
  analysisResults?: AnalysisResultType;
}

// Tipos para Requisição de Análise
export interface BeamAnalysisRequest {
  beamLength: number;
  loads: {
    type: 'point' | 'distributed' | 'moment';
    value: number;
    position: number;
    length?: number;
  }[];
  supports: {
    type: 'simple' | 'fixed' | 'roller';
    position: number;
  }[];
  elasticModulus: number;
  momentOfInertia: number;
}

// Tipo para Resultado de Análise
export interface AnalysisResult {
  input: {
    beamLength: number;
    elasticModulus: number;
    momentOfInertia: number;
  };
  results: AnalysisResultType;
}