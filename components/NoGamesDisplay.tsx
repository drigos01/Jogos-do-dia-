
import React from 'react';

interface NoGamesDisplayProps {
    onRefresh: () => void;
}

const NoGamesDisplay: React.FC<NoGamesDisplayProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 bg-card-bg/50 border border-white/10 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-xl font-semibold text-text-primary">Nenhum Jogo Encontrado</h2>
      <p className="text-text-secondary mt-1">Não encontramos jogos para hoje.</p>
      <button 
        onClick={onRefresh}
        className="mt-6 px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-accent"
      >
        Verificar Novamente
      </button>
    </div>
  );
};

export default NoGamesDisplay;
