
import { GoogleGenAI } from "@google/genai";
import { Game, PastGame, AiAnalysisResponse } from '../types';

const API_KEY = process.env.jogosdodia;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function parseJsonResponse<T>(text: string): Promise<T> {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const arrayStart = text.indexOf('[');
    const arrayEnd = text.lastIndexOf(']');

    if ((jsonStart === -1 || jsonEnd === -1) && (arrayStart === -1 || arrayEnd === -1)) {
        console.error("Invalid response format from API: No JSON object or array found", text);
        throw new Error("A API retornou um formato de dados inválido.");
    }

    let jsonString: string;
    if (arrayStart !== -1 && (arrayStart < jsonStart || jsonStart === -1)) {
        // It's an array
        jsonString = text.substring(arrayStart, arrayEnd + 1);
    } else {
        // It's an object
        jsonString = text.substring(jsonStart, jsonEnd + 1);
    }

    try {
      const parsedData = JSON.parse(jsonString);
      return parsedData as T;
    } catch (e) {
      console.error("Failed to parse JSON:", e, "--- Original string was:", jsonString);
      throw new Error("Falha ao processar a resposta da API. O formato do JSON é inválido.");
    }
}

export async function fetchGamesOfTheDay(): Promise<Game[]> {
  const prompt = `
    Sua tarefa principal é atuar como um agregador de dados esportivos. Forneça uma lista o mais completa e EXAUSTIVA possível com absolutamente TODOS os jogos do dia de hoje de uma vasta gama de esportes populares (futebol, basquete, tênis, vôlei, e-sports, MMA, hóquei, futebol americano, etc.), incluindo ligas principais e também as menores.

    Para cada jogo, você deve consultar e sintetizar informações de pelo menos 10 sites diferentes de apostas esportivas e análise para calcular uma probabilidade de resultado.

    Forneça as seguintes informações em formato JSON:
    - "id": um identificador único para o jogo (ex: 'futebol-brasileirao-FLAvsCOR-20241026')
    - "sport": O nome do esporte (ex: 'Futebol', 'Basquete', 'Tênis')
    - "date": A data do jogo no formato AAAA-MM-DD.
    - "homeTeam": Nome do time/jogador da casa
    - "homeLogo": URL da imagem do logo. REQUISITO EXTREMAMENTE CRÍTICO: A URL DEVE ser um link direto para um arquivo de imagem (extensões .png, .svg, .webp). A URL NUNCA PODE SER de uma página web (HTML), um link de busca ou um data URI. Faça uma busca rigorosa por logos oficiais. Se após uma busca exaustiva não encontrar um link DIRETO para o arquivo de imagem, use null. NÃO INVENTE URLs. Exemplo VÁLIDO: 'https://ssl.gstatic.com/onebox/media/sports/logos/z49oKj2Vj54u3WU9vK2s_g_96x96.png'. Exemplo INVÁLIDO: 'https://www.google.com/search?q=logo'.
    - "awayTeam": Nome do time/jogador visitante
    - "awayLogo": URL da imagem do logo (seguindo o mesmo REQUISITO CRÍTICO acima).
    - "time": Se 'SCHEDULED', o horário (ex: '21:30'). Se 'LIVE', o status atual (ex: '45+2', 'Intervalo', 'Q3 5:12'). Se 'FINISHED', 'Encerrado'.
    - "league": Nome do campeonato ou torneio
    - "homeScore": Placar do time da casa
    - "awayScore": Placar do time visitante
    - "status": 'SCHEDULED', 'LIVE', 'FINISHED', ou 'POSTPONED'
    - "elapsedTime": Apenas para futebol, o tempo em minutos (ex: 46). Para outros, use null.
    - "homeStats": Objeto com estatísticas para o time da casa.
    - "awayStats": Objeto com estatísticas para o time visitante.
    - "prediction": Um objeto com a probabilidade de resultado baseada na sua análise agregada. Deve conter: { "homeWinPercentage": number, "awayWinPercentage": number, "drawPercentage": number }. Os valores devem ser a média das probabilidades encontradas nos sites consultados. A soma deve ser próxima de 100. Se o esporte não permite empate (ex: Tênis), "drawPercentage" deve ser 0 ou null.
    - "whereToWatch": um array de objetos, onde cada objeto tem "name" (o nome do canal/serviço, ex: 'ESPN', 'Star+') e "url" (o link direto para a transmissão online, se aplicável e disponível). Se não for online, o campo "url" deve ser null. Se não houver informação de transmissão, retorne um array vazio [].

    Se uma informação como placar ou estatística não estiver disponível ou o jogo não tiver começado, use null. No entanto, para jogos com status 'LIVE' ou 'FINISHED', o fornecimento de estatísticas detalhadas é OBRIGATÓRIO, sempre que os dados existirem. Forneça estatísticas relevantes para cada esporte.

    O objeto de estatísticas pode conter: "fouls", "yellowCards", "redCards", "possession", "shotsOnGoal", "totalShots", "corners", "offsides", etc.

    A resposta DEVE ser um array JSON puro, começando com '[' e terminando com ']'. Não inclua texto ou formatação markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return parseJsonResponse<Game[]>(response.text);

  } catch (error) {
    console.error('Error fetching data from Gemini API:', error);
    throw new Error('Não foi possível buscar os jogos. Verifique sua conexão ou a chave da API.');
  }
}

async function fetchHistory(prompt: string): Promise<PastGame[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return parseJsonResponse<PastGame[]>(response.text);
  } catch (error) {
    console.error('Error fetching history from Gemini API:', error);
    throw new Error('Não foi possível buscar o histórico de jogos.');
  }
}

export async function fetchTeamHistory(teamName: string): Promise<PastGame[]> {
  const prompt = `
    Forneça o histórico de jogos do time "${teamName}" do último mês.
    A resposta DEVE ser um array JSON puro de objetos, onde cada objeto representa um jogo e contém os seguintes campos:
    - "date": Data do jogo (ex: "25/09/2024")
    - "homeTeam": Nome do time da casa
    - "homeLogo": URL da imagem do logo do time da casa. REQUISITO CRÍTICO: Use a mesma lógica rigorosa para encontrar logos que a busca principal de jogos: link direto para um arquivo de imagem (.png, .svg), não uma página web. Se não encontrar, use null.
    - "awayTeam": Nome do time visitante
    - "awayLogo": URL da imagem do logo do time visitante (seguindo o mesmo requisito crítico).
    - "homeScore": Placar do time da casa.
    - "awayScore": Placar do time visitante.
    - "league": Nome do campeonato.

    Se não houver jogos no último mês, retorne um array vazio [].
    A resposta DEVE começar com '[' e terminando com ']'. Não inclua nenhum outro texto.
  `;
  return fetchHistory(prompt);
}

export async function fetchHeadToHeadHistory(homeTeam: string, awayTeam: string): Promise<PastGame[]> {
  const prompt = `
    Forneça o histórico dos últimos 10 confrontos diretos (Head-to-Head) entre "${homeTeam}" e "${awayTeam}".
    A resposta DEVE ser um array JSON puro de objetos, ordenado do mais recente para o mais antigo, onde cada objeto representa um jogo e contém os seguintes campos:
    - "date": Data do jogo (ex: "25/09/2024")
    - "homeTeam": Nome do time da casa
    - "homeLogo": URL da imagem do logo do time da casa. REQUISITO CRÍTICO: Use a mesma lógica rigorosa para encontrar logos que a busca principal de jogos: link direto para um arquivo de imagem (.png, .svg), não uma página web. Se não encontrar, use null.
    - "awayTeam": Nome do time visitante
    - "awayLogo": URL da imagem do logo do time visitante (seguindo o mesmo requisito crítico).
    - "homeScore": Placar do time da casa.
    - "awayScore": Placar do time visitante.
    - "league": Nome do campeonato.
    
    Se não houver histórico de confrontos, retorne um array vazio [].
    A resposta DEVE começar com '[' e terminando com ']'. Não inclua nenhum outro texto.
  `;
  return fetchHistory(prompt);
}

export async function fetchAiAnalysis(game: Game, type: 'quick' | 'deep'): Promise<AiAnalysisResponse> {
    const analysisInstructions = type === 'quick' 
    ? "Sua análise deve ser concisa, baseada principalmente nos dados fornecidos e em conhecimentos gerais. Não precisa buscar fontes externas."
    : "Sua análise deve ser PROFUNDA. Você DEVE buscar informações externas e em tempo real (notícias de lesões, momento da equipe, táticas) para enriquecer sua análise. É OBRIGATÓRIO listar as URLs das fontes que você usou.";

    const prompt = `
        Você é um analista esportivo de IA de elite. Sua tarefa é realizar uma análise detalhada do jogo abaixo e retornar sua conclusão em um formato JSON ESTRITO.

        Dados Base do Jogo:
        ${JSON.stringify(game, null, 2)}

        Instruções de Análise:
        ${analysisInstructions}

        A resposta DEVE ser um único objeto JSON com a seguinte estrutura:
        {
          "predictedWinner": "Nome do Time Vencedor ou 'Empate'",
          "confidence": um número de 0 a 100 representando sua confiança na previsão,
          "probabilities": { "home": number, "away": number, "draw": number },
          "keyFactors": [
            "Um fator chave que influenciou sua decisão.",
            "Outro fator importante.",
            "Um terceiro ponto relevante."
          ],
          "detailedAnalysis": "Um parágrafo com sua análise textual completa, explicando o raciocínio por trás da previsão.",
          "sources": [
            "URL da fonte 1 (se aplicável, especialmente para análise profunda)",
            "URL da fonte 2",
            ...
          ]
        }
        
        Não inclua nenhum texto, explicação ou markdown fora do objeto JSON. A resposta deve começar com '{' e terminar com '}'.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more powerful model for better analysis
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            }
        });
        
        // The API with responseMimeType should return a clean JSON string
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AiAnalysisResponse;
    } catch (error) {
        console.error('Error fetching analysis from Gemini API:', error);
        throw new Error('Não foi possível realizar a análise de IA.');
    }
}
