import React, { useState, useEffect, useCallback } from 'react';
import { Game, PastGame, ModalContentType, AiAnalysisResponse, ChatMessage, PredictionResult, PredictedOutcome } from './types';
import { fetchGamesOfTheDay, fetchTeamHistory, fetchHeadToHeadHistory, fetchAiAnalysis } from './services/geminiService';
import Header from './components/Header';
import GameCard from './components/GameCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import NoGamesDisplay from './components/NoGamesDisplay';
import SportFilter from './components/SportFilter';
import Modal from './components/Modal';
import HistoryView from './components/HistoryView';
import AiAnalysisModal from './components/AiAnalysisModal';
import GlobalChat from './components/GlobalChat';
import UsernameModal from './components/UsernameModal';
import ChatInterface from './components/ChatInterface';
import HitRateModal from './components/HitRateModal';

// ... todo o resto do código do App.tsx que você já tem ...

// **VERIFIQUE QUE ESTÁ EXPORTANDO COMO DEFAULT NO FINAL:**
export default App; // ← Esta linha deve estar no final do arquivo
