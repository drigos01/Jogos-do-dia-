import React, { useState, useRef, useEffect } from 'react';
import { Game, ChatMessage } from '../types';
import ChatInterface from './ChatInterface';

interface GlobalChatProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUser: string | null;
  activeGames: Game[];
  onSwitchToGameChat: (game: Game) => void;
}

const GlobalChat: React.FC<GlobalChatProps> = ({
  isOpen,
  onToggle,
  messages,
  onSendMessage,
  currentUser,
  activeGames,
  onSwitchToGameChat
}) => {
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-accent hover:bg-accent-hover text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-card-bg rounded-xl shadow-2xl border border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 className="text-text-primary font-semibold">Chat Global</h3>
        <div className="flex space-x-2">
          <button
            onClick={onToggle}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Jogos ativos */}
      {activeGames.length > 0 && (
        <div className="p-3 border-b border-gray-700">
          <div className="text-text-secondary text-sm mb-2">Jogos Ativos:</div>
          <div className="space-y-2">
            {activeGames.slice(0, 3).map((game) => (
              <button
                key={game.id}
                onClick={() => onSwitchToGameChat(game)}
                className="w-full text-left p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="text-text-primary text-sm font-medium">
                  {game.homeTeam} vs {game.awayTeam}
                </div>
                <div className="text-text-secondary text-xs">
                  {game.status === 'LIVE' ? `⚽ ${game.elapsedTime}'` : `⏰ ${game.time}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat */}
      <div className="flex-1">
        <ChatInterface
          messages={messages}
          onSendMessage={onSendMessage}
          currentUser={currentUser}
          compact={true}
        />
      </div>
    </div>
  );
};

export default GlobalChat;
