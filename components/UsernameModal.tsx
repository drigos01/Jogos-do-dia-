import React, { useState } from 'react';
import Modal from './Modal';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onClose, onSave }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSave(username.trim());
      setUsername('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Escolha seu Username">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-text-secondary text-sm mb-2">
            Digite um username para participar do chat:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Seu username..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
            maxLength={20}
            autoFocus
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!username.trim()}
            className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Entrar no Chat
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UsernameModal;
