import { CalculatorInputs, CalculationResults, TileCategory } from '../types';
import { 
  TILE_DATA, 
  RAFTER_SPACING_METERS,
  SPACING_FIBROCIMENTO,
  SPACING_ECOLOGICA,
  WOOD_LOSS_MARGIN,
  SCREWS_PER_TILE_FIBROCIMENTO,
  SCREWS_PER_TILE_ECOLOGICA,
  NOMINAL_WIDTH_FIBRO,
  OVERLAP_WIDTH_FIBRO,
  OVERLAP_LENGTH_FIBRO_STD,
  OVERLAP_LENGTH_FIBRO_LOW,
  NOMINAL_WIDTH_ECOLOGICA,
  LENGTH_ECOLOGICA,
  OVERLAP_WIDTH_ECOLOGICA,
  OVERLAP_LENGTH_ECOLOGICA
} from '../constants';

// ========================================================================
// CONSTANTES DE SEGURANÇA (SECURITY BOUNDARIES)
// ========================================================================
// Definem os limites máximos aceitáveis para inputs numéricos.
// Isso previne ataques de Negação de Serviço (DoS) que poderiam ocorrer
// se o sistema tentasse alocar arrays gigantescos ou loops infinitos.
const MAX_DIMENSION = 1000; // Limite de 1km para largura/comprimento
const MAX_SLOPE = 400; // Limite aumentado para 400 para permitir até 75 graus (~373%)

// ========================================================================
// HELPER: CONVERSÃO MATEMÁTICA
// ========================================================================
/**
 * Converte porcentagem de inclinação para graus.
 * Fórmula: arctan(porcentagem / 100) * (180 / PI)
 */
export const percentageToDegrees = (percentage: number): number => {
  return (Math.atan(percentage / 100) * 180) / Math.PI;
};

// ========================================================================
// HELPER: SANITIZAÇÃO DE NÚMEROS
// ========================================================================
// Função utilitária para limpar e validar entradas numéricas.
// - Garante que não é NaN.
// - Garante que é finito.
// - Converte negativos para positivos (Math.abs).
// - Aplica o teto máximo (Math.min).
const sanitizeNumber = (value: number, max: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  return Math.min(Math.max(0, Math.abs(value)), max);
};

// ========================================================================
// FUNÇÃO PRINCIPAL DE CÁLCULO
// ========================================================================
export const calculateRoof = (inputs: CalculatorInputs): CalculationResults => {
  try {
    // ------------------------------------------------------------------------
    // 1. SANITIZAÇÃO DE ENTRADA (INPUT SANITIZATION)
    // ------------------------------------------------------------------------
    // Limpa os dados brutos recebidos da UI antes de qualquer processamento matemático.
    const width = sanitizeNumber(inputs.width, MAX_DIMENSION);
    const length = sanitizeNumber(inputs.length, MAX_DIMENSION);
    const slope = sanitizeNumber(inputs.slope, MAX_SLOPE);

    // ------------------------------------------------------------------------
    // 2. VALIDAÇÃO DE WHITELIST (INTEGRIDADE REFERENCIAL)
    // ------------------------------------------------------------------------
    // Garante que a categoria selecionada é válida.
    // Se um atacante injetar uma string inválida, reverte para 'CERAMICA'.
    const safeCategory = Object.values(TileCategory).includes(inputs.category) 
      ? inputs.category 
      : TileCategory.CERAMICA;

    // Garante que o modelo de telha existe dentro da categoria selecionada.
    const availableModels = TILE_DATA[safeCategory] || TILE_DATA[TileCategory.CERAMICA];
    let selectedModel = availableModels.find(m => m.id === inputs.tileModelId);
    
    // Fallback de segurança: Se o ID for inválido, usa o primeiro modelo da lista.
    if (!selectedModel) {
      selectedModel = availableModels[0];
    }

    // ------------------------------------------------------------------------
    // 3. VARIÁVEIS INICIAIS E ÁREA BÁSICA
    // ------------------------------------------------------------------------
    // Área plana (Chão)
    const areaTotal = width * length;
    
    // Fator de correção de inclinação (Pitágoras simplificado para área)
    // Usado como base para cálculos genéricos ou estimativas.
    // Nota: Algoritmos de grade (Fibro/Eco) calculam sua própria geometria abaixo.
    let areaCorrected = areaTotal * (1 + slope / 100); 

    // Inicialização de variáveis de resultado
    let tileCount = 0;
    let woodTotalLength = 0;
    let woodLabel = "Ripas (Madeira)";
    let fixationCount = 0;
    let fixationLabel = "Pregos (p/ Ripas)";

    // ------------------------------------------------------------------------
    // 4. LÓGICA CONDICIONAL POR CATEGORIA (BUSINESS LOGIC)
    // ------------------------------------------------------------------------

    if (safeCategory === TileCategory.FIBROCIMENTO) {
      // ======================================================================
      // ALGORITMO A: GRADE DE MONTAGEM (FIBROCIMENTO)
      // ======================================================================
      // Método: Fileiras x Colunas (Mais preciso que m²)
      
      woodLabel = "Metragem linear de Vigas/Terças";
      fixationLabel = "Parafusos (Fix. Telha)";

      // A. Identifica o comprimento nominal da telha selecionada pelo ID
      let tileLength = 2.44; // Default
      switch(selectedModel.id) {
        case 'fibro_183': tileLength = 1.83; break;
        case 'fibro_244': tileLength = 2.44; break;
        case 'fibro_305': tileLength = 3.05; break;
        case 'fibro_366': tileLength = 3.66; break;
      }

      // B. Regra de Sobreposição Longitudinal baseada na inclinação
      // >= 15% usa 14cm, < 15% usa 20cm
      const overlapLength = slope >= 15 ? OVERLAP_LENGTH_FIBRO_STD : OVERLAP_LENGTH_FIBRO_LOW;

      // C. Cálculo do Comprimento da Água (Hipotenusa Real)
      // Transforma o comprimento horizontal na medida inclinada real do telhado.
      const inclinationFactor = Math.sqrt(1 + Math.pow(slope / 100, 2));
      const waterLength = length * inclinationFactor;

      // Atualiza área corrigida para refletir a geometria real (usada em relatórios)
      areaCorrected = width * waterLength;

      // D. Dimensões Úteis (Área efetiva de cobertura da telha)
      const usefulWidth = NOMINAL_WIDTH_FIBRO - OVERLAP_WIDTH_FIBRO;
      const usefulLength = tileLength - overlapLength;

      // E. Cálculo de Colunas (Largura) - Arredondamento para CIMA
      const cols = Math.ceil(width / usefulWidth);

      // F. Cálculo de Fileiras (Comprimento da Água) - Arredondamento para CIMA
      const rows = Math.ceil(waterLength / usefulLength);

      // G. Total
      tileCount = cols * rows;

      // H. Estrutura (Vigas)
      // Usa espaçamento específico (ex: 1.10m)
      if (SPACING_FIBROCIMENTO > 0) {
        woodTotalLength = (areaCorrected / SPACING_FIBROCIMENTO) * WOOD_LOSS_MARGIN;
      }
      
      // I. Fixação (Parafusos)
      fixationCount = tileCount * SCREWS_PER_TILE_FIBROCIMENTO;

    } else if (safeCategory === TileCategory.ECOLOGICA) {
      // ======================================================================
      // ALGORITMO B: GRADE DE MONTAGEM (ECOLÓGICA)
      // ======================================================================
      // Método: Fileiras x Colunas específico para dimensões Onduline (0.82 util)
      
      woodLabel = "Metragem linear de Caibros/Apoios";
      fixationLabel = "Fixadores (Fix. Telha)";
      
      // A. Definição de Dimensões e Sobreposições (Fixas conforme constantes)
      // Largura Nominal: 0.82m / Comprimento: 2.00m
      const usefulWidth = NOMINAL_WIDTH_ECOLOGICA - OVERLAP_WIDTH_ECOLOGICA; // ~0.72m
      const usefulLength = LENGTH_ECOLOGICA - OVERLAP_LENGTH_ECOLOGICA;      // ~1.84m
      
      // B. Interpretação do Input 'Length'
      // Para Ecológica, assumimos que o usuário inseriu o comprimento da água (inclinado)
      // SEGUINDO A LÓGICA DO ÚLTIMO FIX: O 'length' inserido é tratado como comprimento da água.
      const waterLength = length; 

      // Recalcula área corrigida apenas para exibição (Largura x Água)
      areaCorrected = width * waterLength;

      // C. Cálculo de Colunas e Fileiras
      const cols = Math.ceil(width / usefulWidth);
      const rows = Math.ceil(waterLength / usefulLength);
      
      // D. Total Bruto
      const grossTileCount = cols * rows;

      // E. Aplicação de Margem de Perda (10%)
      tileCount = Math.ceil(grossTileCount * 1.10);

      // F. Estrutura (Apoios) - Regra Estrita de 46cm
      // O número de linhas de apoio é (Comprimento Água / 0.46) + 1
      if (SPACING_ECOLOGICA > 0) {
        const supportRows = Math.ceil(waterLength / SPACING_ECOLOGICA) + 1;
        woodTotalLength = supportRows * width;
      }

      // G. Fixação (18 fixadores por telha)
      fixationCount = tileCount * SCREWS_PER_TILE_ECOLOGICA;

    } else {
      // ======================================================================
      // ALGORITMO C: PADRÃO DE RENDIMENTO (CERÂMICA/OUTROS)
      // ======================================================================
      // Método: Área Total * Telhas/m²
      
      woodLabel = "Ripas (Madeira)";
      fixationLabel = "Pregos (p/ Ripas)";
      
      // A. Cálculo de Telhas (Baseado em m²)
      tileCount = Math.ceil(areaCorrected * selectedModel.yieldPerSqm);
      
      // B. Cálculo de Ripas (Se houver espaçamento definido, ex: 32cm)
      if (selectedModel.battenSpacing && length > 0) {
        const spacingInMeters = selectedModel.battenSpacing / 100;
        
        // Calcula comprimento inclinado para determinar quantas fileiras de ripas cabem
        const inclinationFactor = Math.sqrt(1 + Math.pow(slope / 100, 2));
        const waterLength = length * inclinationFactor;
        
        if (spacingInMeters > 0.01) {
          // Fórmula: (Comprimento Água / Espaçamento) + 1 * Largura do Telhado
          const battenRows = Math.ceil((waterLength / spacingInMeters) + 1);
          woodTotalLength = battenRows * width;
        }
      }

      // C. Cálculo de Pregos (Fixação de Ripas nos Caibros)
      // Estima 1 prego a cada cruzamento com caibro (a cada 50cm)
      if (woodTotalLength > 0 && RAFTER_SPACING_METERS > 0) {
         fixationCount = Math.ceil(woodTotalLength / RAFTER_SPACING_METERS);
      }
    }

    // ------------------------------------------------------------------------
    // 5. RETORNO DOS RESULTADOS (OUTPUT)
    // ------------------------------------------------------------------------
    // Retorna um objeto contendo os resultados e também os inputs sanitizados.
    // O 'sanitizedInputs' serve como Fonte de Verdade para o gerador de PDF,
    // garantindo que o relatório mostre exatamente os dados usados na conta.
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
    // ------------------------------------------------------------------------
    // 6. TRATAMENTO DE ERROS (ERROR HANDLING)
    // ------------------------------------------------------------------------
    // Lança um erro genérico para ser capturado pela UI, sem expor detalhes internos.
    throw new Error("Erro no processamento matemático.");
  }
};