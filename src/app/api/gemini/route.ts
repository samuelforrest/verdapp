import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Correct: Use a variable name, not the key itself!
const apiKey = process.env.GEMINI_API_KEY!;

const ai = new GoogleGenAI({ apiKey });

export async function POST(request: NextRequest) {
  console.log("POST request received at /api/gemini");

  try {
    const body = await request.json();
    console.log("Request body:", body);

    const { formData } = body;
    if (!formData) {
      return NextResponse.json(
        { error: "Missing formData" },
        { status: 400 }
      );
    }

    // Construct the prompt including all formData as JSON string
    const prompt = `
Estimate the total lifetime carbon footprint (in tonnes CO2 equivalent) of a person given the following lifestyle data. Provide a clear, concise explanation of your reasoning.

Data:
${JSON.stringify(formData, null, 2)}
`;

    console.log("Calling Gemini API...");

    // Call the Gemini API using your original snippet logic
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log("Gemini response received:", response.text);

    if (response.text) {
      // Return analysis to the user
      return NextResponse.json({ analysis: response.text });
    } else {
      return NextResponse.json(
        { error: "No analysis text returned" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Gemini API call failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}

// Optional GET handler for testing endpoint health
export async function GET() {
  return NextResponse.json({ message: "Gemini API endpoint is working" });
}