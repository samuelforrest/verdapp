// File: src/app/api/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.AIzaSyBarEOGpAPLcm0o8lmRZMBKGzhHeVG6lmc! });

export async function POST(request: NextRequest) {
  console.log("POST request received at /api/gemini");
  
  try {
    const body = await request.json();
    console.log("Request body:", body);
    
    const { formData } = body;
    
    if (!formData) {
      console.log("Missing formData in request");
      return NextResponse.json(
        { error: "Missing formData" }, 
        { status: 400 }
      );
    }

    const prompt = `
Estimate the total lifetime carbon footprint (in tonnes CO2 equivalent) of a person given the following lifestyle data. Provide a clear, concise explanation of your reasoning.

Data:
${JSON.stringify(formData, null, 2)}
`;

    console.log("Calling Gemini API...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log("Gemini response received");

    if (response.text) {
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

// Optional: Add a GET handler for testing
export async function GET() {
  return NextResponse.json({ message: "Gemini API endpoint is working" });
}