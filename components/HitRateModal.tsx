
import React from 'react';
import { PredictionResult } from '../types';
import Modal from './Modal';

interface HitRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PredictionResult[];
}

const outcomeToString = (outcome: 'HOME_WIN' | 'AWAY_WIN' | 'DRAW', homeTeam: string, awayTeam: string) => {
    switch (outcome) {
        case 'HOME_WIN': return `Vitória ${homeTeam}`;
        case 'AWAY_WIN': return `Vitória ${awayTeam}`;
        case 'DRAW': return 'Empate';
    }
}

const HitRateModal: React.FC<HitRateModalProps> = ({ isOpen, onClose, history }) => {
    const totalPredictions = history.length;
    const totalHits = history.filter(p => p.isHit).length;
    const hitRate = totalPredictions > 0 ? ((totalHits / totalPredictions) * 100).toFixed(1) : '0.0';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Histórico e Taxa de Acerto das Previsões">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-brand-bg/50 p-4 rounded-lg">
                        <p className="text-sm text-text-secondary">Total de Previsões</p>
                        <p className="text-3xl font-bold text-text-primary">{totalPredictions}</p>
                    </div>
                     <div className="bg-brand-bg/50 p-4 rounded-lg">
                        <p className="text-sm text-text-secondary">Acertos</p>
                        <p className="text-3xl font-bold text-green-400">{totalHits}</p>
                    </div>
                     <div className="bg-brand-bg/50 p-4 rounded-lg">
                        <p className="text-sm text-text-secondary">Taxa de Acerto</p>
                        <p className="text-3xl font-bold text-accent">{hitRate}%</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-text-primary mb-3">Histórico de Previsões</h3>
                    <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                        {history.length > 0 ? (
                            history.map(result => (
                                <div key={result.gameId} className="bg-brand-bg/50 p-3 rounded-lg text-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-bold">{result.homeTeam} vs {result.awayTeam}</p>
                                        <p className="text-xs text-text-secondary">{new Date(result.gameDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 bg-black/20 p-2 rounded-md">
                                        <div>
                                            <p><span className="font-semibold text-text-secondary">Resultado Final:</span> {result.homeScore} - {result.awayScore}</p>
                                            <p><span className="font-semibold text-text-secondary">Previsão da IA:</span> {outcomeToString(result.predictedOutcome, result.homeTeam, result.awayTeam)}</p>
                                        </div>
                                        {result.isHit ? (
                                            <span className="font-bold text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">ACERTOU</span>
                                        ) : (
                                            <span className="font-bold text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full">ERROU</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-text-secondary py-10">
                                <p>Nenhuma previsão foi registrada ainda.</p>
                                <p className="text-xs mt-1">As previsões aparecerão aqui após o término dos jogos.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default HitRateModal;
