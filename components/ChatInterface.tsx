import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUser: string | null;
  compact?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  currentUser,
  compact = false
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() && currentUser) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex flex-col ${compact ? 'h-64' : 'h-96'}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            <div className="text-4xl mb-2">💬</div>
            <p>Nenhuma mensagem ainda</p>
            <p className="text-sm">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message p-3 rounded-lg ${
                message.username === currentUser
                  ? 'bg-accent/20 ml-8'
                  : 'bg-gray-800/30 mr-8'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-semibold ${
                  message.username === currentUser ? 'text-accent' : 'text-text-primary'
                }`}>
                  {message.username}
                </span>
                <span className="text-text-secondary text-xs">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-text-primary text-sm">{message.text}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentUser ? "Digite sua mensagem..." : "Entre com um username..."}
            disabled={!currentUser}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary text-sm focus:outline-none focus:border-accent"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || !currentUser}
            className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
