
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

export const getEquipmentDescription = async (equipmentName: string): Promise<string> => {
  if (!ai) {
    return new Promise(resolve => setTimeout(() => resolve(`This is a placeholder description for a ${equipmentName}. It is an essential piece of equipment used in many modern laboratories for various scientific purposes. Its precise function depends on the context of the experiment being conducted. Please configure your Gemini API key to see a real description.`), 500));
  }
  
  try {
    const prompt = `Provide a concise, single-paragraph description for a "${equipmentName}" used in a laboratory. Focus on its main function and common applications. Do not use markdown formatting.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching description from Gemini API:", error);
    return "Could not load description. Please check if your API key is valid or try again later.";
  }
};
