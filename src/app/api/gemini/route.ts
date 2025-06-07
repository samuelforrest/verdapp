import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.AIzaSyBarEOGpAPLcm0o8lmRZMBKGzhHeVG6lmc! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { formData } = req.body;
  if (!formData) {
    return res.status(400).json({ error: "Missing formData" });
  }

  const prompt = `
Estimate the total lifetime carbon footprint (in tonnes CO2 equivalent) of a person given the following lifestyle data. Provide a clear, concise explanation of your reasoning.

Data:
${JSON.stringify(formData, null, 2)}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (response.text) {
      return res.status(200).json({ analysis: response.text });
    } else {
      return res.status(500).json({ error: "No analysis text returned" });
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Gemini API call failed" });
  }
}