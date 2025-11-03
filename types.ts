export interface GameStats {
    fouls: number | null;
    yellowCards: number | null;
    redCards: number | null;
    possession: number | null; // Percentage
    shotsOnGoal: number | null;
    totalShots: number | null;
    corners: number | null;
    offsides: number | null;
}

export interface GamePrediction {
  homeWinPercentage: number | null;
  awayWinPercentage: number | null;
  drawPercentage: number | null;
}

export interface Broadcast {
  name: string;
  url?: string;
}

export interface GameOdds {
  homeWin: number | null;
  awayWin: number | null;
  draw: number | null;
}

export interface Game {
  id: string;
  sport: string;
  date: string; // ex: "2024-10-26"
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  time: string;
  league: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED';
  elapsedTime?: number;
  homeStats?: GameStats;
  awayStats?: GameStats;
  prediction?: GamePrediction;
  odds?: GameOdds;
  whereToWatch?: Broadcast[];
}

export interface PastGame {
  date: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  homeScore: number;
  awayScore: number;
  league: string;
}

export type ModalContentType =
  | { type: 'team'; teamName: string }
  | { type: 'h2h'; homeTeam: string; awayTeam: string };

export interface AiAnalysisResponse {
  predictedWinner: string;
  confidence: number; // A percentage from 0 to 100
  probabilities: {
    home: number;
    away: number;
    draw: number;
  };
  keyFactors: string[];
  detailedAnalysis: string;
  sources: string[];
}

export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

export type PredictedOutcome = 'HOME_WIN' | 'AWAY_WIN' | 'DRAW';

export interface PredictionResult {
    gameId: string;
    gameDate: string;
    homeTeam: string;
    homeLogo: string;
    awayTeam: string;
    awayLogo: string;
    homeScore: number;
    awayScore: number;
    predictedOutcome: PredictedOutcome;
    actualOutcome: PredictedOutcome;
    isHit: boolean;
    sport: string;
}

export interface Bet {
  id: string;
  gameId: string;
  betOn: PredictedOutcome;
  amount: number;
  odds: number;
  status: 'PENDING' | 'WON' | 'LOST';
  potentialWinnings: number;
  gameDetails: {
    homeTeam: string;
    homeLogo: string;
    awayTeam: string;
    awayLogo: string;
    date: string;
    sport: string;
  };
  finalHomeScore?: number | null;
  finalAwayScore?: number | null;
}