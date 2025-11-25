import { TileCategory, TileModel } from './types';

export const TILE_DATA: Record<TileCategory, TileModel[]> = {
  [TileCategory.CERAMICA]: [
    { id: 'portuguesa', name: 'Portuguesa', yieldPerSqm: 17.5, battenSpacing: 32, nailsPerTile: 2 },
    { id: 'romana', name: 'Romana', yieldPerSqm: 16, battenSpacing: 32, nailsPerTile: 2 },
    { id: 'francesa', name: 'Francesa', yieldPerSqm: 15, battenSpacing: 32, nailsPerTile: 2 },
    { id: 'italiana', name: 'Italiana', yieldPerSqm: 13, battenSpacing: 32, nailsPerTile: 2 },
  ],
  [TileCategory.CONCRETO]: [
    { id: 'eurotop', name: 'Eurotop', yieldPerSqm: 10.4, battenSpacing: 34, nailsPerTile: 1 },
  ],
  [TileCategory.ESMALTADA]: [
    { id: 'americana', name: 'Americana', yieldPerSqm: 12, battenSpacing: 33, nailsPerTile: 2 },
    { id: 'thermolev', name: 'Thermolev', yieldPerSqm: 5.5, battenSpacing: 33, nailsPerTile: 2 },
  ],
  [TileCategory.ECOLOGICA]: [
    { id: 'onduline_stilo', name: 'Onduline Stilo', yieldPerSqm: 1.33, battenSpacing: 35, nailsPerTile: 4 },
  ],
  [TileCategory.FIBROCIMENTO]: [
    // Using prompt specified "Rendimento definido" even if not technically correct
    { id: 'fibro_183', name: '1,83 x 1,10m', yieldPerSqm: 2, isFibrocement: true, nailsPerTile: 6 },
    { id: 'fibro_244', name: '2,44 x 1,10m', yieldPerSqm: 2.68, isFibrocement: true, nailsPerTile: 8 },
    { id: 'fibro_305', name: '3,05 x 1,10m', yieldPerSqm: 3.36, isFibrocement: true, nailsPerTile: 10 },
    { id: 'fibro_366', name: '3,66 x 1,10m', yieldPerSqm: 4, isFibrocement: true, nailsPerTile: 12 },
  ],
};

export const COLORS = {
  primary: '#5c1302',
  secondary: '#ffcb00',
  white: '#ffffff',
  black: '#000000',
};