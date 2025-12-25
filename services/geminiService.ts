
import { GoogleGenAI, Type } from "@google/genai";
import { ProcessingResult } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVideoContent = async (
  videoData: { name: string; size: number; type: string; duration: number },
  userPrompt: string = ""
): Promise<ProcessingResult> => {
  // Use gemini-3-pro-preview for complex reasoning tasks like viral strategy analysis
  const targetDuration = videoData.duration / 4;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze this video metadata and generate a viral highlight strategy.
    Video Name: ${videoData.name}
    Original Duration: ${videoData.duration}s
    Target Short Duration: ${targetDuration}s
    Context/Prompt: ${userPrompt}
    
    The goal is to extract the top 25% of the most engaging content.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          viralScore: { type: Type.NUMBER },
          platforms: {
            type: Type.OBJECT,
            properties: {
              youtube: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "tags"]
              },
              tiktok: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["caption", "tags"]
              }
            },
            required: ["youtube", "tiktok"]
          },
          highlightSegments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                start: { type: Type.NUMBER },
                end: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["start", "end", "description"]
            }
          }
        },
        required: ["title", "description", "hashtags", "viralScore", "platforms", "highlightSegments"]
      }
    }
  });

  // Accessing response.text as a property (correct usage)
  const result = JSON.parse(response.text || "{}") as ProcessingResult;
  return {
    ...result,
    originalDuration: videoData.duration,
    targetDuration: targetDuration
  };
};
