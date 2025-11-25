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
  nailsPerTile: number; // Pregos por telha (can be overridden by size logic)
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
  areaTotal: number;
  areaCorrected: number;
  tileCount: number;
  battenCount: number;
  battenTotalLength: number;
  nailCount: number;
}