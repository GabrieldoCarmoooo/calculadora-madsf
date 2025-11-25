import React from 'react';
import { CalculationResults } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, Share2 } from 'lucide-react';

interface Props {
  results: CalculationResults | null;
  // We no longer rely on 'inputs' prop for display to ensure integrity. 
  // We use results.sanitizedInputs returned from the trusted service.
}

export const ResultsDisplay: React.FC<Props> = ({ results }) => {

  const generatePDF = () => {
    if (!results) return;

    const doc = new jsPDF();
    
    // Trusted data source
    const data = results.sanitizedInputs;

    // Header
    doc.setFillColor(92, 19, 2); // brand-red
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Relatório de Materiais - Calculadora MADSF", 105, 20, { align: 'center' });

    // Inputs Summary (Using Sanitized Data)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 45);
    
    autoTable(doc, {
      startY: 50,
      head: [['Parâmetro', 'Valor']],
      body: [
        ['Dimensões', `${data.width}m x ${data.length}m`],
        ['Inclinação', `${data.slope}%`],
        ['Tipo de Telha', `${data.category} - ${data.modelName}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [92, 19, 2] },
    });

    // Results
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    autoTable(doc, {
      startY: finalY,
      head: [['Material', 'Quantidade', 'Detalhes']],
      body: [
        ['Área de Telhado', `${results.areaCorrected.toFixed(2)} m²`, `Corrigida com ${data.slope}% de inclinação`],
        ['Telhas', `${results.tileCount} un`, `Baseado no modelo ${data.modelName}`],
        [results.woodLabel, `${results.woodTotalLength.toFixed(2)} metros`, 'Total linear estimado'],
        [results.fixationLabel, `${results.fixationCount} un`, `Quantidade estimada`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [255, 203, 0], textColor: [0,0,0] }, // brand-yellow
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Gerado por Calculadora MADSF", 105, 290, { align: 'center' });

    doc.save('orcamento-telhado.pdf');
  };

  if (!results) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <div className="bg-brand-yellow/10 p-6 rounded-full mb-4">
          <Share2 className="w-12 h-12 text-brand-yellow" />
        </div>
        <h3 className="text-xl font-bold text-gray-700">Aguardando Dados</h3>
        <p className="text-gray-500 mt-2">Preencha o formulário ao lado e clique em Calcular para ver o resultado detalhado.</p>
      </div>
    );
  }

  // Use sanitized inputs for display as well
  const { category, modelName } = results.sanitizedInputs;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-brand-red p-6 border-b border-brand-red/10">
          <h3 className="text-white font-bold text-2xl">{category}</h3>
          <p className="text-brand-yellow font-medium text-lg">{modelName}</p>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-brand-red mb-4 border-b pb-2">Resultado do Cálculo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
            
            {/* Area */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-blue-800 font-semibold uppercase tracking-wider">Área Corrigida</p>
              <p className="text-3xl font-extrabold text-blue-900">{results.areaCorrected.toFixed(2)} <span className="text-lg">m²</span></p>
              <p className="text-xs text-blue-600 mt-1">Base: {results.areaTotal.toFixed(2)}m²</p>
            </div>

            {/* Tiles */}
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-brand-red">
              <p className="text-sm text-brand-red font-semibold uppercase tracking-wider">Qtde. Telhas</p>
              <p className="text-3xl font-extrabold text-[#5c1302]">{results.tileCount}</p>
              <p className="text-xs text-[#5c1302]/70 mt-1">unidades</p>
            </div>

            {/* Structure (Ripas/Vigas) */}
            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-sm text-amber-800 font-semibold uppercase tracking-wider">{results.woodLabel}</p>
                   {results.woodTotalLength > 0 ? (
                    <>
                      <p className="text-3xl font-extrabold text-amber-900">{results.woodTotalLength.toFixed(1)} <span className="text-lg">m</span></p>
                      <p className="text-xs text-amber-700 mt-1">Estimativa linear</p>
                    </>
                   ) : (
                     <p className="text-lg font-bold text-amber-900 mt-2">Não se aplica</p>
                   )}
                </div>
              </div>
            </div>

             {/* Fixation (Pregos/Parafusos) */}
             <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-gray-500">
              <p className="text-sm text-gray-700 font-semibold uppercase tracking-wider">{results.fixationLabel}</p>
              <p className="text-3xl font-extrabold text-gray-900">{results.fixationCount}</p>
              <p className="text-xs text-gray-600 mt-1">Quantidade estimada</p>
            </div>
            
          </div>

          <button
            onClick={generatePDF}
            className="w-full mt-8 bg-brand-yellow hover:bg-yellow-400 text-brand-black font-bold py-3 rounded flex items-center justify-center gap-2 transition shadow-md"
          >
            <Download size={20} />
            Baixar PDF
          </button>
        </div>
      </div>
    </div>
  );
};
