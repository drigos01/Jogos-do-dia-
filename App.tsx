
import React, { useState, useEffect, useCallback } from 'react';
import { Game, PastGame, ModalContentType, AiAnalysisResponse, ChatMessage, PredictionResult, PredictedOutcome } from './types';
import { fetchGamesOfTheDay, fetchTeamHistory, fetchHeadToHeadHistory, fetchAiAnalysis } from './services/geminiService';
import Header from './components/Header';
import GameCard from './components/GameCard';
import LoadingSpinner from './components/LoadingSpinner';
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

type AllChatMessages = Record<string, ChatMessage[]>; // 'global' or game.id as key

const App: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string>('Futebol');
  
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

  // Chat State
  const [username, setUsername] = useState<string | null>(null);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [pendingChatAction, setPendingChatAction] = useState<(() => void) | null>(null);
  
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false);
  const [isGameChatOpen, setIsGameChatOpen] = useState(false);
  const [gameChatGame, setGameChatGame] = useState<Game | null>(null);
  const [allChatMessages, setAllChatMessages] = useState<AllChatMessages>({});
  
  // Hit Rate State
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [isHitRateModalOpen, setIsHitRateModalOpen] = useState(false);

  useEffect(() => {
    // Load persisted data from localStorage
    const storedUsername = localStorage.getItem('chat_username');
    if (storedUsername) setUsername(storedUsername);

    try {
        const storedMessages = localStorage.getItem('chat_messages');
        if (storedMessages) setAllChatMessages(JSON.parse(storedMessages));
    } catch (e) {
        console.error("Failed to load chat messages from localStorage", e);
        localStorage.removeItem('chat_messages');
    }
    
    try {
        const storedHistory = localStorage.getItem('prediction_history');
        if (storedHistory) setPredictionHistory(JSON.parse(storedHistory));
    } catch (e) {
        console.error("Failed to load prediction history from localStorage", e);
        localStorage.removeItem('prediction_history');
    }
  }, []);

  useEffect(() => {
    // Persist data to localStorage
    try {
        localStorage.setItem('chat_messages', JSON.stringify(allChatMessages));
    } catch (e) { console.error("Failed to save chat messages to localStorage", e); }
  }, [allChatMessages]);
  
  useEffect(() => {
    try {
        localStorage.setItem('prediction_history', JSON.stringify(predictionHistory));
    } catch (e) { console.error("Failed to save prediction history to localStorage", e); }
  }, [predictionHistory]);

  const processFinishedGames = useCallback((finishedGames: Game[]) => {
      setPredictionHistory(prevHistory => {
          let newHistory = [...prevHistory];
          const processedGameIds = new Set(prevHistory.map(p => p.gameId));

          for (const game of finishedGames) {
              if (!game.prediction || processedGameIds.has(game.id)) {
                  continue; // Skip if no prediction or already processed
              }

              if (game.homeScore === null || game.awayScore === null) {
                  continue; // Skip if score is not final
              }

              // Determine actual outcome
              let actualOutcome: PredictedOutcome;
              if (game.homeScore > game.awayScore) actualOutcome = 'HOME_WIN';
              else if (game.awayScore > game.homeScore) actualOutcome = 'AWAY_WIN';
              else actualOutcome = 'DRAW';

              // Determine predicted outcome
              const { homeWinPercentage, awayWinPercentage, drawPercentage } = game.prediction;
              let predictedOutcome: PredictedOutcome;
              const draw = drawPercentage ?? 0;
              
              if (homeWinPercentage > awayWinPercentage && homeWinPercentage > draw) {
                  predictedOutcome = 'HOME_WIN';
              } else if (awayWinPercentage > homeWinPercentage && awayWinPercentage > draw) {
                  predictedOutcome = 'AWAY_WIN';
              } else {
                  predictedOutcome = 'DRAW';
              }
              
              const newResult: PredictionResult = {
                  gameId: game.id,
                  gameDate: game.date,
                  homeTeam: game.homeTeam,
                  awayTeam: game.awayTeam,
                  homeScore: game.homeScore,
                  awayScore: game.awayScore,
                  predictedOutcome,
                  actualOutcome,
                  isHit: predictedOutcome === actualOutcome,
                  sport: game.sport,
              };
              
              newHistory.push(newResult);
          }
          
          return newHistory.sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
      });
  }, []);


  const loadGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedGameId(null);
    try {
      const fetchedGames = await fetchGamesOfTheDay();
      setGames(fetchedGames);
      processFinishedGames(fetchedGames.filter(g => g.status === 'FINISHED'));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
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

  const withUsernameCheck = (action: () => void) => {
    if (username) {
      action();
    } else {
      setPendingChatAction(() => action);
      setIsUsernameModalOpen(true);
    }
  };

  const handleSetUsername = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      setUsername(trimmedName);
      localStorage.setItem('chat_username', trimmedName);
      setIsUsernameModalOpen(false);
      if (pendingChatAction) {
        pendingChatAction();
        setPendingChatAction(null);
      }
    }
  };

  const handleToggleGlobalChat = () => {
    withUsernameCheck(() => {
        if (isGameChatOpen) setIsGameChatOpen(false);
        setIsGlobalChatOpen(prev => !prev)
    });
  };
  
  const handleOpenGameChat = (game: Game) => {
    withUsernameCheck(() => {
        setGameChatGame(game);
        setIsGameChatOpen(true);
        if(isGlobalChatOpen) setIsGlobalChatOpen(false);
    });
  };
  
  const handleSwitchToGlobalChat = () => {
    setIsGameChatOpen(false);
    setGameChatGame(null);
    setIsGlobalChatOpen(true);
  };

  const handleSwitchToGameChat = (game: Game) => {
    setIsGlobalChatOpen(false);
    handleOpenGameChat(game);
  };

  const handleSendMessage = (message: string, roomId: string) => {
    if (!username) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: username,
      text: message,
      timestamp: Date.now(),
    };
    
    setAllChatMessages(prev => {
        const roomMessages = prev[roomId] || [];
        return {
            ...prev,
            [roomId]: [...roomMessages, newMessage]
        };
    });
  };


  const handleCardClick = (gameId: string) => {
    setSelectedGameId(prevId => (prevId === gameId ? null : gameId));
  };
  
  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setModalContent(null);
    setHistoryData(null);
    setHistoryError(null);
  };
  
  const handleTeamClick = async (teamName: string) => {
      setModalContent({ type: 'team', teamName });
      setIsHistoryModalOpen(true);
      setIsHistoryLoading(true);
      setHistoryError(null);
      try {
          const data = await fetchTeamHistory(teamName);
          setHistoryData(data);
      } catch (err) {
          if (err instanceof Error) setHistoryError(err.message);
          else setHistoryError('Ocorreu um erro desconhecido.');
      } finally {
          setIsHistoryLoading(false);
      }
  };
  
  const handleH2HClick = async (homeTeam: string, awayTeam: string) => {
      setModalContent({ type: 'h2h', homeTeam, awayTeam });
      setIsHistoryModalOpen(true);
      setIsHistoryLoading(true);
      setHistoryError(null);
      try {
          const data = await fetchHeadToHeadHistory(homeTeam, awayTeam);
          setHistoryData(data);
      } catch (err) {
          if (err instanceof Error) setHistoryError(err.message);
          else setHistoryError('Ocorreu um erro desconhecido.');
      } finally {
          setIsHistoryLoading(false);
      }
  };
  
  const handleOpenAiModal = (game: Game) => {
    setSelectedGameForAi(game);
    setIsAiModalOpen(true);
  };

  const handleCloseAiModal = () => {
    setIsAiModalOpen(false);
    setSelectedGameForAi(null);
    setAiAnalysisResult(null);
    setAiError(null);
  };

  const handleRunAnalysis = async (analysisType: 'quick' | 'deep') => {
    if (!selectedGameForAi) return;

    setIsAiLoading(true);
    setAiAnalysisResult(null);
    setAiError(null);

    try {
      const result = await fetchAiAnalysis(selectedGameForAi, analysisType);
      setAiAnalysisResult(result);
    } catch (err)      {
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
            />
          ))}
        </div>
      </div>
    );
  };
  
  const renderSportContent = (sportGames: Game[]) => {
      if (!sportGames || sportGames.length === 0) {
        return <NoGamesDisplay onRefresh={loadGames} />;
      }

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
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={loadGames} />;
    }
    
    if (games.length === 0 && !isLoading) {
      return <NoGamesDisplay onRefresh={loadGames} />;
    }

    const sports = ['Futebol', ...Object.keys(games.reduce((acc, game) => {
        if (game.sport !== 'Futebol') {
            acc[game.sport] = true;
        }
        return acc;
    }, {} as Record<string, boolean>)).sort()];

    const displayedGames = games.filter(g => g.sport === selectedSport);

    return (
      <>
        <SportFilter 
          sports={sports}
          activeSport={selectedSport}
          onSelectSport={setSelectedSport}
        />
        <div className="mt-8">
            {isLoading && games.length > 0 ? <LoadingSpinner/> : renderSportContent(displayedGames)}
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

  return (
    <div className="min-h-screen bg-brand-bg text-text-primary font-sans">
      <Header onRefresh={loadGames} isLoading={isLoading} onOpenHitRateModal={() => setIsHitRateModalOpen(true)} />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <Modal 
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistoryModal}
        title={getHistoryModalTitle()}
      >
        <HistoryView 
          isLoading={isHistoryLoading}
          error={historyError}
          data={historyData}
        />
      </Modal>
      {selectedGameForAi && (
        <AiAnalysisModal
            isOpen={isAiModalOpen}
            onClose={handleCloseAiModal}
            game={selectedGameForAi}
            onRunAnalysis={handleRunAnalysis}
            isLoading={isAiLoading}
            error={aiError}
            analysisResult={aiAnalysisResult}
        />
      )}
       <HitRateModal 
        isOpen={isHitRateModalOpen}
        onClose={() => setIsHitRateModalOpen(false)}
        history={predictionHistory}
      />
      <GlobalChat
        isOpen={isGlobalChatOpen}
        onToggle={handleToggleGlobalChat}
        messages={allChatMessages['global'] || []}
        onSendMessage={(msg) => handleSendMessage(msg, 'global')}
        currentUser={username}
        activeGames={activeGames}
        onSwitchToGameChat={handleSwitchToGameChat}
      />
      <Modal
        isOpen={isGameChatOpen}
        onClose={() => setIsGameChatOpen(false)}
        title={gameChatGame ? `Chat: ${gameChatGame.homeTeam} vs ${gameChatGame.awayTeam}` : 'Chat do Jogo'}
        headerAction={
            <button 
                onClick={handleSwitchToGlobalChat}
                className="text-xs font-bold bg-white/10 px-2 py-1 rounded-md text-text-secondary hover:bg-accent hover:text-white transition-colors"
                aria-label="Ir para o chat global"
            >
                Ir para Chat Global
            </button>
        }
      >
        <ChatInterface 
          messages={gameChatGame ? (allChatMessages[gameChatGame.id] || []) : []}
          onSendMessage={(msg) => gameChatGame && handleSendMessage(msg, gameChatGame.id)}
          currentUser={username}
        />
      </Modal>
      <UsernameModal 
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        onSave={handleSetUsername}
      />
    </div>
  );
};

export default App;
