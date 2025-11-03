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
      className={`game-card ${isSelected ? 'ring-2 ring-accent' : ''}`}
      onClick={() => onCardClick(game.id)}
    >
      {/* Header */}
      <div className="game-header">
        <span className={getStatusBadge()}>
          {getStatusText()}
        </span>
        <span className="league">
          {game.league}
        </span>
      </div>

      {/* Times */}
      <div className="teams-container">
        {/* Time da casa */}
        <div className="team-row">
          <div className="team-info">
            <div className="team-logo">
              {game.homeTeam.charAt(0)}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onTeamClick(game.homeTeam);
              }}
              className="team-name"
            >
              {game.homeTeam}
            </button>
          </div>
          <div className="score">
            {game.homeScore !== null ? game.homeScore : '-'}
          </div>
        </div>

        {/* Time visitante */}
        <div className="team-row">
          <div className="team-info">
            <div className="team-logo">
              {game.awayTeam.charAt(0)}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onTeamClick(game.awayTeam);
              }}
              className="team-name"
            >
              {game.awayTeam}
            </button>
          </div>
          <div className="score">
            {game.awayScore !== null ? game.awayScore : '-'}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      {(game.homeStats || game.awayStats) && (
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{game.homeStats?.possession || 0}%</div>
            <div className="stat-label">Posse</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{game.homeStats?.totalShots || 0}</div>
            <div className="stat-label">Chutes</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{game.homeStats?.fouls || 0}</div>
            <div className="stat-label">Faltas</div>
          </div>
        </div>
      )}

      {/* Previsão */}
      {game.prediction && (
        <div className="prediction">
          <div className="prediction-title">Previsão</div>
          <div className="prediction-grid">
            <div>
              <div className="prediction-value prediction-home">
                {game.prediction.homeWinPercentage}%
              </div>
              <div className="prediction-label">Casa</div>
            </div>
            <div>
              <div className="prediction-value prediction-draw">
                {game.prediction.drawPercentage}%
              </div>
              <div className="prediction-label">Empate</div>
            </div>
            <div>
              <div className="prediction-value prediction-away">
                {game.prediction.awayWinPercentage}%
              </div>
              <div className="prediction-label">Fora</div>
            </div>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="actions-grid">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onH2HClick(game.homeTeam, game.awayTeam);
          }}
          className="action-btn btn-h2h"
        >
          H2H
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAiAnalysisClick(game);
          }}
          className="action-btn btn-ai"
        >
          IA
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChatClick(game);
          }}
          className="action-btn btn-chat"
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default GameCard;
