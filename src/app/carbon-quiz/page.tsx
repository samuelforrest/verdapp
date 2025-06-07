"use client";

import React, { useState } from "react";
import "./carbon-quiz.css";

const questions = [
  {
    section: "Personal Details (* denotes required)",
    fields: [
        {
        name: "dob",
        label: "Please select your Date of Birth (DOB)?",
        type: "date",
        required: false,
      },

      {
        name: "country_current_residence",
        label: "In which country are you currently residing in?*",
        type: "text",
        required: true,
      },

      {
        name: "country_majority_of_life_lived",
        label: "In which country have you spent the majority of your life living in?*",
        type: "text",
        required: true,
      },
      {
        name: "gender",
        label: "What is your gender?",
        type: "text",
        required: false,
      },
        {
        name: "occupation_type",
        label: "What is your occupation. If unemployed, or a student, include? *",
        type: "text",
        required: false,
      },
    ],
  },

  {
    section: "Home & Energy",
    fields: [
      {
        name: "home_size_number_of_bedrooms",
        label: "What is the size of your home (in number of bedrooms)?",
        type: "number",
        required: false,
        min: 1, //cannot be a home if less than 1
        max: 30, //results will be skewed if larger than 30 (more testing needed)
      },
      {
        name: "energy_type",
        label: "What is your main energy source at home? (renewable or grid mix)*",
        type: "text",
        required: true,
      },
      {
        name: "energy_efficent_appliances_used_commonly_yes_or_now",
        label: "Do you have many energy-efficent appliances in your house?",
        type: "text",
        required: false,
      },
        {
        name: "type_of_heating",
        label: "What type of heating do you use? (Gas, Electric or Oil)",
        type: "text",
        required: false,
      },
        {
        name: "prompts_to_ai_per_day_on_average",
        label: "How many prompts do you send to ai on average per day?*",
        type: "text",
        required: true,
      },

    ],
  },
  {
    section: "Transportation",
    fields: [
      {
        name: "number_and_types_of_vehicles",
        label: "Describe the number and types of any vehicles you own *",
        type: "text",
        required: false,
      },
      {
        name: "average_hours_in_a_car_per_day",
        label: "On average, how many hours do you spend in a car per day *",
        type: "number",
        required: true,
      },
      {
        name: "average_international_flights_per_year",
        label: "How many international flights do you take on average per year?",
        type: "text",
        required: true,
      },
      {
        name: "average_domestic_flights_per_year",
        label: "How many domestic flights do you take on average a year?",
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
        label: "What best describes your diet? (vegan, vegetarian, mixed, meat-heavy)*",
        type: "text",
        required: true,
      },
      {
        name: "consumption_of_beef_or_lamb_per_week",
        label: "How often do you consume beef of lamb per week",
        type: "text",
        required: false,
      },
        {
        name: "average_percent_of_meal_wasted",
        label: "On average, what percent (%) of your meal goes to food waste, i.e. leftovers?*",
        type: "number",
        required: true,
      },
         {
        name: "yes_or_no_try_to_reduce_food_waste",
        label: "Do you actively try to reduce food waste?*",
        type: "text",
        required: true,
      },

    ],
  },
    {
    section: "Purchases & Other",
    fields: [
      {
        name: "pets_number_and_type",
        label: "How many, and what types of pets do you have",
        type: "text",
        required: false,
      },
      {
        name: "where_investments_go",
        label: "Do you invest, or store money in ethical / green index funds or investments or banks?",
        type: "text",
        required: false,
      },
        {
        name: "clothes_purchased_per_month",
        label: "On average, what number of clothes and physical assesories do you purchase per month?*",
        type: "number",
        required: true,
      },
         {
        name: "yes_or_no_try_to_reduce_food_waste",
        label: "Do you actively try to reduce food waste?*",
        type: "text",
        required: true,
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