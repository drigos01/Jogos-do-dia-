
import React from 'react';
import { Game, GamePrediction, GameStats } from '../types';

interface GameCardProps {
  game: Game;
  isSelected: boolean;
  onCardClick: (id: string) => void;
  onTeamClick: (teamName: string) => void;
  onH2HClick: (homeTeam: string, awayTeam: string) => void;
  onAiAnalysisClick: (game: Game) => void;
  onChatClick: (game: Game) => void;
}

const TeamDisplay: React.FC<{ name: string; logo: string; onClick: () => void; }> = ({ name, logo, onClick }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="flex flex-col items-center justify-center text-center w-2/5 p-1 rounded-md hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
    aria-label={`Ver histórico de ${name}`}
  >
    <img
      src={logo ?? 'https://via.placeholder.com/64?text=?'}
      alt={`Logo ${name}`}
      className="h-14 w-14 md:h-16 md:w-16 object-contain mb-2"
      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/64?text=?'; }}
    />
    <p className="font-semibold text-sm md:text-base text-text-primary truncate w-full">{name}</p>
  </button>
);

const ScoreDisplay: React.FC<{ game: Game; onH2HClick: () => void; }> = ({ game, onH2HClick }) => {
    const renderH2HButton = () => (
        <button
            onClick={(e) => { e.stopPropagation(); onH2HClick(); }}
            className="mt-1 text-xs font-bold bg-white/10 px-2 py-1 rounded-md text-text-secondary hover:bg-accent hover:text-white transition-colors"
            aria-label="Ver confronto direto"
        >
            H2H
        </button>
    );

    switch (game.status) {
        case 'LIVE':
            return (
                <div className="text-center flex flex-col items-center">
                    <div className="text-3xl font-bold text-text-primary">{game.homeScore ?? 0} - {game.awayScore ?? 0}</div>
                    <div className="text-sm font-bold text-accent animate-pulse">{game.time}</div>
                    {renderH2HButton()}
                </div>
            );
        case 'FINISHED':
            return (
                <div className="text-center flex flex-col items-center">
                    <div className="text-3xl font-bold text-text-primary">{game.homeScore ?? 0} - {game.awayScore ?? 0}</div>
                    <div className="text-xs text-text-secondary">Encerrado</div>
                     {renderH2HButton()}
                </div>
            );
        case 'SCHEDULED':
        default:
            return (
                <div className="text-center flex flex-col items-center">
                    <div className="text-2xl font-bold text-text-secondary mb-1">{game.time}</div>
                    {renderH2HButton()}
                </div>
            );
    }
};

const PredictionBar: React.FC<{ prediction: GamePrediction }> = ({ prediction }) => {
    const { homeWinPercentage, awayWinPercentage, drawPercentage } = prediction;
    
    if (homeWinPercentage === null || awayWinPercentage === null) return null;

    const draw = drawPercentage ?? 0;
    const home = homeWinPercentage;
    const away = awayWinPercentage;

    return (
        <div className="px-4 pt-4">
             <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-2 text-center">Probabilidade de Resultado</h4>
            <div className="w-full flex rounded-full h-6 bg-black/30 overflow-hidden text-white font-bold text-xs">
                <div 
                    style={{ width: `${home}%` }}
                    className="flex items-center justify-center bg-blue-500 h-full transition-all duration-500"
                    title={`Vitória ${Math.round(home)}%`}
                >
                    <span>{Math.round(home)}%</span>
                </div>
                {draw > 0 && (
                    <div
                        style={{ width: `${draw}%` }}
                        className="flex items-center justify-center bg-gray-500 h-full transition-all duration-500"
                        title={`Empate ${Math.round(draw)}%`}
                    >
                       <span>{Math.round(draw)}%</span>
                    </div>
                )}
                <div
                    style={{ width: `${away}%` }}
                    className="flex items-center justify-center bg-red-500 h-full transition-all duration-500"
                    title={`Vitória ${Math.round(away)}%`}
                >
                    <span>{Math.round(away)}%</span>
                </div>
            </div>
        </div>
    );
};

const StatRow: React.FC<{ label: string; homeValue: number | null; awayValue: number | null }> = ({ label, homeValue, awayValue }) => {
    const home = homeValue ?? '-';
    const away = awayValue ?? '-';
    
    const homeIsGreater = typeof home === 'number' && typeof away === 'number' && home > away;
    const awayIsGreater = typeof home === 'number' && typeof away === 'number' && away > home;

    return (
        <div className="flex justify-between items-center text-sm py-1">
            <span className={`font-semibold ${homeIsGreater ? 'text-text-primary' : 'text-text-secondary'}`}>{home}</span>
            <span className="text-text-secondary uppercase text-xs font-bold">{label}</span>
            <span className={`font-semibold ${awayIsGreater ? 'text-text-primary' : 'text-text-secondary'}`}>{away}</span>
        </div>
    );
};

const GameDetails: React.FC<{ game: Game }> = ({ game }) => {
    const { homeStats, awayStats } = game;
    if (!homeStats || !awayStats) return null;

    const stats = [
        { label: 'Posse de Bola %', home: homeStats.possession, away: awayStats.possession },
        { label: 'Finalizações', home: homeStats.totalShots, away: awayStats.totalShots },
        { label: 'Finalizações no Gol', home: homeStats.shotsOnGoal, away: awayStats.shotsOnGoal },
        { label: 'Faltas', home: homeStats.fouls, away: awayStats.fouls },
        { label: 'Cartões Amarelos', home: homeStats.yellowCards, away: awayStats.yellowCards },
        { label: 'Cartões Vermelhos', home: homeStats.redCards, away: awayStats.redCards },
        { label: 'Escanteios', home: homeStats.corners, away: awayStats.corners },
        { label: 'Impedimentos', home: homeStats.offsides, away: awayStats.offsides },
    ];
    
    const availableStats = stats.filter(stat => stat.home !== null || stat.away !== null);
    
    if (availableStats.length === 0) {
        return (
             <div className="text-center text-sm text-text-secondary py-4">
                Estatísticas detalhadas não disponíveis.
            </div>
        )
    }

    return (
        <div className="px-4 py-2 bg-black/20">
            <h4 className="text-sm font-bold text-text-primary mb-2 text-center border-b border-white/10 pb-2">Estatísticas da Partida</h4>
            <div className="space-y-1">
                 {availableStats.map(stat => (
                    <StatRow key={stat.label} label={stat.label} homeValue={stat.home} awayValue={stat.away} />
                ))}
            </div>
        </div>
    );
};

const GameCard: React.FC<GameCardProps> = ({ game, isSelected, onCardClick, onTeamClick, onH2HClick, onAiAnalysisClick, onChatClick }) => {
    const hasPrediction = game.prediction && game.status !== 'FINISHED';
    const hasDetails = (game.status === 'LIVE' || game.status === 'FINISHED') && (game.homeStats || game.awayStats);
    const hasBroadcastInfo = game.whereToWatch && game.whereToWatch.length > 0;

    return (
        <div className="bg-card-bg rounded-lg shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
            <div>
                <div 
                    onClick={() => hasDetails && onCardClick(game.id)}
                    className={`w-full text-left focus:outline-none ${hasDetails ? 'cursor-pointer' : 'cursor-default'}`}
                    role={hasDetails ? 'button' : undefined}
                    aria-expanded={isSelected}
                    aria-controls={`details-${game.id}`}
                >
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4 text-xs">
                            <span className="font-bold text-accent uppercase tracking-wider">{game.sport}</span>
                            <span className="text-text-secondary truncate text-right">{game.league}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <TeamDisplay name={game.homeTeam} logo={game.homeLogo} onClick={() => onTeamClick(game.homeTeam)} />
                            <div className="flex-1 flex justify-center items-center px-1">
                                 <ScoreDisplay game={game} onH2HClick={() => onH2HClick(game.homeTeam, game.awayTeam)} />
                            </div>
                            <TeamDisplay name={game.awayTeam} logo={game.awayLogo} onClick={() => onTeamClick(game.awayTeam)} />
                        </div>
                    </div>

                    {hasPrediction && game.prediction && <PredictionBar prediction={game.prediction} />}

                    <div className="px-4 pb-3 pt-2 text-center">
                        {hasPrediction && (
                            <p className="text-xs text-text-secondary/70 mb-3">
                                *Probabilidade baseada na análise agregada de +10 sites especializados.
                            </p>
                        )}
                        
                        {hasDetails && (
                            <div className="flex items-center justify-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
                                <span>{isSelected ? 'Ocultar Estatísticas' : 'Ver Estatísticas'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isSelected ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
                
                <div 
                    id={`details-${game.id}`}
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isSelected && hasDetails ? 'max-h-96' : 'max-h-0'}`}
                >
                    <GameDetails game={game} />
                </div>
                 
                {hasBroadcastInfo && (
                    <div className="px-4 py-3">
                        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Onde Assistir</h4>
                        <div className="flex flex-wrap gap-2">
                            {game.whereToWatch.map((channel) => (
                                channel.url ? (
                                    <a
                                        key={channel.name}
                                        href={channel.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 text-text-secondary px-2.5 py-1 rounded-full hover:bg-accent hover:text-white transition-colors"
                                    >
                                        {channel.name}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                ) : (
                                    <span
                                        key={channel.name}
                                        className="text-xs font-semibold bg-white/10 text-text-secondary px-2.5 py-1 rounded-full"
                                    >
                                        {channel.name}
                                    </span>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="p-2 bg-black/20 border-t border-white/10 mt-auto flex items-center gap-2">
                 <button
                    onClick={(e) => { e.stopPropagation(); onAiAnalysisClick(game); }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold bg-accent/20 text-accent p-2 rounded-md hover:bg-accent hover:text-white transition-colors duration-300"
                    aria-label={`Analisar jogo ${game.homeTeam} vs ${game.awayTeam} com IA`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.24a2 2 0 00-1.806.547M8 4h8l-1 1v4.512l-1.571.785a2 2 0 01-1.858 0L8 9.512V5L7 4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Analisar com IA
                </button>
                 <button
                    onClick={(e) => { e.stopPropagation(); onChatClick(game); }}
                    className="flex-shrink-0 p-2 rounded-md bg-white/10 text-text-secondary hover:bg-accent hover:text-white transition-colors duration-300"
                    aria-label={`Abrir chat para o jogo ${game.homeTeam} vs ${game.awayTeam}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default GameCard;