import React from 'react';
import { TileCategory, CalculatorInputs, TileModel } from '../types';
import { TILE_DATA } from '../constants';

interface Props {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
  onCalculate: () => void;
}

export const CalculatorForm: React.FC<Props> = ({ inputs, onChange, onCalculate }) => {
  const handleChange = (field: keyof CalculatorInputs, value: any) => {
    onChange({ ...inputs, [field]: value });
  };

  // Secure handler for numbers: enforces positive values and length limits
  const handleNumberChange = (field: keyof CalculatorInputs, rawValue: string) => {
    // 1. Prevent massive string injection (UI DoS mitigation)
    if (rawValue.length > 8) return; 

    // 2. Parse, prevent NaN, and enforce absolute value (no negatives)
    const val = parseFloat(rawValue);
    const safeValue = isNaN(val) ? 0 : Math.abs(val);
    handleChange(field, safeValue);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as TileCategory;
    // Safety check if category exists in TILE_DATA (Whitelist check)
    if (TILE_DATA[newCategory]) {
      const defaultModel = TILE_DATA[newCategory][0].id;
      onChange({
        ...inputs,
        category: newCategory,
        tileModelId: defaultModel,
      });
    }
  };

  const currentModels = TILE_DATA[inputs.category];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-brand-red">
      <h2 className="text-2xl font-bold text-brand-red mb-6 flex items-center gap-2">
        <span className="text-3xl">🏠</span> Dados do Telhado
      </h2>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Largura (m)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              maxLength={6}
              value={inputs.width || ''} // Handle 0 as empty string if desired
              onChange={(e) => handleNumberChange('width', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition"
              placeholder="Ex: 10.0"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Comprimento (m)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              maxLength={6}
              value={inputs.length || ''}
              onChange={(e) => handleNumberChange('length', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition"
              placeholder="Ex: 8.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Inclinação (%)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              maxLength={3}
              value={inputs.slope}
              onChange={(e) => handleNumberChange('slope', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none transition"
              placeholder="Ex: 30"
            />
            <span className="absolute right-4 top-3 text-gray-400 font-bold">%</span>
          </div>
        </div>

        <div className="h-px bg-gray-200 my-4"></div>

        <div>
          <label className="block text-sm font-bold text-brand-red mb-1">Tipo de Telha</label>
          <select
            value={inputs.category}
            onChange={handleCategoryChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-yellow outline-none bg-gray-50 cursor-pointer"
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
                {model.name} {model.yieldPerSqm > 0 ? `(${model.yieldPerSqm} telhas/m²)` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="h-px bg-gray-200 my-4"></div>
        
        <button
          onClick={onCalculate}
          className="w-full mt-2 bg-brand-red hover:bg-[#4a0f02] text-white font-extrabold text-lg py-4 rounded-md shadow-lg transform hover:-translate-y-1 transition duration-200"
        >
          CALCULAR AGORA
        </button>
      </div>
    </div>
  );
};