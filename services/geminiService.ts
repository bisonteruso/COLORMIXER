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
 * Generates color mixing instructions using the Gemini API.
 * @param color The target color in hex format (e.g., "#FF5733").
 * @returns A promise that resolves to a string with mixing instructions.
 */
export async function getMixingInstructions(color: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
      throw new Error("La clave API de Gemini no está configurada. Por favor, asegúrate de que la variable de entorno API_KEY esté correctamente establecida.");
  }
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
    
    return response.text;

  } catch (error) {
    console.error("Error fetching mixing instructions from Gemini API:", error);
    // Rethrow the error to be handled by the component that called this service.
    throw error;
  }
}