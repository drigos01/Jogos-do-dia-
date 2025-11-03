import React from 'react';
import { Game, AiAnalysisResponse } from '../types';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import PieChart from './PieChart';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game;
  onRunAnalysis: (type: 'quick' | 'deep') => void;
  isLoading: boolean;
  error: string | null;
  analysisResult: AiAnalysisResponse | null;
}

const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  game,
  onRunAnalysis,
  isLoading,
  error,
  analysisResult,
}) => {
  const modalTitle = `Análise IA: ${game.homeTeam} vs ${game.awayTeam}`;

  const renderAnalysisResult = (result: AiAnalysisResponse) => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <PieChart percentage={result.confidence} />
            <div className="flex-1">
                <p className="text-sm font-bold text-accent uppercase">Previsão da IA</p>
                <h3 className="text-3xl md:text-4xl font-bold text-text-primary mt-1">{result.predictedWinner}</h3>
                <p className="text-text-secondary mt-2">Com {result.confidence}% de confiança na análise.</p>
            </div>
        </div>

        <div>
            <h4 className="font-bold text-text-primary mb-2">Fatores Chave</h4>
            <ul className="list-disc list-inside space-y-1 text-text-secondary text-sm">
                {result.keyFactors.map((factor, index) => <li key={index}>{factor}</li>)}
            </ul>
        </div>
        
        <div>
            <h4 className="font-bold text-text-primary mb-2">Análise Detalhada</h4>
            <p className="text-text-secondary text-sm bg-brand-bg/50 p-3 rounded-md leading-relaxed">{result.detailedAnalysis}</p>
        </div>

        {result.sources && result.sources.length > 0 && (
            <div>
                <h4 className="font-bold text-text-primary mb-2">Fontes de Dados</h4>
                <ul className="space-y-1 text-sm">
                    {result.sources.map((source, index) => (
                        <li key={index}>
                            <a href={source} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate block">
                                {source}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );

  const renderInitialState = () => (
    <div className="text-center min-h-[250px] flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold text-text-primary">Selecione o tipo de análise</h3>
      <p className="text-text-secondary mt-1 text-sm max-w-sm mx-auto">
          A análise profunda busca mais dados em tempo real e pode levar mais tempo para ser concluída.
      </p>
    </div>
  );
  
  const renderLoading = () => (
    <div className="min-h-[250px] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-semibold text-text-primary">A IA está analisando a partida...</h3>
        <p className="text-text-secondary mt-1 text-sm">Isso pode levar um momento, especialmente na análise profunda.</p>
    </div>
  );

  const renderError = () => (
    <div className="min-h-[250px] flex flex-col items-center justify-center text-center text-red-400 p-4">
        <p className="font-semibold">Ocorreu um erro na análise:</p>
        <p className="text-sm mt-1">{error}</p>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return renderLoading();
    if (error) return renderError();
    if (analysisResult) return renderAnalysisResult(analysisResult);
    return renderInitialState();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <div className="flex flex-col space-y-4">
        <div className="p-1">{renderContent()}</div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
          <button
            onClick={() => onRunAnalysis('quick')}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Análise Rápida
          </button>
          <button
            onClick={() => onRunAnalysis('deep')}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Análise Profunda
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AiAnalysisModal;