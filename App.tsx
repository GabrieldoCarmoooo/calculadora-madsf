import React, { useState } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { CalculatorInputs, CalculationResults, TileCategory, TileModel } from './types';
import { calculateRoof } from './services/calculationService';
import { TILE_DATA } from './constants';

const App: React.FC = () => {
  // Default Initial State
  const initialCategory = TileCategory.CERAMICA;
  const initialModel = TILE_DATA[initialCategory][0].id;

  const [inputs, setInputs] = useState<CalculatorInputs>({
    width: 0,
    length: 0,
    slope: 30, // Default slope
    category: initialCategory,
    tileModelId: initialModel,
  });

  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleCalculate = () => {
    // Basic validation
    if (inputs.width <= 0 || inputs.length <= 0) {
      alert("Por favor, informe a largura e o comprimento do telhado.");
      return;
    }
    const res = calculateRoof(inputs);
    setResults(res);
    
    // Smooth scroll to results on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5">
            <CalculatorForm 
              inputs={inputs} 
              onChange={setInputs} 
              onCalculate={handleCalculate} 
            />
          </div>

          {/* Right Column: Results */}
          <div id="results-section" className="lg:col-span-7">
            <ResultsDisplay 
              results={results}
              inputs={inputs}
            />
          </div>

        </div>
      </main>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Calculadora MADSF. Todos os direitos reservados.</p>
          <p className="mt-2 text-gray-600">Os cálculos são estimativas. Consulte sempre um engenheiro ou profissional especializado antes de comprar materiais.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;