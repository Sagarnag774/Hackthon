
import { GoogleGenAI, Type } from '@google/genai';
import { Artwork } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const artworkSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    artist: { type: Type.STRING },
    year: { type: Type.STRING, description: "e.g., '1889' or 'c. 1665'" },
    description: { type: Type.STRING, description: "A detailed paragraph about the artwork." },
    style: { type: Type.STRING, description: "e.g., 'Post-Impressionism'" },
    context: { type: Type.STRING, description: "A paragraph about the historical and cultural context." },
    related_works: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          artist: { type: Type.STRING },
        },
        required: ["title", "artist"]
      }
    },
    error: { type: Type.STRING, nullable: true, description: "An error message if artwork is not recognized, otherwise null." }
  },
  required: ["title", "artist", "year", "description", "style", "context", "related_works", "error"]
};


export const identifyArtwork = async (base64ImageData: string): Promise<Artwork> => {
  const prompt = `
    You are an expert art historian. Identify the painting in this image. The artwork might be captured from an angle, with reflections, or in poor lighting, so do your best to identify it.
    Respond with a single JSON object that strictly adheres to the provided schema.
    If you can identify the artwork with high confidence, fill in all the details and set the "error" field to null.
    If you cannot identify the artwork with high confidence, set "title" and "artist" to "Unknown", fill other fields with empty strings or empty arrays, and provide a helpful message in the "error" field like "Artwork not recognized. Please try getting a clearer, more direct shot of the piece."
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64ImageData,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: artworkSchema
      }
    });
    
    const text = response.text;
    const parsedJson = JSON.parse(text);
    
    return { ...parsedJson, scannedImage: base64ImageData } as Artwork;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    
    const errorMessage = error instanceof Error && error.message.includes('SAFETY') 
      ? "The request was blocked due to safety settings. Please try a different image."
      : "There was an issue communicating with the identification service. Please check your connection.";

    return {
      error: errorMessage,
      title: 'Error',
      artist: '',
      year: '',
      description: '',
      style: '',
      context: '',
      related_works: [],
      scannedImage: base64ImageData
    } as Artwork;
  }
};
