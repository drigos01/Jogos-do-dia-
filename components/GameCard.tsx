import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  isSelected: boolean;
  onCardClick: (gameId: string) => void;
  onTeamClick: (teamName: string) => void;
  onH2HClick: (homeTeam: string, awayTeam: string) => void;
  onAiAnalysisClick: (game: Game) => void;
  onChatClick: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  isSelected,
  onCardClick,
  onTeamClick,
  onH2HClick,
  onAiAnalysisClick,
  onChatClick
}) => {
  const getStatusBadge = () => {
    const baseClasses = "status-badge";
    switch (game.status) {
      case 'LIVE':
        return `${baseClasses} status-live`;
      case 'SCHEDULED':
        return `${baseClasses} status-scheduled`;
      case 'FINISHED':
        return `${baseClasses} status-finished`;
      case 'POSTPONED':
        return `${baseClasses} status-postponed`;
      default:
        return `${baseClasses} status-scheduled`;
    }
  };

  const getStatusText = () => {
    switch (game.status) {
      case 'LIVE':
        return `⚽ ${game.elapsedTime || 0}'`;
      case 'SCHEDULED':
        return '⏰ ' + game.time;
      case 'FINISHED':
        return '✅ Final';
      case 'POSTPONED':
        return '⏸ Adiado';
      default:
        return game.time;
    }
  };

  return (
    <div 
      className={`game-card bg-card-bg rounded-xl p-4 cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-accent' : 'hover:ring-1 hover:ring-accent/50'
      }`}
      onClick={() => onCardClick(game.id)}
    >
      {/* Header com status e liga */}
      <div className="flex justify-between items-center mb-3">
        <span className={getStatusBadge()}>
          {getStatusText()}
        </span>
        <span className="text-text-secondary text-sm font-medium">
          {game.league}
        </span>
      </div>

      {/* Times e placar */}
      <div className="space-y-3">
        {/* Time da casa */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
              {game.homeTeam.charAt(0)}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onTeamClick(game.homeTeam);
              }}
              className="text-text-primary font-semibold hover:text-accent transition-colors text-left"
            >
              {game.homeTeam}
            </button>
          </div>
          <div className="text-text-primary font-bold text-lg">
            {game.homeScore !== null ? game.homeScore : '-'}
          </div>
        </div>

        {/* Time visitante */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
              {game.awayTeam.charAt(0)}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onTeamClick(game.awayTeam);
              }}
              className="text-text-primary font-semibold hover:text-accent transition-colors text-left"
            >
              {game.awayTeam}
            </button>
          </div>
          <div className="text-text-primary font-bold text-lg">
            {game.awayScore !== null ? game.awayScore : '-'}
          </div>
        </div>
      </div>

      {/* Estatísticas rápidas (se disponíveis) */}
      {(game.homeStats || game.awayStats) && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-text-secondary">
          <div className="text-center">
            <div>Posse</div>
            <div className="text-text-primary font-semibold">
              {game.homeStats?.possession || 0}%
            </div>
          </div>
          <div className="text-center">
            <div>Chutes</div>
            <div className="text-text-primary font-semibold">
              {game.homeStats?.totalShots || 0}
            </div>
          </div>
          <div className="text-center">
            <div>Faltas</div>
            <div className="text-text-primary font-semibold">
              {game.homeStats?.fouls || 0}
            </div>
          </div>
        </div>
      )}

      {/* Previsão (se disponível) */}
      {game.prediction && (
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
          <div className="text-xs text-text-secondary mb-2">Previsão</div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-green-400 font-semibold">
                {game.prediction.homeWinPercentage}%
              </div>
              <div className="text-text-secondary">Casa</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-semibold">
                {game.prediction.drawPercentage}%
              </div>
              <div className="text-text-secondary">Empate</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-semibold">
                {game.prediction.awayWinPercentage}%
              </div>
              <div className="text-text-secondary">Fora</div>
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="mt-4 flex justify-between space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onH2HClick(game.homeTeam, game.awayTeam);
          }}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-text-secondary hover:text-text-primary text-xs py-2 px-3 rounded transition-colors"
        >
          H2H
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAiAnalysisClick(game);
          }}
          className="flex-1 bg-accent hover:bg-accent-hover text-white text-xs py-2 px-3 rounded transition-colors"
        >
          IA
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChatClick(game);
          }}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default GameCard;
