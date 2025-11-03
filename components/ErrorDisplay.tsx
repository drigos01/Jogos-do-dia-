import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md text-center">
        <div className="text-red-400 text-4xl mb-4">⚠️</div>
        <h3 className="text-text-primary text-lg font-semibold mb-2">Erro ao carregar</h3>
        <p className="text-text-secondary mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="bg-accent hover:bg-accent-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
