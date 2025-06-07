"use client";

import React, { useState } from "react";
import "./carbon-quiz.css";

const questions = [
  {
    section: "Travel",
    fields: [
      {
        name: "car_miles",
        label: "How long do you think you spend in a car per week (in hours)",
        type: "number",
        required: true,
      },
      {
        name: "public_transport",
        label: "How many miles do you travel per week by public transport?",
        type: "number",
        required: false,
      },
      {
        name: "flights_year",
        label: "How many flights do you take per year?",
        type: "number",
        required: true,
      },
    ],
  },
  {
    section: "Home",
    fields: [
      {
        name: "home_size",
        label: "What is the size of your home (in square meters)?",
        type: "number",
        required: true,
      },
      {
        name: "energy_type",
        label: "What is your main energy source at home?",
        type: "text",
        required: true,
      },
      {
        name: "electricity_usage",
        label: "How much electricity do you use per month (kWh)?",
        type: "number",
        required: false,
      },
    ],
  },
  {
    section: "Purchases",
    fields: [
      {
        name: "clothes_per_month",
        label: "How many new clothing items do you buy per month?",
        type: "number",
        required: false,
      },
      {
        name: "electronics_per_year",
        label: "How many new electronic devices do you buy per year?",
        type: "number",
        required: false,
      },
      {
        name: "recycle",
        label: "Do you regularly recycle? (yes/no)",
        type: "text",
        required: true,
      },
    ],
  },
  {
    section: "Food",
    fields: [
      {
        name: "diet_type",
        label: "What best describes your diet? (vegan, vegetarian, mixed, meat-heavy)",
        type: "text",
        required: true,
      },
      {
        name: "food_waste",
        label: "How much food do you waste per week (in kg)?",
        type: "number",
        required: false,
      },
    ],
  },
];

type FormState = {
  [key: string]: string;
};

export default function OnboardingForm() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<FormState>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const section = questions[currentSectionIndex];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateSection = () => {
    const requiredFields = section.fields.filter((field) => field.required);
    const missing = requiredFields
      .filter((field) => !formData[field.name]?.trim())
      .map((field) => field.label);

    setErrors(missing);
    return missing.length === 0;
  };

  const handleNext = () => {
    if (validateSection()) {
      setCurrentSectionIndex((prev) => prev + 1);
      setErrors([]);
    }
  };

  const handlePrevious = () => {
    setCurrentSectionIndex((prev) => Math.max(prev - 1, 0));
    setErrors([]);
  };

  // Call your own backend API, which calls Gemini securely with your API key
  async function analyzeCarbonUsage(data: FormState) {
    setLoading(true);
    setAnalysisResult(null);

    try {
    const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData: data }),
    });

      console.log("API response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        setAnalysisResult(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        setLoading(false);
        return;
      }

      const result = await response.json();

      console.log("Gemini analysis result:", result);

      if (result.analysis) {
        setAnalysisResult(result.analysis);
      } else {
        setAnalysisResult("No response from Gemini API.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setAnalysisResult("Error contacting Gemini API: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    if (validateSection()) {
      setSubmitted(true);
      await analyzeCarbonUsage(formData);
    }
  };

  const handleReset = () => {
    setFormData({});
    setCurrentSectionIndex(0);
    setErrors([]);
    setSubmitted(false);
    setAnalysisResult(null);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">✅ Submission Complete</h2>

        <pre className="bg-gray-100 p-4 rounded mb-4 whitespace-pre-wrap">
          {JSON.stringify(formData, null, 2)}
        </pre>

        {loading && (
          <p className="text-blue-600 mb-4 animate-pulse">⏳ Analyzing with Gemini...</p>
        )}

        {analysisResult && !loading && (
          <div className="bg-green-100 p-4 rounded mb-4 whitespace-pre-wrap">
            <h3 className="font-semibold mb-2">♻️ Gemini's Carbon Footprint Estimate:</h3>
            <p>{analysisResult}</p>
          </div>
        )}

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleReset}
        >
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">{section.section}</h2>

      {section.fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block mb-1 font-medium">{field.label}</label>
          <input
            name={field.name}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required={field.required}
          />
        </div>
      ))}

      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          <strong>⚠ Please fill in the following:</strong>
          <ul className="list-disc ml-5">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
          className={`px-4 py-2 rounded ${
            currentSectionIndex === 0 ? "bg-gray-300" : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>

        {currentSectionIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={loading}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}