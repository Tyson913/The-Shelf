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
      - Title
      - Brief explanation (1–2 sentences) describing why it matches the user's preferences.
      - creator: the artist (music), director/studio (movie, series, anime), or developer (game). Leave "" if not applicable (e.g. acads, lifestyle).
      - year: the release year, as a 4-digit string. Leave "" if unknown or not applicable.
      - type: only for category "movie-series" — either "movie" or "tv". Leave "" for all other categories.
    5. Use the creator/year/type fields to disambiguate titles that could be confused with something else of the same name (e.g. a remake, a same-titled song by a different artist, a movie vs. a TV series).
    6. Return *only valid JSON* with no markdown, comments, or additional text.
    JSON format:
    {
      "recommendations": [
        {
          "title": "",
          "description": "",
          "creator": "",
          "year": "",
          "type": ""
        },
        {
          "title": "",
          "description": "",
          "creator": "",
          "year": "",
          "type": ""
        },
        {
          "title": "",
          "description": "",
          "creator": "",
          "year": "",
          "type": ""
        },
        {
          "title": "",
          "description": "",
          "creator": "",
          "year": "",
          "type": ""
        },
        {
          "title": "",
          "description": "",
          "creator": "",
          "year": "",
          "type": ""
        }
      ]
    }
    `,
  });
  return result; 
}