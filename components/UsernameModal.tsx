
import React, { useState } from 'react';
import Modal from './Modal';

interface UsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Defina seu nome de usuário">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-text-secondary">
          Para participar do chat, por favor, escolha um nome de usuário. Ele será salvo no seu navegador.
        </p>
        <div>
          <label htmlFor="username" className="sr-only">Nome de usuário</label>
          <input
            id="username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome no chat"
            className="w-full bg-brand-bg/80 border border-white/20 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            required
            autoFocus
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-accent"
          >
            Salvar e Entrar no Chat
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UsernameModal;
