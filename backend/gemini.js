import 'dotenv/config';

import { GoogleGenAI } from "@google/genai";

const gemini = process.env.GEMINI_KEY;
const ai = new GoogleGenAI({ apiKey: gemini });

export async function getRecommendations(category, genre, mood, additionalInfo) {
  const result = await ai.models.generateContentStream({
    model: "gemini-3.5-flash",
    contents: `
    Based on the user's preferences, generate *5 personalized recommendations*.
    User Preferences:
    - Category: ${category}
    - Genre: ${genre}
    - Mood: ${mood}
    - Additional Information: ${additionalInfo}

    Requirements:
    1. Recommend exactly *5 items* that best match the user's preferences.
    2. Consider all provided preferences when ranking the recommendations.
    3. If some preferences are missing, make reasonable assumptions based on the available information.
    4. For each recommendation, provide:
      - Title (Must start with a space)
      - Brief explanation (1–2 sentences) describing why it matches the user's preferences. (Must start with a space)
      - imageSearchText: A concise search query that can be used to find a representative image of the recommendation. Must written in lowercase.
    5. Return *only valid JSON* with no markdown, comments, or additional text.

    JSON format:

    {
      "recommendations": [
        {
          "title": "",
          "description": "",
          "imageSearchText": ""
        },
        {
          "title": "",
          "description": "",
          "imageSearchText": ""
        },
        {
          "title": "",
          "description": "",
          "imageSearchText": ""
        },
        {
          "title": "",
          "description": "",
          "imageSearchText": ""
        },
        {
          "title": "",
          "description": "",
          "imageSearchText": ""
        }
      ]
    }
    `,
  });
  return result; 
}

