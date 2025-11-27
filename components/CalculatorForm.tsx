import React from 'react';
import { TileCategory, CalculatorInputs, TileModel } from '../types';
import { TILE_DATA } from '../constants';
import { percentageToDegrees } from '../services/calculationService';
import { Calculator, ArrowRight, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
  onCalculate: () => void;
}

export const CalculatorForm: React.FC<Props> = ({ inputs, onChange, onCalculate }) => {
  
  const handleChange = (field: keyof CalculatorInputs, value: any) => {
    // Basic type conversion for numeric fields
    let finalValue = value;
    if (field === 'width' || field === 'length' || field === 'slope') {
      finalValue = parseFloat(value) || 0;
    }
    
    // Logic to reset model when category changes
    if (field === 'category') {
       const newCategoryModels = TILE_DATA[value as TileCategory];
       if (newCategoryModels && newCategoryModels.length > 0) {
         onChange({
            ...inputs,
            [field]: value,
            tileModelId: newCategoryModels[0].id,
            // Regra automática: Define 15% como padrão seguro para Fibrocimento ao trocar a categoria
            slope: value === TileCategory.FIBROCIMENTO ? 15 : inputs.slope
         });
         return;
       }
    }

    onChange({ ...inputs, [field]: finalValue });
  };

  // Obtém a lista de modelos baseada na categoria atual para preencher o select
  const currentModels = TILE_DATA[inputs.category] || [];

  // Converte a porcentagem atual para graus para exibição
  const degrees = percentageToDegrees(inputs.slope).toFixed(1);

  // Função auxiliar para gerar dicas de Fibrocimento (Base Infibra)
  const getFibroSlopeFeedback = (slope: number) => {
    // 1. Limite Máximo Superior (> 75° ou > 373%)
    if (slope > 373) {
      return {
        type: 'danger',
        message: 'Alerta: Inclinação máxima permitida de 75° (373%). Para inclinações mais íngremes, consulte o departamento técnico da Infibra.',
        icon: AlertTriangle,
        colorClass: 'text-red-700 bg-red-50 border-red-200'
      };
    }

    // 2. Limite Mínimo Inferior (< 5° ou < 9%)
    if (slope < 9) {
      return {
        type: 'danger',
        message: 'Alerta: Abaixo do mínimo permitido (aprox. 5°). Risco de retorno de água.',
        icon: AlertTriangle,
        colorClass: 'text-red-700 bg-red-50 border-red-200'
      };
    }

    // 3. Faixa de Baixa Inclinação (5° a 15°)
    if (slope >= 9 && slope < 27) {
       const isNear10Deg = Math.abs(slope - 17.6) < 2;
       return {
        type: 'info',
        message: isNear10Deg 
          ? 'Equivalente a ~10°. Inclinação mínima recomendada para telhas de 5mm.' 
          : 'Inclinação média. Atenção ao recobrimento longitudinal (veja abaixo).',
        icon: Info,
        colorClass: 'text-blue-700 bg-blue-50 border-blue-200'
      };
    }

    // 4. Faixa Padrão/Ideal (15° a 75°)
    return {
      type: 'success',
      message: 'Ótima inclinação (>15°). Menor consumo de telhas devido ao recobrimento menor (14cm).',
      icon: CheckCircle,
      colorClass: 'text-green-700 bg-green-50 border-green-200'
    };
  };

  const slopeFeedback = inputs.category === TileCategory.FIBROCIMENTO 
    ? getFibroSlopeFeedback(inputs.slope) 
    : null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-brand-red">
      <div className="flex items-center gap-2 mb-6 text-brand-red">
        <Calculator className="w-6 h-6" />
        <h2 className="text-xl font-bold">Dados do Telhado</h2>
      </div>

      <div className="space-y-4">
        
        {/* Dimensions Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Largura (m)</label>
            <input
              type="number"
              maxLength={6} // Security: Prevent buffer overflow attacks via UI
              value={inputs.width || ''}
              onChange={(e) => {
                // Security: Prevent negative signs and limit length
                if (e.target.value.length <= 6) {
                   handleChange('width', Math.abs(parseFloat(e.target.value) || 0));
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-yellow outline-none transition"
              placeholder="Ex: 8.5"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Comprimento (m)</label>
            <input
              type="number"
              maxLength={6}
              value={inputs.length || ''}
              onChange={(e) => {
                if (e.target.value.length <= 6) {
                  handleChange('length', Math.abs(parseFloat(e.target.value) || 0));
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-yellow outline-none transition"
              placeholder="Ex: 12.0"
            />
          </div>
        </div>

        {/* Slope Row - HIDDEN FOR ECOLOGICA */}
        {inputs.category !== TileCategory.ECOLOGICA && (
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-bold text-gray-700">
                Inclinação (%)
              </label>
              {/* Tooltip Educativo */}
              <span className="text-[10px] text-gray-400 font-medium">
                {inputs.slope}% = {inputs.slope}cm de altura a cada metro
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={Math.min(inputs.slope, 100)} // Slider visual cap at 100 for UX, but input allows more
                onChange={(e) => handleChange('slope', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-red"
              />
              <div className="flex flex-col items-center min-w-[90px]">
                {/* Input manual permite valores > 100% (ex: 373%) */}
                <input 
                  type="number"
                  value={inputs.slope}
                  onChange={(e) => handleChange('slope', e.target.value)}
                  className="w-20 font-mono font-bold text-lg text-gray-800 text-center border-b border-gray-300 focus:border-brand-red outline-none"
                />
                <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-1 rounded mt-1">
                  ≈ {degrees}°
                </span>
              </div>
            </div>

            {/* FEEDBACK DINÂMICO PARA FIBROCIMENTO */}
            {inputs.category === TileCategory.FIBROCIMENTO && slopeFeedback && (
              <div className={`mt-2 p-2 rounded-md border flex items-start gap-2 animate-fade-in ${slopeFeedback.colorClass}`}>
                 <slopeFeedback.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                 <p className="text-xs font-semibold leading-tight">{slopeFeedback.message}</p>
              </div>
            )}
            
            {/* OBSERVATION: CERAMICA (RECOMMENDATION) */}
            {inputs.category === TileCategory.CERAMICA && (
              <div className="mt-3 bg-orange-50 border border-orange-100 rounded-md p-3 text-xs text-orange-800 animate-fade-in">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-600" />
                  <div>
                    <p className="font-bold mb-1">Recomendação Técnica:</p>
                    <p className="leading-relaxed">
                      Para telhas cerâmicas, recomenda-se uma inclinação <strong>mínima de 30%</strong> para garantir a estanqueidade e evitar retorno de água.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* OBSERVATION: CONCRETO (RECOMMENDATION) */}
            {inputs.category === TileCategory.CONCRETO && (
              <div className="mt-3 bg-gray-100 border border-gray-300 rounded-md p-3 text-xs text-gray-800 animate-fade-in">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-600" />
                  <div>
                    <p className="font-bold mb-1">Recomendação Técnica:</p>
                    <p className="leading-relaxed">
                      Para telhas de concreto, recomenda-se uma inclinação <strong>mínima de 30%</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* OBSERVATION: ESMALTADA (RECOMMENDATION) */}
            {inputs.category === TileCategory.ESMALTADA && (
              <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-md p-3 text-xs text-indigo-800 animate-fade-in">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" />
                  <div>
                    <p className="font-bold mb-1">Recomendação Técnica:</p>
                    <p className="leading-relaxed">
                      Para telhas esmaltadas, recomenda-se uma inclinação <strong>mínima de 30%</strong> para garantir o escoamento e vedação.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* OBSERVATION: FIBROCIMENTO (Only shown if category is Fibrocimento AND slope section is visible) */}
            {/* Nota: Este bloco complementa o feedback dinâmico acima com as regras estáticas de recobrimento */}
            {inputs.category === TileCategory.FIBROCIMENTO && (
              <div className="mt-3 bg-cyan-50 border border-cyan-100 rounded-md p-3 text-xs text-cyan-800 animate-fade-in">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-600" />
                  <div>
                    <p className="font-bold mb-1">Regras de Recobrimento:</p>
                    <ul className="list-disc pl-4 space-y-1 text-cyan-700 leading-relaxed">
                      <li>Inclinação <strong>{'>='} 15° (27%)</strong>: Recobrimento de <strong>14cm</strong>.</li>
                      <li>Inclinação <strong>{'<'} 15°</strong>: Recobrimento sobe para <strong>20cm</strong>.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-px bg-gray-200 my-4"></div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Telha</label>
          <select
            value={inputs.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-yellow outline-none bg-white cursor-pointer"
          >
            {Object.values(TileCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Modelo / Medida</label>
          <select
            value={inputs.tileModelId}
            onChange={(e) => handleChange('tileModelId', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-yellow outline-none bg-gray-50 cursor-pointer"
          >
            {currentModels.map((model: TileModel) => (
              <option key={model.id} value={model.id}>
                {model.name} {
                  model.isFibrocement 
                    ? `(${model.yieldPerSqm} m² útil)` // Exibe área útil para Fibrocimento
                    : model.yieldPerSqm > 0 
                      ? `(${model.yieldPerSqm} telhas/m²)` // Exibe rendimento padrão para outras
                      : ''
                }
              </option>
            ))}
          </select>
        </div>

        {/* ================================================================================== */}
        {/* BLOCOS DE OBSERVAÇÃO CONDICIONAL POR CATEGORIA                                     */}
        {/* ================================================================================== */}

        {/* OBSERVATION: ECOLOGICA */}
        {inputs.category === TileCategory.ECOLOGICA && (
          <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-3 text-xs text-green-800 animate-fade-in">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
              <div>
                <p className="font-bold mb-1">Metodologia de Cálculo (Onduline):</p>
                <ul className="list-disc pl-4 space-y-1 text-green-700 leading-relaxed">
                  <li><strong>Montagem:</strong> Cálculo por Grade (Fileiras x Colunas).</li>
                  <li><strong>Sobreposição:</strong> Lateral (1 onda) e Longitudinal (16cm).</li>
                  <li><strong>Apoios:</strong> Espaçamento rigoroso de <strong>46cm</strong> entre eixos.</li>
                  <li><strong>Fixação:</strong> 18 fixadores por telha.</li>
                </ul>
                <p className="mt-2 text-[10px] text-green-600 font-medium italic">
                  *A inclinação mínima de 27% já é considerada no padrão.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* OBSERVATION: FIBROCIMENTO (METHODOLOGY) */}
        {inputs.category === TileCategory.FIBROCIMENTO && (
          <div className="mt-2 bg-cyan-50 border border-cyan-200 rounded-md p-3 text-xs text-cyan-800 animate-fade-in">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-cyan-600" />
              <div>
                <p className="font-bold mb-1">Metodologia Fibrocimento:</p>
                <ul className="list-disc pl-4 space-y-1 text-cyan-700 leading-relaxed">
                  <li><strong>Montagem:</strong> Cálculo por Grade (Fileiras x Colunas).</li>
                  <li><strong>Sobreposição:</strong> Lateral fixa (5cm) e Longitudinal variável.</li>
                  <li><strong>Dimensões:</strong> Considera a perda de área útil de cada peça.</li>
                  <li><strong>Estrutura:</strong> Vão máximo de apoio considerado: 1.10m.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* OBSERVATION: CERÂMICA */}
        {inputs.category === TileCategory.CERAMICA && (
          <div className="mt-2 bg-orange-50 border border-orange-200 rounded-md p-3 text-xs text-orange-800 animate-fade-in">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-orange-600" />
              <div>
                <p className="font-bold mb-1">Metodologia Cerâmica:</p>
                <ul className="list-disc pl-4 space-y-1 text-orange-700 leading-relaxed">
                  <li><strong>Área:</strong> Calcula-se a Área Corrigida pela inclinação.</li>
                  <li><strong>Telhas:</strong> Multiplica-se pelo rendimento médio (ex: 15~17 pçs/m²).</li>
                  <li><strong>Ripas:</strong> Baseado no galgamento médio de 32cm.</li>
                  <li><strong>Pregos:</strong> Estimativa de fixação das ripas nos caibros.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* OBSERVATION: CONCRETO */}
        {inputs.category === TileCategory.CONCRETO && (
          <div className="mt-2 bg-gray-100 border border-gray-300 rounded-md p-3 text-xs text-gray-800 animate-fade-in">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-600" />
              <div>
                <p className="font-bold mb-1">Metodologia Concreto:</p>
                <ul className="list-disc pl-4 space-y-1 text-gray-700 leading-relaxed">
                  <li><strong>Rendimento:</strong> Baseado em 10.4 telhas/m² (Padrão Eurotop).</li>
                  <li><strong>Área:</strong> Considera a inclinação do telhado para área real.</li>
                  <li><strong>Estrutura:</strong> Galgamento (ripas) calculado com 34cm.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* OBSERVATION: ESMALTADA */}
        {inputs.category === TileCategory.ESMALTADA && (
          <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-md p-3 text-xs text-indigo-800 animate-fade-in">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-indigo-600" />
              <div>
                <p className="font-bold mb-1">Metodologia Esmaltada:</p>
                <ul className="list-disc pl-4 space-y-1 text-indigo-700 leading-relaxed">
                  <li><strong>Cálculo:</strong> Área Inclinada x Rendimento do Modelo.</li>
                  <li><strong>Modelos:</strong> Americana (12/m²) ou Thermolev (5.5/m²).</li>
                  <li><strong>Estrutura:</strong> Galgamento (ripas) calculado com 33cm.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="h-px bg-gray-200 my-4"></div>
        
        <button
          onClick={onCalculate}
          className="w-full bg-brand-red hover:bg-red-800 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition shadow-lg transform active:scale-95"
        >
          <Calculator className="w-5 h-5" />
          Calcular Materiais
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};