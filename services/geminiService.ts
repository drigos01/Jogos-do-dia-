// src/api/games.ts
import { GoogleGenAI } from "@google/genai";
import { Game, PastGame, AiAnalysisResponse } from "../types";

// ==========================
// ⚠️ Apenas para teste local
// Não use assim em produção!
// ==========================
const API_KEY = "AIzaSyAYFrvwyF57LT3HoecDgsNXtm1rmxjG5mo";

if (!API_KEY) {
  throw new Error("API_KEY not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Função para extrair JSON do texto da IA
 */
async function parseJsonResponse<T>(text: string): Promise<T> {
  try {
    const trimmed = text.trim();
    const firstChar = trimmed[0];
    const lastChar = trimmed[trimmed.length - 1];

    if ((firstChar === "{" && lastChar === "}") || (firstChar === "[" && lastChar === "]")) {
      return JSON.parse(trimmed) as T;
    }

    const jsonStart = trimmed.indexOf("{") !== -1 ? trimmed.indexOf("{") : trimmed.indexOf("[");
    const jsonEnd = trimmed.lastIndexOf("}") !== -1 ? trimmed.lastIndexOf("}") : trimmed.lastIndexOf("]");
    const jsonString = trimmed.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error("Erro ao processar JSON da IA:", e);
    throw new Error("Resposta da IA inválida.");
  }
}

/**
 * Busca todos os jogos do dia
 */
export async function fetchGamesOfTheDay(): Promise<Game[]> {
  const prompt = `
    Retorne TODOS os jogos de hoje em JSON puro (array).
    Cada jogo deve conter: id, sport, date, homeTeam, homeLogo, awayTeam, awayLogo,
    time, league, homeScore, awayScore, status, elapsedTime, homeStats, awayStats,
    prediction {homeWinPercentage, awayWinPercentage, drawPercentage}, whereToWatch [{name, url}]
    Retorne somente JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const jsonText = response.output_text ?? response.text ?? "";
    return parseJsonResponse<Game[]>(jsonText);
  } catch (error) {
    console.error("Erro ao buscar jogos do dia:", error);
    throw new Error("Não foi possível buscar os jogos do dia.");
  }
}

/**
 * Histórico de jogos
 */
async function fetchHistory(prompt: string): Promise<PastGame[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const jsonText = response.output_text ?? response.text ?? "";
    return parseJsonResponse<PastGame[]>(jsonText);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    throw new Error("Não foi possível buscar o histórico de jogos.");
  }
}

export async function fetchTeamHistory(teamName: string): Promise<PastGame[]> {
  const prompt = `
    Retorne o histórico de jogos do time "${teamName}" no último mês em JSON array.
    Campos: date, homeTeam, homeLogo, awayTeam, awayLogo, homeScore, awayScore, league.
  `;
  return fetchHistory(prompt);
}

export async function fetchHeadToHeadHistory(homeTeam: string, awayTeam: string): Promise<PastGame[]> {
  const prompt = `
    Retorne os últimos 10 confrontos entre "${homeTeam}" e "${awayTeam}" em JSON array.
    Campos: date, homeTeam, homeLogo, awayTeam, awayLogo, homeScore, awayScore, league.
  `;
  return fetchHistory(prompt);
}

/**
 * Análise de IA do jogo
 */
export async function fetchAiAnalysis(game: Game, type: "quick" | "deep"): Promise<AiAnalysisResponse> {
  const instructions = type === "quick"
    ? "Análise concisa baseada nos dados fornecidos."
    : "Análise profunda, incluindo fatores externos e URLs de fontes consultadas.";

  const prompt = `
    Você é analista esportivo de IA.
    Dados do jogo: ${JSON.stringify(game)}
    Instruções: ${instructions}
    Retorne somente JSON no formato:
    {
      "predictedWinner": "string",
      "confidence": number,
      "probabilities": { "home": number, "away": number, "draw": number },
      "keyFactors": ["string", "string", "string"],
      "detailedAnalysis": "string",
      "sources": ["string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const jsonText = response.output_text ?? response.text ?? "";
    return JSON.parse(jsonText) as AiAnalysisResponse;
  } catch (error) {
    console.error("Erro na análise de IA:", error);
    throw new Error("Não foi possível realizar a análise de IA.");
  }
}
