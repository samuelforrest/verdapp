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

    // Construct the prompt for structured JSON output
    const prompt = `
You are a carbon footprint analyst. Based on the following lifestyle data, provide a comprehensive carbon footprint analysis.

IMPORTANT: You must respond with ONLY valid JSON in the exact format specified below. Do not include any other text, explanations, or markdown formatting.

Required JSON format:
{
  "totalCO2Lifetime": [number in tonnes CO2],
  "percentAboveAverage": [percentage number, can be negative if below average],
  "topContributors": ["contributor 1", "contributor 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}

Guidelines for analysis:
- Calculate total lifetime CO2, working out their life expectancy from their region / country.
- Compare to global average of 4.8 tons per person in the world (according to worldometer)
- Top contributors should be the 2 biggest sources of carbon emissions from their lifestyle
- Recommendations should be specific, actionable steps they can take
- Base calculations on realistic emission factors for transportation, energy, food, etc.

User's lifestyle data:
${JSON.stringify(formData, null, 2)}

Respond with ONLY the JSON object:`;

    console.log("Calling Gemini API...");

    // Call the Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log("Gemini response received:", response.text);

    if (response.text) {
      try {
        // Parse the JSON response from Gemini
        const cleanedResponse = response.text.trim();
        console.log("Cleaned response:", cleanedResponse);
        
        // Remove any potential markdown formatting
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;
        
        const analysisData = JSON.parse(jsonString);
        
        // Validate the required fields
        if (
          typeof analysisData.totalCO2Lifetime !== 'number' ||
          typeof analysisData.percentAboveAverage !== 'number' ||
          !Array.isArray(analysisData.topContributors) ||
          !Array.isArray(analysisData.recommendations) ||
          analysisData.topContributors.length !== 2 ||
          analysisData.recommendations.length !== 3
        ) {
          throw new Error("Invalid JSON structure from Gemini");
        }

        // Return structured analysis data
        return NextResponse.json({ analysis: analysisData });
        
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw response:", response.text);
        
        // Fallback: return a default structure
        return NextResponse.json({ 
          analysis: {
            totalCO2Lifetime: 320,
            percentAboveAverage: 15,
            topContributors: ["Transportation", "Home Energy Use"],
            recommendations: [
              "Consider using public transportation or cycling more often",
              "Switch to renewable energy sources for your home",
              "Reduce meat consumption and food waste"
            ]
          }
        });
      }
    } else {
      return NextResponse.json(
        { error: "No analysis text returned from Gemini" },
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