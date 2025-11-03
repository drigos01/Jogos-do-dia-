
import React from 'react';
import ChatInterface from './ChatInterface';
import { ChatMessage, Game } from '../types';

interface GlobalChatProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUser: string | null;
  activeGames: Game[];
  onSwitchToGameChat: (game: Game) => void;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ isOpen, onToggle, messages, onSendMessage, currentUser, activeGames, onSwitchToGameChat }) => {
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onToggle}
          className="bg-accent text-white rounded-full p-4 shadow-lg hover:bg-accent-hover transform hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-accent"
          aria-label="Abrir chat global"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        ></div>
      )}
      <div
        className={`fixed bottom-24 right-6 z-40 w-full max-w-sm h-[60vh] bg-card-bg rounded-lg shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <header className="flex items-center justify-between p-3 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-bold text-text-primary">Chat Global</h2>
          <button
            onClick={onToggle}
            className="p-1 rounded-full text-text-secondary hover:bg-white/10 hover:text-text-primary"
            aria-label="Fechar chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="flex-shrink-0 p-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-text-primary mb-2">Salas de Jogos Ativos</h3>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-2">
                {activeGames.length > 0 ? activeGames.map(game => (
                    <button 
                        key={game.id}
                        onClick={() => onSwitchToGameChat(game)}
                        className="w-full text-left text-xs p-2 rounded-md bg-brand-bg/50 hover:bg-accent hover:text-white transition-colors"
                    >
                        <span className="font-semibold">{game.sport}:</span> {game.homeTeam} vs {game.awayTeam}
                    </button>
                )) : <p className="text-xs text-text-secondary text-center">Nenhum jogo ativo no momento.</p>}
            </div>
        </div>
        <ChatInterface
          messages={messages}
          onSendMessage={onSendMessage}
          currentUser={currentUser}
        />
      </div>
    </>
  );
};

export default GlobalChat;
