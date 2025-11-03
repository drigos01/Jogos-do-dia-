
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 bg-red-900/20 border border-red-500 rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-xl font-semibold text-text-primary">Ocorreu um Erro</h2>
      <p className="text-text-secondary mt-1 max-w-md">{message}</p>
      <button 
        onClick={onRetry}
        className="mt-6 px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent-hover transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-accent"
      >
        Tentar Novamente
      </button>
    </div>
  );
};

export default ErrorDisplay;
