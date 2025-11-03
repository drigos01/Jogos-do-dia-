import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  onOpenHitRateModal: () => void;
  onOpenBetHistoryModal: () => void;
  userBalance: number;
  liveGamesCount: number;
}

const RefreshIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4a14.95 14.95 0 0114.65 12.35M20 20a14.95 14.95 0 01-14.65-12.35" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WalletIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a9 9 0 0 0-18 0" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading, onOpenHitRateModal, userBalance, onOpenBetHistoryModal, liveGamesCount }) => {
  const [balanceChange, setBalanceChange] = useState<'win' | 'loss' | null>(null);
  const prevBalanceRef = useRef(userBalance);

  useEffect(() => {
    if (prevBalanceRef.current !== userBalance) {
      if (userBalance > prevBalanceRef.current) {
        setBalanceChange('win');
      } else if (userBalance < prevBalanceRef.current) {
        setBalanceChange('loss');
      }
      
      const timer = setTimeout(() => {
        setBalanceChange(null);
      }, 1000); // Animation duration

      prevBalanceRef.current = userBalance;
      return () => clearTimeout(timer);
    }
  }, [userBalance]);

  const getBalanceClasses = () => {
    if (balanceChange === 'win') return 'bg-green-500/30 text-green-300';
    if (balanceChange === 'loss') return 'bg-red-500/30 text-red-300';
    return 'bg-white/5';
  }

  return (
    <header className="bg-card-bg/50 backdrop-blur-sm sticky top-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.536 6.464a.5.5 0 01.707 0l2 2a.5.5 0 11-.707.707L10 7.707l-1.536 1.536a.5.5 0 11-.707-.707l2-2zM10 9a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3A.5.5 0 0110 9z" clipRule="evenodd" />
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                Jogos do <span className="text-accent">Dia</span>
            </h1>
            <div className="hidden md:flex items-center space-x-2 text-xs text-accent font-semibold bg-accent/10 px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span>Tempo Real</span>
            </div>
             {liveGamesCount > 0 && (
                <div className="hidden md:flex items-center space-x-2 text-xs text-red-400 font-semibold bg-red-500/10 px-3 py-1 rounded-full animate-pulse">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span>{liveGamesCount} Ao Vivo</span>
                </div>
            )}
        </div>
        <div className="flex items-center gap-2">
             <button
              onClick={onOpenBetHistoryModal}
              className={`flex items-center gap-2 p-2 rounded-full text-text-primary hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent ${getBalanceClasses()}`}
              aria-label="Ver histórico de apostas"
            >
                <WalletIcon className="h-6 w-6 text-accent" />
                <span className="font-bold text-sm pr-2">${userBalance.toFixed(2)}</span>
            </button>
            <button
              onClick={onOpenHitRateModal}
              className="p-2 rounded-full text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Ver histórico de acertos"
            >
                <CheckIcon className="h-6 w-6" />
            </button>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-full text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Atualizar jogos"
            >
              <RefreshIcon className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
