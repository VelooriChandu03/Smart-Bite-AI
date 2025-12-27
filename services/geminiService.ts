
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserProfile, FoodAnalysis, FoodSafetyStatus } from "../types";
import { SYSTEM_PROMPT } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const buildUserContext = (profile: UserProfile) => {
  return `
    USER BIOLOGY & LIFESTYLE:
    - Language for Response: ${profile.language} (CRITICAL: Respond in this language)
    - Name: ${profile.name}
    - Demographics: ${profile.age}yo ${profile.gender}, Blood: ${profile.bloodGroup}
    - Physicals: ${profile.height}, ${profile.weight}, Activity: ${profile.activityLevel}
    - Medical History: ${profile.conditions.join(', ') || 'Clean bill of health'}
    - Current Medications: ${profile.medications || 'None reported'}
    - Dietary Path: ${profile.preference}
    - Mission: ${profile.goal}
  `;
};

export const analyzeFood = async (
  profile: UserProfile,
  imageData?: string,
  foodName?: string
): Promise<FoodAnalysis> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';

  const userContext = buildUserContext(profile);
  const contents: any[] = [];
  
  if (imageData) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageData.split(',')[1]
      }
    });
  }

  const prompt = foodName 
    ? `Analyze "${foodName}". Provide output in ${profile.language}.` 
    : `Identify food. Analyze safety in ${profile.language}.`;

  contents.push({ text: prompt });

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: {
      systemInstruction: SYSTEM_PROMPT + "\n" + userContext + "\nIMPORTANT: All text in the JSON response must be in " + profile.language,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING },
          status: { type: Type.STRING },
          explanation: { type: Type.STRING },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          healthScore: { type: Type.NUMBER },
          alternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["foodName", "status", "explanation", "healthScore", "alternatives", "tips"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const getChatResponse = async (
  profile: UserProfile,
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  const ai = getAI();
  const model = 'gemini-3-flash-preview';
  const userContext = buildUserContext(profile);

  const response = await ai.models.generateContent({
    model,
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: SYSTEM_PROMPT + "\n" + userContext + "\nAlways answer in " + profile.language,
    }
  });

  return response.text || "I'm sorry, I'm unable to process your query at the moment.";
};
