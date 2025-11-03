import React from 'react';
import { PastGame } from '../types';

interface HistoryViewProps {
  isLoading: boolean;
  error: string | null;
  data: PastGame[] | null;
}

const HistoryView: React.FC<HistoryViewProps> = ({ isLoading, error, data }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        <span className="ml-3 text-text-secondary">Carregando histórico...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 text-4xl mb-4">⚠️</div>
        <h3 className="text-text-primary text-lg font-semibold mb-2">Erro</h3>
        <p className="text-text-secondary">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-text-primary text-lg font-semibold mb-2">Nenhum dado histórico</h3>
        <p className="text-text-secondary">Não foram encontrados jogos anteriores.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((game, index) => (
        <div key={index} className="bg-gray-800/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-secondary text-sm">{game.date}</span>
            <span className="text-text-secondary text-sm">{game.league}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                {game.homeTeam.charAt(0)}
              </div>
              <span className="text-text-primary font-medium">{game.homeTeam}</span>
            </div>
            
            <div className="mx-4">
              <span className="bg-gray-700 px-3 py-1 rounded-md font-bold text-text-primary">
                {game.homeScore} - {game.awayScore}
              </span>
            </div>
            
            <div className="flex items-center space-x-3 flex-1 justify-end">
              <span className="text-text-primary font-medium">{game.awayTeam}</span>
              <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                {game.awayTeam.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryView;
