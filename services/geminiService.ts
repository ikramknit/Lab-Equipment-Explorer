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

const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" style="background-color:#374151;"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24px" fill="#d1d5db">3D Model Generation Disabled</text><text x="50%" y="55%" dy="1.2em" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16px" fill="#9ca3af">API Key Not Configured</text></svg>`;
// btoa is a browser function, available in this context.
const placeholderImageUrl = `data:image/svg+xml;base64,${btoa(placeholderSvg)}`;


export const generateEquipmentImage = async (equipmentName: string): Promise<string> => {
    if (!ai) {
      return Promise.resolve(placeholderImageUrl);
    }
  
    try {
      const prompt = `A photorealistic 3D render of a single "${equipmentName}" on a clean, white studio background. The equipment should be the main focus of the image. Professional product photography style.`;
  
      const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '4:3',
          },
      });
      
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } catch (error) {
      console.error("Error generating image from Gemini API:", error);
      // Re-throwing to be handled by the component
      throw new Error("Could not generate image. Please check if your API key is valid or try again later.");
    }
  };
