import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeCrop(crop, symptoms) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
Crop: ${crop}
Symptoms: ${symptoms}

Give disease name, cause, treatment and prevention.
`,
  });
  console.log(response);

  return response.text;
}