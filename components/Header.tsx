import React from 'react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onOpenHitRateModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading, onOpenHitRateModal }) => {
  return (
    <header className="bg-card-bg border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-text-primary">Jogos do Dia</h1>
            <span className="bg-accent text-white text-sm px-2 py-1 rounded-md">AO VIVO</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenHitRateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Taxa de Acerto
            </button>
            
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
        
        <p className="text-text-secondary mt-2">
          Acompanhe os jogos em tempo real com análise preditiva
        </p>
      </div>
    </header>
  );
};

export default Header;
