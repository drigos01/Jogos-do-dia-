import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      <span className="ml-3 text-text-secondary">Carregando jogos...</span>
    </div>
  );
};

export default LoadingSpinner;
