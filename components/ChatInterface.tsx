
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUser: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, currentUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-2 text-center text-xs text-text-secondary bg-brand-bg/50">
          <p><strong>Aviso:</strong> O histórico do chat é uma simulação e fica salvo apenas no seu navegador.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.username === currentUser;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-text-secondary px-1">{msg.username}</span>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs md:max-w-md break-words ${
                    isCurrentUser ? 'bg-accent text-white rounded-br-none' : 'bg-white/10 text-text-primary rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-brand-bg/80 border border-white/20 rounded-full px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            autoComplete="off"
            disabled={!currentUser}
          />
          <button
            type="submit"
            className="bg-accent text-white rounded-full p-2.5 hover:bg-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-accent disabled:opacity-50"
            aria-label="Enviar mensagem"
            disabled={!currentUser || !newMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
