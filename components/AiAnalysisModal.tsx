import React from 'react';
import { Game, AiAnalysisResponse } from '../types';
import Modal from './Modal';

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
  analysisResult
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Análise de IA">
      <div className="space-y-6">
        {/* Informações do jogo */}
        <div className="bg-gray-800/30 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="text-text-primary font-semibold">{game.homeTeam}</div>
              <div className="text-text-secondary text-sm">Casa</div>
            </div>
            <div className="text-text-primary font-bold text-xl mx-4">VS</div>
            <div className="text-center flex-1">
              <div className="text-text-primary font-semibold">{game.awayTeam}</div>
              <div className="text-text-secondary text-sm">Fora</div>
            </div>
          </div>
          <div className="text-center mt-2 text-text-secondary text-sm">
            {game.league} • {game.date} • {game.time}
          </div>
        </div>

        {/* Botões de análise */}
        {!analysisResult && (
          <div className="flex space-x-4">
            <button
              onClick={() => onRunAnalysis('quick')}
              disabled={isLoading}
              className="flex-1 bg-accent hover:bg-accent-hover text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              ⚡ Análise Rápida
            </button>
            <button
              onClick={() => onRunAnalysis('deep')}
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              🔍 Análise Detalhada
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-text-secondary">Analisando o jogo com IA...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="text-red-400 font-semibold mb-2">Erro na análise</div>
            <p className="text-text-secondary">{error}</p>
            <button
              onClick={() => onRunAnalysis('quick')}
              className="mt-3 bg-accent hover:bg-accent-hover text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Resultado da análise */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Vencedor previsto */}
            <div className="bg-gradient-to-r from-accent/20 to-purple-600/20 rounded-lg p-6 text-center">
              <div className="text-text-secondary text-sm mb-2">Vencedor Previsto</div>
              <div className="text-2xl font-bold text-text-primary mb-2">
                {analysisResult.predictedWinner}
              </div>
              <div className="text-accent font-semibold">
                Confiança: {analysisResult.confidence}%
              </div>
            </div>

            {/* Probabilidades */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center bg-gray-800/30 rounded-lg p-4">
                <div className="text-green-400 text-2xl font-bold">
                  {analysisResult.probabilities.home}%
                </div>
                <div className="text-text-secondary text-sm">Casa</div>
              </div>
              <div className="text-center bg-gray-800/30 rounded-lg p-4">
                <div className="text-yellow-400 text-2xl font-bold">
                  {analysisResult.probabilities.draw}%
                </div>
                <div className="text-text-secondary text-sm">Empate</div>
              </div>
              <div className="text-center bg-gray-800/30 rounded-lg p-4">
                <div className="text-blue-400 text-2xl font-bold">
                  {analysisResult.probabilities.away}%
                </div>
                <div className="text-text-secondary text-sm">Fora</div>
              </div>
            </div>

            {/* Fatores-chave */}
            <div>
              <h3 className="text-text-primary font-semibold mb-3">Fatores Decisivos</h3>
              <ul className="space-y-2">
                {analysisResult.keyFactors.map((factor, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-accent mt-1">•</span>
                    <span className="text-text-secondary">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Análise detalhada */}
            <div>
              <h3 className="text-text-primary font-semibold mb-3">Análise Detalhada</h3>
              <p className="text-text-secondary leading-relaxed">
                {analysisResult.detailedAnalysis}
              </p>
            </div>

            {/* Fontes */}
            <div>
              <h3 className="text-text-primary font-semibold mb-3">Fontes</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.sources.map((source, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-text-secondary text-sm px-3 py-1 rounded-full"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onRunAnalysis('deep')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              🔍 Fazer Análise Mais Detalhada
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AiAnalysisModal;
