
import React, { useState, useEffect, useCallback } from 'react';
import { Game, ModalContentType, AiAnalysisResponse, PastGame, PredictionResult, PredictedOutcome } from './types';
import { fetchGamesOfTheDay, fetchTeamHistory, fetchHeadToHeadHistory, fetchAiAnalysis } from './services/geminiService';
import Header from './components/Header';
import GameCard from './components/GameCard';
import ErrorDisplay from './components/ErrorDisplay';
import NoGamesDisplay from './components/NoGamesDisplay';
import SportFilter from './components/SportFilter';
import Modal from './components/Modal';
import HistoryView from './components/HistoryView';
import AiAnalysisModal from './components/AiAnalysisModal';
import GlobalChat from './components/GlobalChat';
import UsernameModal from './components/UsernameModal';
import ChatInterface from './components/ChatInterface';
import HitRateModal from './components/HitRateModal';
import BetHistoryModal from './components/BetHistoryModal';
import Toast, { ToastData } from './components/Toast';
import { useBetting } from './hooks/useBetting';
import { useChat } from './hooks/useChat';
import GameCardSkeleton from './components/GameCardSkeleton';
import LeagueFilter from './components/LeagueFilter';

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string>('Futebol');
  const [selectedLeague, setSelectedLeague] = useState<string>('All');
  
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContentType | null>(null);
  const [historyData, setHistoryData] = useState<PastGame[] | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedGameForAi, setSelectedGameForAi] = useState<Game | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AiAnalysisResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: ToastData['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const {
    userBalance,
    betHistory,
    placeBet,
    cancelBet,
    settleBets
  } = useBetting(addToast);

  const {
    username,
    isUsernameModalOpen,
    isGlobalChatOpen,
    isGameChatOpen,
    gameChatGame,
    allChatMessages,
    handleSetUsername,
    handleToggleGlobalChat,
    handleOpenGameChat,
    handleSwitchToGlobalChat,
    handleSwitchToGameChat,
    handleSendMessage,
    handleCloseGameChat,
    handleCloseUsernameModal
  } = useChat();
  
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [isHitRateModalOpen, setIsHitRateModalOpen] = useState(false);
  const [isBetHistoryModalOpen, setIsBetHistoryModalOpen] = useState(false);

  useEffect(() => {
    try {
        const storedHistory = localStorage.getItem('prediction_history');
        if (storedHistory) setPredictionHistory(JSON.parse(storedHistory));
    } catch (e) {
        console.error("Failed to load prediction history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('prediction_history', JSON.stringify(predictionHistory));
    } catch (e) { console.error("Failed to save prediction history to localStorage", e); }
  }, [predictionHistory]);
  
  const processFinishedGames = useCallback((finishedGames: Game[]) => {
      settleBets(finishedGames);

      setPredictionHistory(prevHistory => {
          let newHistory = [...prevHistory];
          const processedGameIds = new Set(prevHistory.map(p => p.gameId));

          for (const game of finishedGames) {
              if (!game.prediction || processedGameIds.has(game.id)) continue;
              if (game.homeScore === null || game.awayScore === null) continue;
              
              let actualOutcome: PredictedOutcome;
              if (game.homeScore > game.awayScore) actualOutcome = 'HOME_WIN';
              else if (game.awayScore > game.homeScore) actualOutcome = 'AWAY_WIN';
              else actualOutcome = 'DRAW';

              const { homeWinPercentage, awayWinPercentage, drawPercentage } = game.prediction;
              let predictedOutcome: PredictedOutcome;
              const draw = drawPercentage ?? 0;
              
              if (homeWinPercentage > awayWinPercentage && homeWinPercentage > draw) predictedOutcome = 'HOME_WIN';
              else if (awayWinPercentage > homeWinPercentage && awayWinPercentage > draw) predictedOutcome = 'AWAY_WIN';
              else predictedOutcome = 'DRAW';
              
              newHistory.push({
                  gameId: game.id, gameDate: game.date, homeTeam: game.homeTeam,
                  homeLogo: game.homeLogo, awayTeam: game.awayTeam, awayLogo: game.awayLogo,
                  homeScore: game.homeScore, awayScore: game.awayScore,
                  predictedOutcome, actualOutcome, isHit: predictedOutcome === actualOutcome, sport: game.sport,
              });
          }
          return newHistory.sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
      });
  }, [settleBets]);

  const loadGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedGameId(null);
    try {
      const fetchedGames = await fetchGamesOfTheDay();
      setGames(fetchedGames);
      processFinishedGames(fetchedGames.filter(g => g.status === 'FINISHED'));
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Ocorreu um erro desconhecido.');
      setGames([]);
    } finally {
      setIsLoading(false);
    }
  }, [processFinishedGames]);

  useEffect(() => {
    loadGames();
    const interval = setInterval(loadGames, 5 * 60 * 1000); // Auto-refresh every 5 minutes

    return () => clearInterval(interval);
  }, [loadGames]);

  const handleSelectSport = (sport: string) => {
    setSelectedSport(sport);
    setSelectedLeague('All');
  };

  const handleCardClick = (gameId: string) => setSelectedGameId(prevId => (prevId === gameId ? null : gameId));
  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false); setModalContent(null); setHistoryData(null); setHistoryError(null);
  };
  
  const handleTeamClick = async (teamName: string) => {
      setModalContent({ type: 'team', teamName }); setIsHistoryModalOpen(true); setIsHistoryLoading(true); setHistoryError(null);
      try {
          const data = await fetchTeamHistory(teamName); setHistoryData(data);
      } catch (err) {
          if (err instanceof Error) setHistoryError(err.message); else setHistoryError('Ocorreu um erro desconhecido.');
      } finally { setIsHistoryLoading(false); }
  };
  
  const handleH2HClick = async (homeTeam: string, awayTeam: string) => {
      setModalContent({ type: 'h2h', homeTeam, awayTeam }); setIsHistoryModalOpen(true); setIsHistoryLoading(true); setHistoryError(null);
      try {
          const data = await fetchHeadToHeadHistory(homeTeam, awayTeam); setHistoryData(data);
      } catch (err) {
          if (err instanceof Error) setHistoryError(err.message); else setHistoryError('Ocorreu um erro desconhecido.');
      } finally { setIsHistoryLoading(false); }
  };
  
  const handleOpenAiModal = (game: Game) => { setSelectedGameForAi(game); setIsAiModalOpen(true); };
  const handleCloseAiModal = () => { setIsAiModalOpen(false); setSelectedGameForAi(null); setAiAnalysisResult(null); setAiError(null); };

  // FIX: Refactored function to have one statement per line to avoid potential parser issues.
  const handleRunAnalysis = async (analysisType: 'quick' | 'deep') => {
    if (!selectedGameForAi) return;
    setIsAiLoading(true);
    setAiAnalysisResult(null);
    setAiError(null);
    try {
      const result = await fetchAiAnalysis(selectedGameForAi, analysisType);
      setAiAnalysisResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido na análise.';
      setAiError(message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderGameSection = (title: string, gamesList: Game[]) => {
    if (gamesList.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-text-primary mb-4 border-b-2 border-accent/50 pb-2">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gamesList.map((game) => (
            <GameCard 
              key={game.id}
              game={game} 
              isSelected={selectedGameId === game.id}
              onCardClick={handleCardClick}
              onTeamClick={handleTeamClick}
              onH2HClick={handleH2HClick}
              onAiAnalysisClick={handleOpenAiModal}
              onChatClick={handleOpenGameChat}
              onPlaceBet={placeBet}
              onCancelBet={cancelBet}
              userBalance={userBalance}
              placedBet={betHistory.find(b => b.gameId === game.id && b.status === 'PENDING') || null}
            />
          ))}
        </div>
      </div>
    );
  };
  
  const renderSportContent = (sportGames: Game[]) => {
      if (!sportGames || sportGames.length === 0) return <NoGamesDisplay onRefresh={loadGames} />;

      const liveGames = sportGames.filter(g => g.status === 'LIVE');
      const scheduledGames = sportGames.filter(g => g.status === 'SCHEDULED');
      const finishedGames = sportGames.filter(g => g.status === 'FINISHED');
      const postponedGames = sportGames.filter(g => g.status === 'POSTPONED');

      if (liveGames.length === 0 && scheduledGames.length === 0 && finishedGames.length === 0 && postponedGames.length === 0) {
          return <NoGamesDisplay onRefresh={loadGames} />;
      }

      return (
        <div className="animate-fade-in">
          {renderGameSection('Ao Vivo', liveGames)}
          {renderGameSection('Próximos Jogos', scheduledGames)}
          {renderGameSection('Encerrados', finishedGames)}
          {renderGameSection('Adiados', postponedGames)}
        </div>
      );
  }
  
  const renderContent = () => {
    if (isLoading && games.length === 0) {
        return (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <GameCardSkeleton key={i} />)}
          </div>
        );
    }
    if (error) return <ErrorDisplay message={error} onRetry={loadGames} />;
    if (games.length === 0 && !isLoading) return <NoGamesDisplay onRefresh={loadGames} />;

    const sports = ['Futebol', ...Object.keys(games.reduce((acc, game) => {
        if (game.sport !== 'Futebol') acc[game.sport] = true;
        return acc;
    }, {} as Record<string, boolean>)).sort()];

    const gamesForSelectedSport = games.filter(g => g.sport === selectedSport);
    const leagues = ['All', ...Array.from(new Set(gamesForSelectedSport.map(g => g.league)))];
    const displayedGames = gamesForSelectedSport.filter(g => selectedLeague === 'All' || g.league === selectedLeague);

    return (
      <>
        <SportFilter sports={sports} activeSport={selectedSport} onSelectSport={handleSelectSport} />
        {leagues.length > 2 && <LeagueFilter leagues={leagues} activeLeague={selectedLeague} onSelectLeague={setSelectedLeague} />}
        <div className="mt-8">
            {isLoading && games.length > 0 ? (
                 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => <GameCardSkeleton key={i} />)}
                 </div>
            ) : renderSportContent(displayedGames)}
        </div>
      </>
    );
  };

  const getHistoryModalTitle = () => {
      if (!modalContent) return '';
      if (modalContent.type === 'team') return `Histórico de Jogos: ${modalContent.teamName}`;
      return `Confronto Direto: ${modalContent.homeTeam} vs ${modalContent.awayTeam}`;
  };

  const activeGames = games.filter(g => g.status === 'LIVE' || g.status === 'SCHEDULED');
  const liveGamesCount = games.filter(g => g.status === 'LIVE').length;

  return (
    <div className="min-h-screen bg-brand-bg text-text-primary font-sans">
      <div className="fixed top-4 right-4 z-[100] w-full max-w-xs space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
      </div>
      <Header 
        onRefresh={loadGames} 
        isLoading={isLoading} 
        onOpenHitRateModal={() => setIsHitRateModalOpen(true)} 
        userBalance={userBalance} 
        onOpenBetHistoryModal={() => setIsBetHistoryModalOpen(true)}
        liveGamesCount={liveGamesCount}
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <Modal isOpen={isHistoryModalOpen} onClose={handleCloseHistoryModal} title={getHistoryModalTitle()}>
        <HistoryView isLoading={isHistoryLoading} error={historyError} data={historyData} />
      </Modal>
      {selectedGameForAi && (
        <AiAnalysisModal isOpen={isAiModalOpen} onClose={handleCloseAiModal} game={selectedGameForAi} onRunAnalysis={handleRunAnalysis} isLoading={isAiLoading} error={aiError} analysisResult={aiAnalysisResult} />
      )}
      <HitRateModal isOpen={isHitRateModalOpen} onClose={() => setIsHitRateModalOpen(false)} history={predictionHistory} />
      <BetHistoryModal isOpen={isBetHistoryModalOpen} onClose={() => setIsBetHistoryModalOpen(false)} history={betHistory} balance={userBalance}/>
      <GlobalChat isOpen={isGlobalChatOpen} onToggle={handleToggleGlobalChat} messages={allChatMessages['global'] || []} onSendMessage={(msg) => handleSendMessage(msg, 'global')} currentUser={username} activeGames={activeGames} onSwitchToGameChat={handleSwitchToGameChat} />
      <Modal
        isOpen={isGameChatOpen}
        onClose={handleCloseGameChat}
        title={gameChatGame ? `Chat: ${gameChatGame.homeTeam} vs ${gameChatGame.awayTeam}` : 'Chat do Jogo'}
        headerAction={
            <button onClick={handleSwitchToGlobalChat} className="text-xs font-bold bg-white/10 px-2 py-1 rounded-md text-text-secondary hover:bg-accent hover:text-white transition-colors" aria-label="Ir para o chat global">
                Ir para Chat Global
            </button>
        }
      >
        <ChatInterface messages={gameChatGame ? (allChatMessages[gameChatGame.id] || []) : []} onSendMessage={(msg) => gameChatGame && handleSendMessage(msg, gameChatGame.id)} currentUser={username} />
      </Modal>
      <UsernameModal isOpen={isUsernameModalOpen} onClose={handleCloseUsernameModal} onSave={handleSetUsername} />
    </div>
  );
};

export default App;
