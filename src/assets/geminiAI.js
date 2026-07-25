import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeCrop(crop, symptoms, imageBase64, mimeType) {
  const parts = [
  {
    text: `
You are an expert agricultural AI assistant.

Analyze the uploaded crop image together with the crop name and symptoms.

Crop:
${crop}

Symptoms:
${symptoms}

Provide your answer in this format:

🌱 Disease:
⭐ Confidence:
⚠ Severity:
🦠 Cause:
🔍 Symptoms:
💊 Treatment:
🌿 Organic Treatment:
🧪 Chemical Treatment:
🛡 Prevention:
👨‍🌾 Farmer Advice:

If the uploaded image is unclear, tell the user to upload a clearer image instead of guessing.
`,
  },
];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: imageBase64,
      },
    });
  }

  const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts,
      },
    ],
  });

  return response.text;
}