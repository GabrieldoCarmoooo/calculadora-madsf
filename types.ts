export enum TileCategory {
  CERAMICA = 'Cerâmica',
  CONCRETO = 'Concreto',
  ESMALTADA = 'Esmaltada',
  ECOLOGICA = 'Ecológica',
  FIBROCIMENTO = 'Fibrocimento 1,10m',
}

export interface TileModel {
  id: string;
  name: string;
  yieldPerSqm: number; // Telhas por m²
  battenSpacing?: number; // cm (undefined if not using battens)
  isFibrocement?: boolean;
}

export interface CalculatorInputs {
  width: number;
  length: number;
  slope: number;
  category: TileCategory;
  tileModelId: string;
}

export interface CalculationResults {
  // Integrity: Return the actual inputs used for calculation (after sanitization)
  sanitizedInputs: {
    width: number;
    length: number;
    slope: number;
    category: TileCategory;
    modelName: string;
  };

  areaTotal: number;
  areaCorrected: number;
  tileCount: number;
  
  // Generic fields to handle dynamic labels (Ripas vs Vigas, Pregos vs Parafusos)
  woodTotalLength: number; 
  woodLabel: string; // "Ripas", "Vigas/Terças", "Caibros/Apoios"
  
  fixationCount: number;
  fixationLabel: string; // "Pregos", "Parafusos", "Fixadores"
}