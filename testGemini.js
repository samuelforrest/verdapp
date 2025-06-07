import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.AIzaSyBarEOGpAPLcm0o8lmRZMBKGzhHeVG6lmc; // Use environment variable for security

const ai = new GoogleGenAI({ apiKey });

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Estimate the total lifetime carbon footprint of a person given the lifestyle data.",
    });
    console.log("Gemini response:", response.text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

main();