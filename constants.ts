import { TileCategory, TileModel } from './types';

// Standard distance between rafters (caibros) in meters. 
// Used to calculate nails (1 nail per intersection of Batten x Rafter).
export const RAFTER_SPACING_METERS = 0.50; 

// Structural Spacing Logic (Meters)
export const SPACING_FIBROCIMENTO = 1.10;
export const SPACING_ECOLOGICA = 0.50;
export const WOOD_LOSS_MARGIN = 1.10; // +10%

// Fixation Logic (Units per Tile)
export const SCREWS_PER_TILE_FIBROCIMENTO = 4;
export const SCREWS_PER_TILE_ECOLOGICA = 18;

// Security: Use Object.freeze to prevent client-side tampering via browser console
export const TILE_DATA: Record<TileCategory, readonly TileModel[]> = Object.freeze({
  [TileCategory.CERAMICA]: Object.freeze([
    { id: 'portuguesa', name: 'Portuguesa', yieldPerSqm: 17.5, battenSpacing: 32 },
    { id: 'romana', name: 'Romana', yieldPerSqm: 16, battenSpacing: 32 },
    { id: 'francesa', name: 'Francesa', yieldPerSqm: 15, battenSpacing: 32 },
    { id: 'italiana', name: 'Italiana', yieldPerSqm: 13, battenSpacing: 32 },
  ]),
  [TileCategory.CONCRETO]: Object.freeze([
    { id: 'eurotop', name: 'Eurotop', yieldPerSqm: 10.4, battenSpacing: 34 },
  ]),
  [TileCategory.ESMALTADA]: Object.freeze([
    { id: 'americana', name: 'Americana', yieldPerSqm: 12, battenSpacing: 33 },
    { id: 'thermolev', name: 'Thermolev', yieldPerSqm: 5.5, battenSpacing: 33 },
  ]),
  [TileCategory.ECOLOGICA]: Object.freeze([
    { id: 'onduline_stilo', name: 'Onduline Stilo', yieldPerSqm: 1.33, battenSpacing: 35 },
  ]),
  [TileCategory.FIBROCIMENTO]: Object.freeze([
    // Using prompt specified "Rendimento definido" even if not technically correct
    { id: 'fibro_183', name: '1,83 x 1,10m', yieldPerSqm: 2, isFibrocement: true },
    { id: 'fibro_244', name: '2,44 x 1,10m', yieldPerSqm: 2.68, isFibrocement: true },
    { id: 'fibro_305', name: '3,05 x 1,10m', yieldPerSqm: 3.36, isFibrocement: true },
    { id: 'fibro_366', name: '3,66 x 1,10m', yieldPerSqm: 4, isFibrocement: true },
  ]),
});

export const COLORS = Object.freeze({
  primary: '#5c1302',
  secondary: '#ffcb00',
  white: '#ffffff',
  black: '#000000',
});