import React from 'react';
import { Bet, PredictedOutcome } from '../types';
import Modal from './Modal';

interface BetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: Bet[];
  balance: number;
}

const outcomeToString = (outcome: PredictedOutcome, gameDetails: Bet['gameDetails']) => {
    switch (outcome) {
        case 'HOME_WIN': return `Vitória ${gameDetails.homeTeam}`;
        case 'AWAY_WIN': return `Vitória ${gameDetails.awayTeam}`;
        case 'DRAW': return 'Empate';
    }
}

const BetStatusBadge: React.FC<{status: Bet['status']}> = ({ status }) => {
    const baseClasses = "font-bold text-xs px-3 py-1 rounded-full";
    if (status === 'WON') return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>GANHOU</span>
    if (status === 'LOST') return <span className={`${baseClasses} bg-red-500/20 text-red-400`}>PERDEU</span>
    return <span className={`${baseClasses} bg-yellow-500/20 text-yellow-400`}>PENDENTE</span>
}

const BetHistoryModal: React.FC<BetHistoryModalProps> = ({ isOpen, onClose, history, balance }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Minhas Apostas">
            <div className="space-y-6">
                <div className="bg-brand-bg/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-text-secondary">Seu Saldo Atual</p>
                    <p className="text-4xl font-bold text-accent">${balance.toFixed(2)}</p>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-text-primary mb-3">Histórico de Apostas</h3>
                    <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
                        {history.length > 0 ? (
                            history.map(bet => (
                                <div key={bet.id} className="bg-brand-bg/50 p-3 rounded-lg text-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 font-bold flex-wrap">
                                                <img src={bet.gameDetails.homeLogo ?? 'https://via.placeholder.com/24?text=?'} alt={bet.gameDetails.homeTeam} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/24?text=?'; }}/>
                                                <span className="truncate">{bet.gameDetails.homeTeam}</span>
                                                <span className="text-text-secondary">vs</span>
                                                <span className="truncate">{bet.gameDetails.awayTeam}</span>
                                                <img src={bet.gameDetails.awayLogo ?? 'https://via.placeholder.com/24?text=?'} alt={bet.gameDetails.awayTeam} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/24?text=?'; }}/>
                                            </div>
                                            <p className="text-xs text-text-secondary mt-1">{bet.gameDetails.sport} - {new Date(bet.gameDetails.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex-shrink-0 ml-2">
                                            <BetStatusBadge status={bet.status} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 bg-black/20 p-2 rounded-md">
                                        <div>
                                            <p><span className="font-semibold text-text-secondary">Sua Aposta:</span> {outcomeToString(bet.betOn, bet.gameDetails)}</p>
                                            <p><span className="font-semibold text-text-secondary">Valor:</span> ${bet.amount.toFixed(2)} @ {bet.odds.toFixed(2)}</p>
                                            {(bet.status === 'WON' || bet.status === 'LOST') && bet.finalHomeScore !== null && bet.finalAwayScore !== null && (
                                                <p className="text-xs mt-1"><span className="font-semibold text-text-secondary">Placar Final:</span> {bet.finalHomeScore} - {bet.finalAwayScore}</p>
                                            )}
                                        </div>
                                        <div className="text-left md:text-right">
                                            {bet.status === 'WON' && <p className="font-bold text-green-400">+${bet.potentialWinnings.toFixed(2)}</p>}
                                            {bet.status === 'LOST' && <p className="font-bold text-red-400">-${bet.amount.toFixed(2)}</p>}
                                            {bet.status === 'PENDING' && <p className="font-semibold text-text-secondary">Ganhos: ${bet.potentialWinnings.toFixed(2)}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-text-secondary py-10">
                                <p>Você ainda não fez nenhuma aposta.</p>
                                <p className="text-xs mt-1">Encontre um jogo e faça sua primeira aposta!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BetHistoryModal;