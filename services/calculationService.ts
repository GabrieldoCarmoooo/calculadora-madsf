import { CalculatorInputs, CalculationResults, TileCategory } from '../types';
import { 
  TILE_DATA, 
  RAFTER_SPACING_METERS,
  SPACING_FIBROCIMENTO,
  SPACING_ECOLOGICA,
  WOOD_LOSS_MARGIN,
  SCREWS_PER_TILE_FIBROCIMENTO,
  SCREWS_PER_TILE_ECOLOGICA
} from '../constants';

// SECURITY CONSTANTS
const MAX_DIMENSION = 1000; 
const MAX_SLOPE = 300; 

const sanitizeNumber = (value: number, max: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  return Math.min(Math.max(0, Math.abs(value)), max);
};

export const calculateRoof = (inputs: CalculatorInputs): CalculationResults => {
  try {
    // 1. Input Sanitization
    const width = sanitizeNumber(inputs.width, MAX_DIMENSION);
    const length = sanitizeNumber(inputs.length, MAX_DIMENSION);
    const slope = sanitizeNumber(inputs.slope, MAX_SLOPE);

    // 2. Whitelist Validation
    // Validate Category matches Enum
    const safeCategory = Object.values(TileCategory).includes(inputs.category) 
      ? inputs.category 
      : TileCategory.CERAMICA;

    // Validate Model exists in that Category
    const availableModels = TILE_DATA[safeCategory] || TILE_DATA[TileCategory.CERAMICA];
    let selectedModel = availableModels.find(m => m.id === inputs.tileModelId);
    
    // Fallback to first model if ID is invalid or not found
    if (!selectedModel) {
      selectedModel = availableModels[0];
    }

    // 3. Core Calculation Logic
    
    // Area
    const areaTotal = width * length;
    const areaCorrected = areaTotal * (1 + slope / 100);

    // Tile Quantity
    const tileCount = Math.ceil(areaCorrected * selectedModel.yieldPerSqm);

    // Structure (Wood) & Fixation Logic
    let woodTotalLength = 0;
    let woodLabel = "Ripas (Madeira)";
    let fixationCount = 0;
    let fixationLabel = "Pregos (p/ Ripas)";

    // CONDITIONAL LOGIC BASED ON CATEGORY
    if (safeCategory === TileCategory.FIBROCIMENTO) {
      // --- FIBROCIMENTO ---
      woodLabel = "Metragem linear de Vigas/Terças";
      fixationLabel = "Parafusos (Fix. Telha)";
      
      if (SPACING_FIBROCIMENTO > 0) {
        woodTotalLength = (areaCorrected / SPACING_FIBROCIMENTO) * WOOD_LOSS_MARGIN;
      }
      
      fixationCount = tileCount * SCREWS_PER_TILE_FIBROCIMENTO;

    } else if (safeCategory === TileCategory.ECOLOGICA) {
      // --- ECOLOGICA ---
      woodLabel = "Metragem linear de Caibros/Apoios";
      fixationLabel = "Fixadores (Fix. Telha)";

      if (SPACING_ECOLOGICA > 0) {
        woodTotalLength = (areaCorrected / SPACING_ECOLOGICA) * WOOD_LOSS_MARGIN;
      }

      fixationCount = tileCount * SCREWS_PER_TILE_ECOLOGICA;

    } else {
      // --- CERAMICA, CONCRETO, ESMALTADA (Standard Batten Logic) ---
      woodLabel = "Ripas (Madeira)";
      fixationLabel = "Pregos (p/ Ripas)";
      
      if (selectedModel.battenSpacing && length > 0) {
        const spacingInMeters = selectedModel.battenSpacing / 100;
        
        if (spacingInMeters > 0.01) {
          const battenRows = Math.ceil((length / spacingInMeters) + 1);
          woodTotalLength = battenRows * width;
        }
      }

      if (woodTotalLength > 0 && RAFTER_SPACING_METERS > 0) {
         fixationCount = Math.ceil(woodTotalLength / RAFTER_SPACING_METERS);
      }
    }

    // 4. Return Results including Sanitized Inputs (Integrity Check)
    return {
      sanitizedInputs: {
        width,
        length,
        slope,
        category: safeCategory,
        modelName: selectedModel.name
      },
      areaTotal: sanitizeNumber(areaTotal, Number.MAX_SAFE_INTEGER),
      areaCorrected: sanitizeNumber(areaCorrected, Number.MAX_SAFE_INTEGER),
      tileCount: sanitizeNumber(tileCount, Number.MAX_SAFE_INTEGER),
      
      woodTotalLength: sanitizeNumber(woodTotalLength, Number.MAX_SAFE_INTEGER),
      woodLabel,
      
      fixationCount: sanitizeNumber(fixationCount, Number.MAX_SAFE_INTEGER),
      fixationLabel
    };

  } catch (error) {
    throw new Error("Erro no processamento matemático.");
  }
};