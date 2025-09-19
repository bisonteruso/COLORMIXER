import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      colorName: {
        type: Type.STRING,
        description: "Nombre del color base a mezclar (ej. 'Amarillo', 'Rojo', 'Blanco')."
      },
      colorHex: {
        type: Type.STRING,
        description: "El código hexadecimal del color base (ej. '#FFFF00')."
      },
      parts: {
        type: Type.INTEGER,
        description: "La proporción numérica o 'partes' de este color en la mezcla."
      }
    },
    required: ["colorName", "colorHex", "parts"]
  }
};


/**
 * Generates color mixing instructions using the Gemini API, with local caching.
 * @param color The target color in hex format (e.g., "#FF5733").
 * @returns A promise that resolves to a string with mixing instructions.
 */
export async function getMixingInstructions(color: string): Promise<string> {
  const apiKey = process.env.API_KEY;

  // 1. If no API Key, return mock data immediately. This prevents the app from crashing.
  if (!apiKey) {
      console.warn(`
        ************************************************************************************************
        ** ADVERTENCIA: La clave API de Gemini no está configurada.                                     **
        **                                                                                            **
        ** La aplicación está utilizando datos de demostración para la guía de mezcla.                 **
        ** Para obtener resultados reales, configura la variable de entorno API_KEY en tu entorno.    **
        ************************************************************************************************
      `);
      // Return mock data after a short delay to simulate a network request
      return new Promise(resolve => {
        setTimeout(() => {
          const mockRecipe = [
            { colorName: 'Rojo', colorHex: '#FF0000', parts: 1 },
            { colorName: 'Amarillo', colorHex: '#FFFF00', parts: 2 },
            { colorName: 'Blanco', colorHex: '#FFFFFF', parts: 1 },
          ];
          resolve(JSON.stringify(mockRecipe));
        }, 800);
      });
  }
  
  // 2. API Key exists, proceed with caching and fetching logic.
  const cacheKey = 'chromamix_recipes_cache';

  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const cache = JSON.parse(cachedData);
      if (cache[color]) {
        console.log(`Cache hit for ${color}. Returning cached data.`);
        return Promise.resolve(cache[color]);
      }
    }
  } catch (e) {
    console.warn("Could not read from cache:", e);
  }

  console.log(`Cache miss for ${color}. Fetching from API.`);
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash';

  const prompt = `
    Actúa como un experto maestro de arte especializado en teoría del color.
    Tu tarea es crear una "receta de color" para que un pintor principiante mezcle el color con el código hexadecimal ${color} usando pintura.
    El pintor solo tiene acceso a los colores primarios (Rojo: #FF0000, Amarillo: #FFFF00, Azul: #0000FF), además de Blanco (#FFFFFF) y Negro (#000000).

    Debes devolver una receta visual en formato JSON basada en el esquema proporcionado. La receta debe ser una lista de los colores base y sus proporciones (partes).
    
    Por ejemplo, para obtener un naranja, la receta podría ser 2 partes de amarillo y 1 parte de rojo.
    Para un verde oscuro, podría ser 3 partes de amarillo, 2 partes de azul y 1 parte de negro.

    Sé preciso con las proporciones para acercarte lo más posible al color objetivo ${color}.
    La respuesta debe ser únicamente el array JSON.
    `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
    
    const instructions = response.text;

    // Save the new data to cache
    try {
      const cachedData = localStorage.getItem(cacheKey);
      const cache = cachedData ? JSON.parse(cachedData) : {};
      cache[color] = instructions;
      localStorage.setItem(cacheKey, JSON.stringify(cache));
      console.log(`Saved new recipe for ${color} to cache.`);
    } catch (e) {
      console.warn("Could not save to cache:", e);
    }

    return instructions;

  } catch (error) {
    console.error("Error fetching mixing instructions from Gemini API:", error);
    if (error instanceof Error) {
        // Intercept specific, common API errors and re-throw with a user-friendly message.
        if (error.message.includes('PERMISSION_DENIED') || error.message.includes('API key not valid')) {
            throw new Error('Error de Permiso: Tu clave de API no es válida o no tiene los permisos necesarios. Por favor, verifica tu configuración.');
        }
    }
    // For other errors, or if it's not an Error instance, re-throw a generic message.
    throw new Error('No se pudo generar la receta. La API devolvió un error inesperado.');
  }
}