import React from 'react';

interface NoGamesDisplayProps {
  onRefresh: () => void;
}

const NoGamesDisplay: React.FC<NoGamesDisplayProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">⚽</div>
      <h3 className="text-text-primary text-xl font-semibold mb-2">Nenhum jogo encontrado</h3>
      <p className="text-text-secondary mb-6 max-w-md">
        Não há jogos agendados para hoje nesta modalidade. Tente atualizar ou verifique outras modalidades esportivas.
      </p>
      <button
        onClick={onRefresh}
        className="bg-accent hover:bg-accent-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Atualizar Jogos
      </button>
    </div>
  );
};

export default NoGamesDisplay;
