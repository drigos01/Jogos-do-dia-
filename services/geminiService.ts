import { Game, PastGame, AiAnalysisResponse } from '../types';

// Mock data para quando a API não estiver disponível
const MOCK_GAMES: Game[] = [
  {
    id: '1',
    sport: 'Futebol',
    date: '2024-01-15',
    homeTeam: 'Flamengo',
    homeLogo: '/team-logos/flamengo.png',
    awayTeam: 'Palmeiras',
    awayLogo: '/team-logos/palmeiras.png',
    time: '16:00',
    league: 'Brasileirão Série A',
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    prediction: {
      homeWinPercentage: 45,
      awayWinPercentage: 30,
      drawPercentage: 25
    }
  },
  {
    id: '2',
    sport: 'Futebol',
    date: '2024-01-15',
    homeTeam: 'São Paulo',
    homeLogo: '/team-logos/sao-paulo.png',
    awayTeam: 'Corinthians',
    awayLogo: '/team-logos/corinthians.png',
    time: '19:00',
    league: 'Brasileirão Série A',
    homeScore: 2,
    awayScore: 1,
    status: 'FINISHED',
    prediction: {
      homeWinPercentage: 40,
      awayWinPercentage: 35,
      drawPercentage: 25
    }
  },
  {
    id: '3',
    sport: 'Futebol',
    date: '2024-01-15',
    homeTeam: 'Grêmio',
    homeLogo: '/team-logos/gremio.png',
    awayTeam: 'Internacional',
    awayLogo: '/team-logos/internacional.png',
    time: '21:30',
    league: 'Brasileirão Série A',
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    elapsedTime: 65,
    homeStats: {
      possession: 52,
      shotsOnGoal: 5,
      totalShots: 12,
      corners: 4,
      fouls: 8,
      yellowCards: 2,
      redCards: 0,
      offsides: 1
    },
    awayStats: {
      possession: 48,
      shotsOnGoal: 3,
      totalShots: 8,
      corners: 2,
      fouls: 10,
      yellowCards: 1,
      redCards: 0,
      offsides: 2
    }
  }
];

const MOCK_HISTORY: PastGame[] = [
  {
    date: '2024-01-08',
    homeTeam: 'Flamengo',
    homeLogo: '/team-logos/flamengo.png',
    awayTeam: 'Palmeiras',
    awayLogo: '/team-logos/palmeiras.png',
    homeScore: 2,
    awayScore: 1,
    league: 'Brasileirão Série A'
  },
  {
    date: '2023-12-15',
    homeTeam: 'Palmeiras',
    homeLogo: '/team-logos/palmeiras.png',
    awayTeam: 'Flamengo',
    awayLogo: '/team-logos/flamengo.png',
    homeScore: 0,
    awayScore: 0,
    league: 'Brasileirão Série A'
  }
];

// Função para buscar jogos do dia
export const fetchGamesOfTheDay = async (): Promise<Game[]> => {
  try {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retorna dados mockados por enquanto
    // Em produção, você substituiria por uma chamada real à API
    return MOCK_GAMES;
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    // Fallback para dados mockados em caso de erro
    return MOCK_GAMES;
  }
};

// Função para buscar histórico do time
export const fetchTeamHistory = async (teamName: string): Promise<PastGame[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filtra jogos que envolvem o time
    const teamGames = MOCK_HISTORY.filter(game => 
      game.homeTeam === teamName || game.awayTeam === teamName
    );
    
    return teamGames.length > 0 ? teamGames : MOCK_HISTORY;
  } catch (error) {
    console.error('Erro ao buscar histórico do time:', error);
    return MOCK_HISTORY;
  }
};

// Função para buscar confronto direto
export const fetchHeadToHeadHistory = async (homeTeam: string, awayTeam: string): Promise<PastGame[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filtra jogos entre os dois times
    const h2hGames = MOCK_HISTORY.filter(game => 
      (game.homeTeam === homeTeam && game.awayTeam === awayTeam) ||
      (game.homeTeam === awayTeam && game.awayTeam === homeTeam)
    );
    
    return h2hGames.length > 0 ? h2hGames : MOCK_HISTORY;
  } catch (error) {
    console.error('Erro ao buscar confronto direto:', error);
    return MOCK_HISTORY;
  }
};

// Função para análise com IA usando Gemini
export const fetchAiAnalysis = async (game: Game, analysisType: 'quick' | 'deep'): Promise<AiAnalysisResponse> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Chave da API Gemini não configurada');
    }

    // URL da API do Gemini
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const prompt = analysisType === 'quick' 
      ? `Faça uma análise rápida do jogo entre ${game.homeTeam} vs ${game.awayTeam} no campeonato ${game.league}. 
         Considere: forma recente, histórico de confrontos, jogadores importantes. 
         Forneça: vencedor provável, confiança (0-100%), probabilidades (casa, empate, fora), 3 fatores-chave.`
      : `Faça uma análise detalhada e profunda do jogo entre ${game.homeTeam} vs ${game.awayTeam} no campeonato ${game.league}.
         Inclua: análise tática, forma dos times, lesões, momento psicológico, estatísticas históricas, fatores externos.
         Forneça: vencedor provável, confiança (0-100%), probabilidades detalhadas, 5+ fatores-chave, análise detalhada.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: analysisType === 'quick' ? 1024 : 2048,
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro na API Gemini: ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Resposta inválida da API Gemini');
    }

    const analysisText = data.candidates[0].content.parts[0].text;
    
    // Parse da resposta (em produção, você implementaria um parser mais robusto)
    return parseGeminiResponse(analysisText, game, analysisType);
    
  } catch (error) {
    console.error('Erro na análise com IA:', error);
    
    // Fallback para análise mockada em caso de erro
    return getMockAnalysis(game, analysisType);
  }
};

// Função para parsear a resposta do Gemini
const parseGeminiResponse = (text: string, game: Game, analysisType: 'quick' | 'deep'): AiAnalysisResponse => {
  // Implementação básica de parser - em produção você melhoraria isso
  const lines = text.split('\n').filter(line => line.trim());
  
  const mockAnalysis = getMockAnalysis(game, analysisType);
  
  // Tenta extrair informações da resposta
  try {
    const predictedWinner = extractWinner(text) || mockAnalysis.predictedWinner;
    const confidence = extractConfidence(text) || mockAnalysis.confidence;
    const probabilities = extractProbabilities(text) || mockAnalysis.probabilities;
    const keyFactors = extractKeyFactors(text) || mockAnalysis.keyFactors;
    
    return {
      predictedWinner,
      confidence,
      probabilities,
      keyFactors,
      detailedAnalysis: text,
      sources: ['Análise IA Gemini', 'Dados históricos', 'Estatísticas recentes']
    };
  } catch (error) {
    console.error('Erro ao parsear resposta Gemini, usando fallback:', error);
    return mockAnalysis;
  }
};

// Funções auxiliares para parsear a resposta
const extractWinner = (text: string): string | null => {
  const winnerMatches = text.match(/(vencedor|provável|ganhador).*?:.*?([A-Za-zÀ-ÿ\s]+)/i);
  return winnerMatches ? winnerMatches[2].trim() : null;
};

const extractConfidence = (text: string): number | null => {
  const confidenceMatches = text.match(/(confiança|certeza).*?(\d+)%/i);
  return confidenceMatches ? parseInt(confidenceMatches[2]) : null;
};

const extractProbabilities = (text: string): { home: number; away: number; draw: number } | null => {
  const probMatches = text.match(/(casa|home).*?(\d+)%.*(fora|away).*?(\d+)%.*(empate|draw).*?(\d+)%/i);
  if (probMatches) {
    return {
      home: parseInt(probMatches[2]),
      away: parseInt(probMatches[4]),
      draw: parseInt(probMatches[6])
    };
  }
  return null;
};

const extractKeyFactors = (text: string): string[] => {
  const factors: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.match(/\d+\.\s|-\s|\•\s/) && line.length > 10) {
      factors.push(line.replace(/^\d+\.\s|-\s|\•\s/, '').trim());
    }
    if (factors.length >= 5) break;
  }
  
  return factors.length > 0 ? factors : ['Forma recente dos times', 'Histórico de confrontos', 'Fator casa'];
};

// Análise mockada para fallback
const getMockAnalysis = (game: Game, analysisType: 'quick' | 'deep'): AiAnalysisResponse => {
  const isQuick = analysisType === 'quick';
  
  return {
    predictedWinner: game.homeTeam,
    confidence: isQuick ? 65 : 72,
    probabilities: {
      home: isQuick ? 45 : 48,
      away: isQuick ? 30 : 28,
      draw: isQuick ? 25 : 24
    },
    keyFactors: isQuick 
      ? [
          'Fator casa para o time mandante',
          'Histórico positivo em confrontos similares',
          'Momento melhor da equipe da casa'
        ]
      : [
          'Vantagem do fator casa com torcida presente',
          'Desempenho superior no último mês',
          'Lesões no time visitante',
          'Melhor aproveitamento ofensivo',
          'Sistema defensivo mais organizado'
        ],
    detailedAnalysis: isQuick
      ? `Análise rápida: ${game.homeTeam} tem vantagem do fator casa e momento ligeiramente melhor. Expectativa de vitória da equipe mandante com 65% de confiança.`
      : `Análise detalhada: Considerando todos os fatores táticos, históricos e momentâneos, ${game.homeTeam} apresenta vantagem significativa. Sistema defensivo sólido combinado com poder ofensivo deve garantir o resultado positivo. Confiança de 72% na vitória caseira.`,
    sources: ['Análise estatística', 'Dados históricos', 'Forma recente']
  };
};
