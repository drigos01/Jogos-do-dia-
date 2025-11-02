// src/api/games.ts
import { GoogleGenAI } from "@google/genai";
import { Game, PastGame, AiAnalysisResponse } from "../types";

// Pegando a chave de API de forma segura via variável de ambiente
const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

// Inicializa o cliente da Gemini AI
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Tenta extrair JSON de um texto da IA
 */
async function parseJsonResponse<T>(text: string): Promise<T> {
  try {
    // Remove espaços em excesso e possíveis explicações antes/depois do JSON
    const trimmed = text.trim();

    // Detecta se começa com '[' ou '{'
    const firstChar = trimmed[0];
    const lastChar = trimmed[trimmed.length - 1];

    if ((firstChar === "{" && lastChar === "}") || (firstChar === "[" && lastChar === "]")) {
      return JSON.parse(trimmed) as T;
    }

    // Caso haja algum texto antes ou depois do JSON
    const jsonStart = trimmed.indexOf("{") !== -1 ? trimmed.indexOf("{") : trimmed.indexOf("[");
    const jsonEnd = trimmed.lastIndexOf("}") !== -1 ? trimmed.lastIndexOf("}") : trimmed.lastIndexOf("]");

    const jsonString = trimmed.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error("Falha ao processar JSON da API:", e);
    throw new Error("A resposta da IA não pôde ser interpretada como JSON válido.");
  }
}

/**
 * Busca todos os jogos do dia (exemplo usando IA, mas recomenda-se API esportiva real)
 */
export async function fetchGamesOfTheDay(): Promise<Game[]> {
  const prompt = `
    Retorne TODOS os jogos de hoje em formato JSON puro como um array.
    Cada jogo deve ter:
    {
      "id": "string",
      "sport": "Futebol | Basquete | Tênis ...",
      "date": "AAAA-MM-DD",
      "homeTeam": "string",
      "homeLogo": "URL ou null",
      "awayTeam": "string",
      "awayLogo": "URL ou null",
      "time": "horário ou status",
      "league": "string",
      "homeScore": number|null,
      "awayScore": number|null,
      "status": "SCHEDULED|LIVE|FINISHED|POSTPONED",
      "elapsedTime": number|null,
      "homeStats": object|null,
      "awayStats": object|null,
      "prediction": {
        "homeWinPercentage": number,
        "awayWinPercentage": number,
        "drawPercentage": number|null
      },
      "whereToWatch": [{"name": "string", "url": "string|null"}]
    }
    Retorne somente o JSON, sem explicações.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    // Use output_text (ou ajuste se sua SDK for diferente)
    const jsonText = response.output_text ?? response.text ?? "";
    return parseJsonResponse<Game[]>(jsonText);
  } catch (error) {
    console.error("Erro ao buscar jogos do dia:", error);
    throw new Error("Não foi possível buscar os jogos do dia.");
  }
}

/**
 * Busca histórico de jogos passado usando a IA
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
    Retorne o histórico de jogos do time "${teamName}" no último mês em formato JSON array.
    Cada objeto deve ter: date, homeTeam, homeLogo, awayTeam, awayLogo, homeScore, awayScore, league.
  `;
  return fetchHistory(prompt);
}

export async function fetchHeadToHeadHistory(homeTeam: string, awayTeam: string): Promise<PastGame[]> {
  const prompt = `
    Retorne os últimos 10 confrontos entre "${homeTeam}" e "${awayTeam}" em JSON array.
    Cada objeto: date, homeTeam, homeLogo, awayTeam, awayLogo, homeScore, awayScore, league.
  `;
  return fetchHistory(prompt);
}

/**
 * Faz análise de IA detalhada do jogo
 */
export async function fetchAiAnalysis(game: Game, type: "quick" | "deep"): Promise<AiAnalysisResponse> {
  const instructions = type === "quick"
    ? "Análise concisa baseada nos dados fornecidos."
    : "Análise profunda, incluindo fatores externos e fontes, listando URLs consultadas.";

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
