
// ========================================================================
// ENUMS E CATEGORIZAÇÃO
// ========================================================================
/**
 * Define as categorias principais de telhas suportadas pelo sistema.
 * Este enum é crucial para o 'Switch Case' na lógica de cálculo (calculationService),
 * pois define qual algoritmo será utilizado (Grade vs Rendimento).
 */
export enum TileCategory {
  CERAMICA = 'Cerâmica',
  CONCRETO = 'Concreto',
  ESMALTADA = 'Esmaltada',
  ECOLOGICA = 'Ecológica',
  FIBROCIMENTO = 'Fibrocimento 1,10m',
}

// ========================================================================
// DEFINIÇÃO DE PRODUTO (MODELO DE TELHA)
// ========================================================================
/**
 * Interface que representa um produto (modelo de telha) no banco de dados estático.
 * Contém as propriedades físicas e de rendimento necessárias para os cálculos.
 */
export interface TileModel {
  id: string;              // Identificador único (slug)
  name: string;            // Nome de exibição (Ex: "Romana", "Onduline Stilo")
  yieldPerSqm: number;     // Rendimento médio (Telhas/m²) - Usado para Cerâmica/Concreto
  battenSpacing?: number;  // Espaçamento de ripas em cm (Opcional, pois Fibrocimento não usa ripas)
  isFibrocement?: boolean; // Flag auxiliar para identificar lógica de fibrocimento
}

// ========================================================================
// DADOS DE ENTRADA (INPUT DO USUÁRIO)
// ========================================================================
/**
 * Representa o estado bruto do formulário preenchido pelo usuário.
 * Estes dados devem passar por sanitização antes de serem usados em cálculos matemáticos.
 */
export interface CalculatorInputs {
  width: number;           // Largura do telhado em metros
  length: number;          // Comprimento (ou Água) em metros
  slope: number;           // Inclinação em porcentagem (%)
  category: TileCategory;  // Categoria selecionada
  tileModelId: string;     // ID do modelo específico selecionado
}

// ========================================================================
// DADOS DE SAÍDA (RESULTADO DO SERVIÇO)
// ========================================================================
/**
 * Contrato de retorno da função 'calculateRoof'.
 * Contém os resultados matemáticos e também metadados para renderização da UI/PDF.
 */
export interface CalculationResults {
  // INTEGRIDADE E SEGURANÇA:
  // Retorna os inputs que foram REALMENTE usados no cálculo (pós-sanitização).
  // O PDF e a UI devem usar estes dados, e não o estado local do formulário, 
  // para garantir que o relatório reflita a realidade do cálculo (Fonte de Verdade).
  sanitizedInputs: {
    width: number;
    length: number;
    slope: number;
    category: TileCategory;
    modelName: string;
  };

  // RESULTADOS DE ÁREA E TELHAS
  areaTotal: number;       // Área plana (Largura x Comprimento)
  areaCorrected: number;   // Área real considerando a inclinação (ou geometria da água)
  tileCount: number;       // Quantidade final de telhas (já com margens de perda)
  
  // RESULTADOS DE ESTRUTURA (MADEIRA/METAL)
  // Usamos campos genéricos para permitir labels dinâmicos dependendo do tipo de telha.
  woodTotalLength: number; // Metragem linear total calculada
  woodLabel: string;       // Label dinâmico: "Ripas", "Vigas/Terças" ou "Caibros/Apoios"
  
  // RESULTADOS DE FIXAÇÃO
  fixationCount: number;   // Quantidade total de fixadores
  fixationLabel: string;   // Label dinâmico: "Pregos", "Parafusos" ou "Fixadores"
}
