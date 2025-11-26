import { TileCategory, TileModel } from './types';

// ========================================================================
// CONFIGURAÇÕES ESTRUTURAIS GERAIS
// ========================================================================

// Distância padrão entre caibros em metros. 
// Usado para calcular pregos (1 prego por interseção de Ripa x Caibro).
export const RAFTER_SPACING_METERS = 0.50; 

// Espaçamento estrutural (Vigas/Terças/Apoios) em metros por categoria.
// Define a distância entre os apoios de madeira.
export const SPACING_FIBROCIMENTO = 1.10;
export const SPACING_ECOLOGICA = 0.46; // 46cm conforme manual de instalação
export const WOOD_LOSS_MARGIN = 1.10; // Margem de segurança de +10% para madeira

// ========================================================================
// CONSTANTES DE TELHAS: FIBROCIMENTO
// ========================================================================

// Dimensões nominais e sobreposições para cálculo de Fibrocimento.
export const NOMINAL_WIDTH_FIBRO = 1.10;
export const OVERLAP_WIDTH_FIBRO = 0.05; // 5cm de sobreposição lateral
export const OVERLAP_LENGTH_FIBRO_STD = 0.14; // 14cm para inclinação >= 15%
export const OVERLAP_LENGTH_FIBRO_LOW = 0.20; // 20cm para inclinação < 15%

// ========================================================================
// CONSTANTES DE TELHAS: ECOLÓGICA
// ========================================================================

// Dimensões nominais e sobreposições para cálculo de Telha Ecológica.
// Necessárias para o algoritmo de Grade (Fileiras x Colunas).
export const NOMINAL_WIDTH_ECOLOGICA = 0.82;
export const LENGTH_ECOLOGICA = 2.00;
export const OVERLAP_WIDTH_ECOLOGICA = 0.10;
export const OVERLAP_LENGTH_ECOLOGICA = 0.16;

// ========================================================================
// LÓGICA DE FIXAÇÃO
// ========================================================================

// Quantidade de fixadores (parafusos/pregos) por unidade de telha.
export const SCREWS_PER_TILE_FIBROCIMENTO = 4;
export const SCREWS_PER_TILE_ECOLOGICA = 18;

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
    // O rendimento por m² é ignorado no novo algoritmo de Grade, mantido apenas para compatibilidade de tipos
    { id: 'fibro_183', name: '1,83 x 1,10m', yieldPerSqm: 2, isFibrocement: true },
    { id: 'fibro_244', name: '2,44 x 1,10m', yieldPerSqm: 2.68, isFibrocement: true },
    { id: 'fibro_305', name: '3,05 x 1,10m', yieldPerSqm: 3.36, isFibrocement: true },
    { id: 'fibro_366', name: '3,66 x 1,10m', yieldPerSqm: 4, isFibrocement: true },
  ]),
});

// ========================================================================
// CORES DO TEMA
// ========================================================================

// Paleta de cores oficial da aplicação
export const COLORS = Object.freeze({
  primary: '#5c1302',
  secondary: '#ffcb00',
  white: '#ffffff',
  black: '#000000',
});