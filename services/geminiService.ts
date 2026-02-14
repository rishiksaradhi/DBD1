
import { GoogleGenAI, Type } from "@google/genai";
import { Activity, User, MatchSuggestion } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Custom error class for identifying Quota issues
 */
export class QuotaExhaustedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaExhaustedError";
  }
}

/**
 * Helper to handle retries with exponential backoff for 429/5xx errors.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 4, initialDelay = 3000): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Detailed error status extraction
      let status = error?.status;
      if (!status && error?.error?.code) status = error.error.code;
      if (!status && error?.message?.includes('429')) status = 429;
      
      // If quota is exhausted, we throw a specific error after retries fail
      if (status === 429) {
        if (i < maxRetries) {
          const delay = initialDelay * Math.pow(2, i);
          console.warn(`Gemini Quota Exceeded (429). Retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new QuotaExhaustedError("API Quota Exhausted");
      }
      
      // Handle server errors
      if ((status === 503 || status === 500) && i < maxRetries) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      break;
    }
  }
  throw lastError;
}

/**
 * Local fallback matching logic.
 */
function getLocalFallbackMatches(user: User, activities: Activity[]): MatchSuggestion[] {
  return activities
    .map(activity => {
      let score = 50;
      const userInterests = user.interests.map(i => i.toLowerCase());
      const activityTitle = activity.title.toLowerCase();
      const activityDesc = activity.description.toLowerCase();

      userInterests.forEach(interest => {
        if (activityTitle.includes(interest) || activityDesc.includes(interest)) {
          score += 25;
        }
      });

      if (activity.category === 'Study' && (userInterests.some(i => i.includes('study') || i.includes('learn')) || activityDesc.includes(user.major.toLowerCase()))) {
        score += 15;
      }
      
      if (activity.category === 'Projects' && userInterests.some(i => i.includes('code') || i.includes('dev') || i.includes('hack'))) {
        score += 20;
      }

      return {
        activityId: activity.id,
        reason: "Matched based on your profile specialization and major.",
        compatibilityScore: Math.min(score, 95)
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, 3);
}

export async function getSmartMatches(user: User, activities: Activity[]): Promise<MatchSuggestion[]> {
  try {
    return await withRetry(async () => {
      const ai = getAIClient();
      const prompt = `
        Analyze for student interaction matching:
        User: Major ${user.major}, Interests ${user.interests.join(", ")}
        Activities: ${activities.map(a => `ID: ${a.id}, Title: ${a.title}, Desc: ${a.description}`).join("; ")}
        Return JSON array of Suggestions {activityId, reason, compatibilityScore}.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                activityId: { type: Type.STRING },
                reason: { type: Type.STRING },
                compatibilityScore: { type: Type.NUMBER },
              },
              required: ["activityId", "reason", "compatibilityScore"],
            }
          }
        }
      });

      return JSON.parse(response.text || "[]");
    });
  } catch (error) {
    if (error instanceof QuotaExhaustedError) {
      // Re-throw so App.tsx can detect quota exhaustion
      throw error;
    }
    return getLocalFallbackMatches(user, activities);
  }
}

export async function getQuickGreeting(user: User): Promise<string> {
  try {
    return await withRetry(async () => {
      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Welcome ${user.name} to Campus Connect. Short, cool, high-energy (max 5 words).`,
      });
      return response.text?.trim() || `Welcome, ${user.name.split(' ')[0]}!`;
    });
  } catch (error) {
    if (error instanceof QuotaExhaustedError) throw error;
    return `Welcome to the pulse, ${user.name.split(' ')[0]}!`;
  }
}
