
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-text-primary">Buscando os jogos...</h2>
      <p className="text-text-secondary mt-1">Isso pode levar alguns segundos.</p>
    </div>
  );
};

export default LoadingSpinner;
