
import React from 'react';
import { PastGame } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface HistoryViewProps {
  isLoading: boolean;
  error: string | null;
  data: PastGame[] | null;
}

const HistoryGameRow: React.FC<{ game: PastGame }> = ({ game }) => (
    <div className="flex items-center justify-between p-3 bg-brand-bg/50 rounded-md hover:bg-brand-bg transition-colors">
        <div className="flex items-center text-sm w-2/5">
             <img src={game.homeLogo ?? 'https://via.placeholder.com/32?text=?'} alt={game.homeTeam} className="w-6 h-6 mr-3 object-contain flex-shrink-0" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/32?text=?'; }}/>
             <span className="font-semibold truncate">{game.homeTeam}</span>
        </div>
        <div className="text-center font-bold text-lg text-text-primary">
            <span>{game.homeScore}</span>
            <span className="mx-2 text-text-secondary">-</span>
            <span>{game.awayScore}</span>
        </div>
        <div className="flex items-center text-sm w-2/5 justify-end text-right">
             <span className="font-semibold truncate">{game.awayTeam}</span>
             <img src={game.awayLogo ?? 'https://via.placeholder.com/32?text=?'} alt={game.awayTeam} className="w-6 h-6 ml-3 object-contain flex-shrink-0" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/32?text=?'; }}/>
        </div>
    </div>
);

const HistoryView: React.FC<HistoryViewProps> = ({ isLoading, error, data }) => {
  if (isLoading) {
    return <div className="min-h-[200px] flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-400 p-8 min-h-[200px] flex flex-col items-center justify-center">
        <p className="font-semibold">Erro ao buscar histórico:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
      return <div className="text-center text-text-secondary p-8 min-h-[200px] flex items-center justify-center">Nenhum jogo encontrado no histórico.</div>
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:flex justify-between text-xs text-text-secondary px-3 font-bold uppercase">
          <span>Data</span>
          <span className="text-center">Resultado</span>
          <span>Campeonato</span>
      </div>
      <div className="space-y-2">
        {data.map((game, index) => (
            <div key={index} className="border-b border-white/10 last:border-b-0 pb-2 mb-2">
                 <div className="flex justify-between items-center text-xs text-text-secondary px-3 mb-1">
                    <span>{game.date}</span>
                    <span className="hidden md:inline">{game.league}</span>
                 </div>
                 <HistoryGameRow game={game} />
                 <div className="md:hidden text-center text-xs text-text-secondary mt-1">{game.league}</div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
