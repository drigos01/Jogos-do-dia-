import React from 'react';
import { PredictionResult } from '../types';
import Modal from './Modal';

interface HitRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PredictionResult[];
}

const HitRateModal: React.FC<HitRateModalProps> = ({ isOpen, onClose, history }) => {
  const totalPredictions = history.length;
  const correctPredictions = history.filter(p => p.isHit).length;
  const hitRate = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;

  const getOutcomeText = (outcome: string) => {
    switch (outcome) {
      case 'HOME_WIN': return 'Vitória da Casa';
      case 'AWAY_WIN': return 'Vitória do Visitante';
      case 'DRAW': return 'Empate';
      default: return outcome;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'HOME_WIN': return 'text-green-400';
      case 'AWAY_WIN': return 'text-blue-400';
      case 'DRAW': return 'text-yellow-400';
      default: return 'text-text-secondary';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Taxa de Acerto das Previsões">
      <div className="space-y-6">
        {/* Estatísticas gerais */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-gray-800/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-text-primary">{totalPredictions}</div>
            <div className="text-text-secondary text-sm">Total</div>
          </div>
          <div className="text-center bg-gray-800/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{correctPredictions}</div>
            <div className="text-text-secondary text-sm">Acertos</div>
          </div>
          <div className="text-center bg-gray-800/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-accent">{hitRate.toFixed(1)}%</div>
            <div className="text-text-secondary text-sm">Taxa de Acerto</div>
          </div>
        </div>

        {/* Histórico detalhado */}
        {history.length > 0 ? (
          <div>
            <h3 className="text-text-primary font-semibold mb-3">Histórico de Previsões</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((prediction, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    prediction.isHit
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-text-primary font-medium">
                        {prediction.homeTeam} vs {prediction.awayTeam}
                      </div>
                      <div className="text-text-secondary text-sm">
                        {prediction.gameDate} • {prediction.sport}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-text-primary font-bold text-lg">
                        {prediction.homeScore} - {prediction.awayScore}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-text-secondary">Previsto: </span>
                      <span className={getOutcomeColor(prediction.predictedOutcome)}>
                        {getOutcomeText(prediction.predictedOutcome)}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-secondary">Real: </span>
                      <span className={getOutcomeColor(prediction.actualOutcome)}>
                        {getOutcomeText(prediction.actualOutcome)}
                      </span>
                    </div>
                    <div className={`font-semibold ${
                      prediction.isHit ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {prediction.isHit ? '✅ Acerto' : '❌ Erro'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-text-primary text-lg font-semibold mb-2">Nenhum dado histórico</h3>
            <p className="text-text-secondary">
              A taxa de acerto será calculada conforme as previsões forem validadas com resultados reais.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default HitRateModal;
