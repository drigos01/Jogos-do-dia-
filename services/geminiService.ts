// src/api/games.ts
import { GoogleGenAI } from "@google/genai";
import { Game, PastGame, AiAnalysisResponse } from "../types";

// ⚠️ REMOVA A CHAVE DAQUI!
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY não encontrada nas variáveis de ambiente");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Função para extrair JSON do texto da IA
 */
async function parseJsonResponse<T>(text: string): Promise<T> {
  try {
    const trimmed = text.trim();
    const jsonStart = Math.max(
      trimmed.indexOf("{"),
      trimmed.indexOf("[")
    );
    
    if (jsonStart === -1) {
      throw new Error("Nenhum JSON encontrado na resposta");
    }

    const jsonEnd = Math.max(
      trimmed.lastIndexOf("}"),
      trimmed.lastIndexOf("]")
    ) + 1;

    const jsonString = trimmed.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error("Erro ao processar JSON:", e);
    console.error("Texto recebido:", text);
    throw new Error("Resposta da IA em formato inválido");
  }
}

/**
 * Busca todos os jogos do dia - Versão com dados mockados para teste
 */
export async function fetchGamesOfTheDay(): Promise<Game[]> {
  // Primeiro, tente usar a API real
  try {
    const prompt = `
      Gere dados REALISTAS de jogos de futebol para hoje no Brasil.
      Inclua times brasileiros reais como Flamengo, Palmeiras, São Paulo, Corinthians, etc.
      Retorne um array JSON com 4-6 jogos em diferentes status (SCHEDULED, LIVE, FINISHED).
      Formato exato:
      [{
        "id": "string",
        "sport": "Futebol",
        "date": "2024-01-15",
        "homeTeam": "string",
        "homeLogo": "",
        "awayTeam": "string", 
        "awayLogo": "",
        "time": "16:00",
        "league": "Brasileirão Série A",
        "homeScore": number|null,
        "awayScore": number|null,
        "status": "SCHEDULED"|"LIVE"|"FINISHED",
        "elapsedTime": number|null,
        "prediction": {
          "homeWinPercentage": number,
          "awayWinPercentage": number, 
          "drawPercentage": number
        },
        "whereToWatch": [{"name": "string", "url": "string"}]
      }]
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Use flash que é mais rápido
      contents: prompt,
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Resposta vazia da API");
    }

    return parseJsonResponse<Game[]>(jsonText);
  } catch (error) {
    console.error("Erro na API Gemini, usando dados mockados:", error);
    // Fallback para dados mockados
    return getMockedGames();
  }
}

// Dados mockados realistas como fallback
function getMockedGames(): Game[] {
  return [
    {
      id: '1',
      sport: 'Futebol',
      date: '2024-01-15',
      homeTeam: 'Flamengo',
      homeLogo: '',
      awayTeam: 'Palmeiras',
      awayLogo: '',
      time: '16:00',
      league: 'Brasileirão Série A',
      homeScore: null,
      awayScore: null,
      status: 'SCHEDULED',
      elapsedTime: null,
      prediction: {
        homeWinPercentage: 48,
        awayWinPercentage: 32,
        drawPercentage: 20
      },
      whereToWatch: [
        { name: 'Premiere', url: 'https://premiere.globo.com' }
      ]
    },
    {
      id: '2',
      sport: 'Futebol',
      date: '2024-01-15',
      homeTeam: 'São Paulo',
      homeLogo: '',
      awayTeam: 'Corinthians',
      awayLogo: '',
      time: '19:00',
      league: 'Brasileirão Série A',
      homeScore: 2,
      awayScore: 1,
      status: 'FINISHED',
      elapsedTime: 90,
      prediction: {
        homeWinPercentage: 42,
        awayWinPercentage: 38,
        drawPercentage: 20
      },
      whereToWatch: [
        { name: 'SporTV', url: 'https://sportv.globo.com' }
      ]
    },
    {
      id: '3',
      sport: 'Futebol',
      date: '2024-01-15',
      homeTeam: 'Grêmio',
      homeLogo: '',
      awayTeam: 'Internacional',
      awayLogo: '',
      time: '21:30',
      league: 'Brasileirão Série A',
      homeScore: 1,
      awayScore: 1,
      status: 'LIVE',
      elapsedTime: 65,
      prediction: {
        homeWinPercentage: 35,
        awayWinPercentage: 35,
        drawPercentage: 30
      },
      whereToWatch: [
        { name: 'TV Globo', url: 'https://globo.com' }
      ]
    }
  ];
}

/**
 * Histórico de jogos
 */
async function fetchHistory(prompt: string): Promise<PastGame[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Resposta vazia da API");
    }

    return parseJsonResponse<PastGame[]>(jsonText);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    // Fallback para histórico mockado
    return [
      {
        date: '2024-01-10',
        homeTeam: 'Flamengo',
        homeLogo: '',
        awayTeam: 'Palmeiras',
        awayLogo: '',
        homeScore: 2,
        awayScore: 1,
        league: 'Brasileirão Série A'
      },
      {
        date: '2024-01-05',
        homeTeam: 'Palmeiras',
        homeLogo: '',
        awayTeam: 'Flamengo',
        awayLogo: '',
        homeScore: 1,
        awayScore: 1,
        league: 'Brasileirão Série A'
      }
    ];
  }
}

export async function fetchTeamHistory(teamName: string): Promise<PastGame[]> {
  const prompt = `
    Gere histórico REALISTA dos últimos 5 jogos do time ${teamName}.
    Inclua vitórias, derrotas e empates variados.
    Retorne array JSON com: date, homeTeam, homeLogo, awayTeam, awayLogo, homeScore, awayScore, league.
  `;
  return fetchHistory(prompt);
}

export async function fetchHeadToHeadHistory(homeTeam: string, awayTeam: string): Promise<PastGame[]> {
  const prompt = `
    Gere os últimos 5 confrontos REALISTAS entre ${homeTeam} e ${awayTeam}.
    Inclua resultados variados.
    Retorne array JSON com: date, homeTeam, homeLogo, awayTeam, awayLogo, homeScore, awayScore, league.
  `;
  return fetchHistory(prompt);
}

/**
 * Análise de IA do jogo
 */
export async function fetchAiAnalysis(game: Game, type: "quick" | "deep"): Promise<AiAnalysisResponse> {
  try {
    const analysisType = type === "quick" ? "análise concisa" : "análise detalhada com fatores táticos e estatísticos";
    
    const prompt = `
      Faça uma ${analysisType} do jogo entre ${game.homeTeam} vs ${game.awayTeam}.
      
      Dados do jogo: ${JSON.stringify(game)}
      
      Retorne JSON no formato:
      {
        "predictedWinner": "Nome do time ou 'EMPATE'",
        "confidence": número entre 0-100,
        "probabilities": { "home": número, "away": número, "draw": número },
        "keyFactors": ["fator1", "fator2", "fator3"],
        "detailedAnalysis": "texto detalhado da análise",
        "sources": ["Análise baseada em dados fornecidos"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Resposta vazia da API");
    }

    return parseJsonResponse<AiAnalysisResponse>(jsonText);
  } catch (error) {
    console.error("Erro na análise de IA:", error);
    throw new Error("Não foi possível realizar a análise de IA no momento.");
  }
}
