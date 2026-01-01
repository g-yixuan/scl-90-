import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentResult, AIAnalysisResponse } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeAssessment = async (result: AssessmentResult): Promise<AIAnalysisResponse | null> => {
  const ai = getClient();
  if (!ai) return null;

  const factorSummary = result.factorResults
    .filter(f => f.averageScore >= 2) // Focus on significant factors
    .map(f => `${f.factorName} (分数: ${f.averageScore.toFixed(2)})`)
    .join(', ');

  const prompt = `
    Role: You are a compassionate, professional psychological counselor at "Soul Rest Station" (心灵小憩补给站).
    
    Context:
    A user has completed the SCL-90 assessment.
    
    User Stats:
    - Global Severity Index: ${result.globalSeverityIndex.toFixed(2)} (Norm is usually < 1.5)
    - Positive Factors (Score >= 2): ${factorSummary || "None, user is in good state."}
    
    Task:
    Provide a warm, non-judgmental, and empathetic analysis in JSON format.
    The tone should be healing, calming (Morandi style), and de-stigmatizing.
    Avoid harsh medical jargon. Use metaphors like "emotional weather".
    
    IMPORTANT:
    All output MUST be in Simplified Chinese (简体中文). 
    Ensure the language is natural, warm, and culturally appropriate for a Chinese audience.
    
    If the scores are high, suggest professional help gently but firmly as a "next step" rather than a diagnosis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A brief 1-sentence overview of their state in Simplified Chinese." },
            empatheticMessage: { type: Type.STRING, description: "A warm paragraph interpreting the feelings in Simplified Chinese." },
            suggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 simple, actionable relaxation or coping tips in Simplified Chinese."
            },
            crisisWarning: { type: Type.BOOLEAN, description: "True if scores indicate severe distress needing immediate help." }
          },
          required: ["summary", "empatheticMessage", "suggestions"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResponse;
    }
    return null;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Return a fallback or null to let the UI handle it
    return null;
  }
};