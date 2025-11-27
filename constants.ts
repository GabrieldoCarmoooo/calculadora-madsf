import { TileCategory, TileModel } from './types';

// ========================================================================
// CONSTANTES DE CÁLCULO E ESTRUTURA
// ========================================================================

// Margem de segurança para cálculo de madeira (10%)
export const WOOD_LOSS_MARGIN = 1.10;

// Espaçamento padrão de caibros (em metros) - Usado para cálculo de pregos
export const RAFTER_SPACING_METERS = 0.50;

// ========================================================================
// CONSTANTES: FIBROCIMENTO
// ========================================================================
export const SPACING_FIBROCIMENTO = 1.10;      // Espaçamento máximo de apoios (Vigas)
export const SCREWS_PER_TILE_FIBROCIMENTO = 2; // Parafusos de fixação por telha
export const NOMINAL_WIDTH_FIBRO = 1.10;       // Largura nominal da telha
export const OVERLAP_WIDTH_FIBRO = 0.05;       // Sobreposição lateral (5cm)
export const OVERLAP_LENGTH_FIBRO_STD = 0.14;  // Sobreposição longitudinal padrão (>= 15 graus)
export const OVERLAP_LENGTH_FIBRO_LOW = 0.20;  // Sobreposição longitudinal baixa inclinação (< 15 graus)

// ========================================================================
// CONSTANTES: ECOLÓGICA
// ========================================================================
export const SPACING_ECOLOGICA = 0.46;         // Espaçamento de apoios (conforme regra de 46cm)
export const SCREWS_PER_TILE_ECOLOGICA = 18;   // Fixadores por telha
export const NOMINAL_WIDTH_ECOLOGICA = 0.82;   // Largura nominal considerada no cálculo
export const LENGTH_ECOLOGICA = 2.00;          // Comprimento nominal da telha
export const OVERLAP_WIDTH_ECOLOGICA = 0.10;   // Sobreposição lateral (~10cm)
export const OVERLAP_LENGTH_ECOLOGICA = 0.16;  // Sobreposição longitudinal (~16cm para resultar em ~1.84m útil)

// ========================================================================
// BANCO DE DADOS DE TELHAS
// ========================================================================

// Objeto imutável (congelado) contendo todos os modelos de telhas e seus rendimentos.
// Security: O Object.freeze previne manipulação via console do navegador (Tamper Protection).
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
    // O rendimento por m² é ignorado no novo algoritmo de Grade, mantido apenas para compatibilidade de tipos
    { id: 'onduline_stilo', name: 'Onduline Stilo', yieldPerSqm: 1.33, battenSpacing: 35 },
  ]),
  [TileCategory.FIBROCIMENTO]: Object.freeze([
    // Atualização refatorada: O valor 'yieldPerSqm' aqui representa a ÁREA ÚTIL (m²) da peça,
    // conforme solicitado na regra de negócio atualizada.
    { id: 'fibro_183', name: '1,83 x 1,10m', yieldPerSqm: 1.78, isFibrocement: true },
    { id: 'fibro_244', name: '2,44 x 1,10m', yieldPerSqm: 2.42, isFibrocement: true },
    { id: 'fibro_305', name: '3,05 x 1,10m', yieldPerSqm: 3.06, isFibrocement: true },
    { id: 'fibro_366', name: '3,66 x 1,10m', yieldPerSqm: 3.70, isFibrocement: true },
  ]),
});