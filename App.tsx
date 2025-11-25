import React, { useState } from 'react';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { CalculatorInputs, CalculationResults, TileCategory } from './types';
import { calculateRoof } from './services/calculationService';
import { TILE_DATA } from './constants';
import { AlertTriangle } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null); // Clear previous errors

    // 1. Basic UI Validation
    if (inputs.width <= 0 || inputs.length <= 0) {
      setError("Por favor, informe valores válidos para largura e comprimento.");
      return;
    }

    try {
      // 2. Safe Execution
      const res = calculateRoof(inputs);
      setResults(res);
      
      // Smooth scroll to results on mobile
      if (window.innerWidth < 768) {
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      // 3. Secure Error Handling (No stack trace exposure to user)
      console.error("Calculation Error:", err); // Log for developer
      setError("Ocorreu um erro inesperado ao realizar o cálculo. Verifique os dados inseridos.");
      setResults(null);
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
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm flex items-center gap-3">
                <AlertTriangle className="text-red-500" />
                <div>
                  <h3 className="text-red-800 font-bold text-sm">Atenção</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}
            
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