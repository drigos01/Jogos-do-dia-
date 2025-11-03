
import { useState, useEffect, useCallback } from 'react';
import { Bet, Game, PredictedOutcome } from '../types';
import { ToastData } from '../components/Toast';

const BETTING_STORAGE_KEY = 'betting_data_v1';

interface BettingData {
    userBalance: number;
    betHistory: Bet[];
}

export const useBetting = (addToast: (message: string, type: ToastData['type']) => void) => {
    const [userBalance, setUserBalance] = useState<number>(1000);
    const [betHistory, setBetHistory] = useState<Bet[]>([]);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(BETTING_STORAGE_KEY);
            if (storedData) {
                const data: BettingData = JSON.parse(storedData);
                setUserBalance(data.userBalance);
                setBetHistory(data.betHistory);
            }
        } catch (e) {
            console.error("Failed to load betting data from localStorage", e);
        }
    }, []);

    useEffect(() => {
        try {
            const data: BettingData = { userBalance, betHistory };
            localStorage.setItem(BETTING_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save betting data to localStorage", e);
        }
    }, [userBalance, betHistory]);

    const placeBet = useCallback((game: Game, betOn: PredictedOutcome, amount: number, odds: number) => {
        if (amount > userBalance) {
            addToast("Saldo insuficiente para esta aposta.", 'error');
            return;
        }

        const newBet: Bet = {
            id: `bet-${game.id}-${Date.now()}`,
            gameId: game.id,
            betOn,
            amount,
            odds,
            status: 'PENDING',
            potentialWinnings: amount * odds,
            gameDetails: {
                homeTeam: game.homeTeam,
                homeLogo: game.homeLogo,
                awayTeam: game.awayTeam,
                awayLogo: game.awayLogo,
                date: game.date,
                sport: game.sport,
            }
        };

        setUserBalance(prev => prev - amount);
        setBetHistory(prev => [newBet, ...prev]);
        addToast("Aposta realizada com sucesso!", 'success');
    }, [userBalance, addToast]);
    
    const cancelBet = useCallback((betId: string) => {
        const betToCancel = betHistory.find(b => b.id === betId);
        if (betToCancel && betToCancel.status === 'PENDING') {
            setUserBalance(prev => prev + betToCancel.amount);
            setBetHistory(prev => prev.filter(b => b.id !== betId));
            addToast("Aposta cancelada.", 'info');
        }
    }, [betHistory, addToast]);

    const settleBets = useCallback((finishedGames: Game[]) => {
        let balanceChange = 0;
        const updatedHistory = betHistory.map(bet => {
            if (bet.status !== 'PENDING') return bet;

            const game = finishedGames.find(g => g.id === bet.gameId);
            if (!game || game.homeScore === null || game.awayScore === null) return bet;

            let actualOutcome: PredictedOutcome;
            if (game.homeScore > game.awayScore) actualOutcome = 'HOME_WIN';
            else if (game.awayScore > game.homeScore) actualOutcome = 'AWAY_WIN';
            else actualOutcome = 'DRAW';

            const isWin = bet.betOn === actualOutcome;
            
            const updatedBet: Bet = { ...bet, finalHomeScore: game.homeScore, finalAwayScore: game.awayScore };

            if (isWin) {
                updatedBet.status = 'WON';
                balanceChange += bet.potentialWinnings;
                addToast(`Você ganhou $${bet.potentialWinnings.toFixed(2)} em ${game.homeTeam} vs ${game.awayTeam}!`, 'success');
            } else {
                updatedBet.status = 'LOST';
                addToast(`Você perdeu $${bet.amount.toFixed(2)} em ${game.homeTeam} vs ${game.awayTeam}.`, 'error');
            }
            return updatedBet;
        });

        if (balanceChange > 0) {
            setUserBalance(prev => prev + balanceChange);
        }
        setBetHistory(updatedHistory);

    }, [betHistory, addToast]);
    
    return {
        userBalance,
        betHistory,
        placeBet,
        cancelBet,
        settleBets,
    };
};
