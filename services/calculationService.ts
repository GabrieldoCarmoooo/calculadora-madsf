import { CalculatorInputs, CalculationResults } from '../types';
import { TILE_DATA } from '../constants';

export const calculateRoof = (inputs: CalculatorInputs): CalculationResults => {
  const { width, length, slope, category, tileModelId } = inputs;

  // 1. Calculate Areas
  // Prompt Formula: Area Total = Width * Length
  const areaTotal = width * length;

  // Prompt Formula: Area Corrigida = Area Total * (1 + Inclinação/100)
  const areaCorrected = areaTotal * (1 + slope / 100);

  // Get selected tile model
  const models = TILE_DATA[category];
  const selectedModel = models.find(m => m.id === tileModelId) || models[0];

  // 2. Tile Quantity
  // Logic: Area Corrigida * Rendimento
  const tileCount = Math.ceil(areaCorrected * selectedModel.yieldPerSqm);

  // 3. Battens (Ripas)
  let battenCount = 0;
  let battenTotalLength = 0;

  if (!selectedModel.isFibrocement && selectedModel.battenSpacing) {
    // Prompt Formula: Number of Ripas = (Comprimento do telhado / Espaçamento) + 1
    // Note: Spacing is in cm, length is in m. Convert spacing to m.
    const spacingInMeters = selectedModel.battenSpacing / 100;
    
    // We use the roof length (the run of the rafter + slope usually, but prompt says "Comprimento do Telhado"). 
    // Given the simplicity, we use input Length.
    battenCount = Math.ceil((length / spacingInMeters) + 1);

    // Prompt Formula: Comprimento Total = Numero de Ripas * Largura
    battenTotalLength = battenCount * width;
  }

  // 4. Nails (Pregos)
  // Prompt Formula: Qty Telhas * Pregos por Telha
  const nailCount = tileCount * selectedModel.nailsPerTile;

  return {
    areaTotal,
    areaCorrected,
    tileCount,
    battenCount,
    battenTotalLength,
    nailCount,
  };
};