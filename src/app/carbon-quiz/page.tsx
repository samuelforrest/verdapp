"use client";

//Styling for this page.
// All titles / important
  // Font bold / semi-bold dependent on importance
  // Color is text-green-700 always
  // Green underline on links
// For all text
  // Black
  // Font bold for importance


import React, { useState } from "react";
import "./carbon-quiz.css";

// This is section 0, which is information to the user before starting the quiz.
const infoSection = {
  section: "Welcome to the Carbon Footprint Quiz",
  fields: [],
  info: (
    <div className="space-y-4">
      {/* Apollo Wikipedia Earth Image */}
      <div className="flex justify-center mb-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/480px-The_Earth_seen_from_Apollo_17.jpg"
          alt="the Earth seen from Apollo"
          className="rounded-full w-40 h-40 object-cover"
        />
      </div>
      <h2 className="text-2xl font-bold text-green-700">🌱 Lifetime CO2 Emissions Calculator</h2>
      <p>
        This quiz estimates your lifetime carbon footprint based on your lifestyle, home, travel, food, and purchases.
        Your answers are anonymous and used only for this analysis.
      </p>
      <p>
        <strong>Sources / Assumptions:</strong> {/*Moved the paragraph out of list due to syntax error with HTML*/}
      </p>
        <ul className="list-disc ml-6">
          <li>Worldometer's CO2 Average Emissions per Capita <a href="https://www.worldometers.info/co2-emissions/co2-emissions-per-capita/" className="text-green-700 font-semibold underline" target="_blank" rel="noopener noreferrer">CO₂ Emissions Data</a></li>
          <li>The average human emits 4.8 tonnes per year. </li>
          <li>IEA’s mid-range figure predicts the average human emitting 300 tonnes in a lifetime.</li>
          <li>The Gemini 2.0 Flash API model will process all data and conduct calculations.</li>
          <li>The image of the Earth (above) is credit to Wikipedia, ans is the Earth seen from Apollo</li>
        </ul>
      <p>
        <strong>Note:</strong> This is an demonstrational educational tool, and due to AI, we cannot guarantee 100% accuracy. <span className="text-green-700 font-semibold ">Questions without the * are not required.</span>
      </p>
      <p>
        <strong>Privacy:</strong> The data you send is not seen by anyone on the backend. It is sent securely to Gemini's AI model via a private API key. If you do not wish for your data to be processed by Gemini, do not answer this quiz.
      </p>
      <p><strong>Technical Details:</strong> Data from the form is sent via JSON to Gemini Flash 2.0 AI model.</p>
      <button
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
        onClick={() => window.dispatchEvent(new CustomEvent("start-quiz"))}
      >
        Start The Quiz -→
      </button>
    </div>
  ),
};

const questions = [
  infoSection,
  {//Section 1: Personal Details
    section: "Personal Details (* denotes required)",
    fields: [
      {
        name: "age_range",
        label: "What is your approximate age range?",
        type: "radio",
        required: true,
        options: [
          "<18 years",
          "18-30 years", 
          "31-45 years",
          "46-60 years",
          ">60 years"
        ]
      },
      {
        name: "country_current_residence",
        label: "In which region are you currently residing?",
        type: "radio",
        required: true,
        options: [
          "North America",
          "Europe", 
          "Asia",
          "South America",
          "Africa",
          "Oceania"
        ]
      },
      {
        name: "country_majority_of_life_lived", 
        label: "In which region have you spent the majority of your life living in?",
        type: "radio",
        required: true,
        options: [
          "North America",
          "Europe",
          "Asia", 
          "South America",
          "Africa",
          "Oceania"
        ]
      },
      {
        name: "gender",
        label: "What is your gender?",
        type: "radio",
        required: false,
        options: [
          "Male",
          "Female",
          "Other",
          "Prefer not to say"
        ]
      },
      {
        name: "occupation_type",
        label: "What is your primary occupation type?",
        type: "radio", 
        required: true,
        options: [
          "Student",
          "Unemployed/Retired",
          "Office-based work",
          "Remote work", 
          "Manual labor/Field work",
          "Other"
        ]
      }
    ]
  },
  { //Section 2 gathers information about the housing and energy use
    section: "Home & Energy",
    fields: [
      {
        name: "home_size_number_of_bedrooms",
        label: "What is the size of your home (in number of bedrooms)?",
        type: "radio",
        required: false,
        options: [
          "1 bedroom (or studio)",
          "2 bedrooms",
          "3 bedrooms", 
          "4 bedrooms",
          "5+ bedrooms"
        ]
      },
      {
        name: "energy_type",
        label: "What is your main energy source at home?*",
        type: "radio",
        required: true,
        options: [
          "Fully Renewable (e.g., own solar)",
          "Grid (certified green/renewable tariff)",
          "Grid (standard mix, varies by region)",
          "Mostly Fossil Fuels (e.g., gas heating, mixed grid)",
          "Primarily Coal/Oil (e.g., oil heating, coal-heavy grid)"
        ]
      },
      {
        name: "energy_efficent_appliances_used_commonly_yes_or_now",
        label: "How would you describe the energy efficiency of your appliances?",
        type: "radio",
        required: false,
        options: [
          "Most are high-efficiency models",
          "Some are high-efficiency",
          "Few are high-efficiency",
          "Mostly older/standard models"
        ]
      },
      {
        name: "type_of_heating",
        label: "What type of heating do you primarily use?",
        type: "radio",
        required: false,
        options: [
          "Efficient Electric (Heat Pump)",
          "Standard Electric (Resistive)",
          "Natural Gas",
          "Heating Oil",
          "Wood/Biomass (sustainable source)",
          "Wood/Biomass (unknown source)",
          "No heating / Minimal use"
        ]
      },
      {
        name: "prompts_to_ai_per_day_on_average",
        label: "How many prompts do you send to AI (e.g., ChatGPT, Gemini) on average per day?*",
        type: "radio",
        required: true,
        options: [
          "0-10 (Minimal use)",
          "11-50 (Light use)",
          "51-100 (Moderate use)",
          "100+ (Heavy use)"
        ]
      }
    ]
  },
  {
    section: "Transportation",
    fields: [
      {
        name: "number_and_types_of_vehicles",
        label: "Describe the number and types of vehicles you own?",
        type: "text", //This must be text - mutliselect not supported by some browsers
        required: true,
      },
      {
        name: "average_hours_in_a_car_per_day",
        label: "On average, how many hours do you spend in a car per day (as driver or passenger)?*",
        type: "radio",
        required: true,
        options: [
          "0 hours (or very rarely)",
          "Around 30 minutes",
          "Around 1 hour",
          "Around 1 hour 30 minutes",
          "Around 2 hours",
          "Around 2 hours 30 minutes",
          "More than 3 hours"
        ]
      },
      {
        name: "average_international_flights_per_year",
        label: "How many international flights (round trip) do you take on average per year?*",
        type: "radio",
        required: true,
        options: [
          "None",
          "1 short-haul (e.g., within your continent)",
          "1 long-haul (e.g., intercontinental)",
          "2-3 short-haul",
          "2-3 long-haul",
          "More than 3 long-haul"
        ]
      },
      {
        name: "average_domestic_flights_per_year",
        label: "How many domestic flights (round trip) do you take on average per year?*",
        type: "radio",
        required: true,
        options: [
          "None",
          "1 flight",
          "2 flights",
          "3 flights",
          "4 flights",
          "5-7 flights",
          "8+ flights"
        ]
      }
    ]
  },
  {
    section: "Food",
    fields: [
      {
        name: "diet_type",
        label: "What best describes your diet?*",
        type: "radio",
        required: true,
        options: [
          "Vegan (no animal products)",
          "Vegetarian (no meat/fish, may include dairy/eggs)",
          "Pescatarian (vegetarian + fish)",
          "Omnivore (balanced, eats meat occasionally)",
          "Meat-heavy (red meat most days)"
        ]
      },
      {
        name: "consumption_of_beef_or_lamb_per_week",
        label: "How often do you consume beef or lamb per week?",
        type: "radio",
        required: false,
        options: [
          "Never/Rarely",
          "1-2 times a week",
          "3-4 times a week",
          "Almost daily"
        ]
      },
      {
        name: "average_percent_of_meal_wasted",
        label: "On average, what percentage of your purchased food goes to waste (e.g., leftovers, spoilage)?*",
        type: "radio",
        required: true,
        options: [
          "Very little (0-10%)",
          "Some (11-25%)",
          "Moderate (26-40%)",
          "A lot (Over 40%)"
        ]
      },
      {
        name: "yes_or_no_try_to_reduce_food_waste",
        label: "Do you actively try to reduce food waste (e.g., meal planning, composting)?*",
        type: "radio",
        required: true,
        options: [
          "Yes, consistently and effectively",
          "Yes, sometimes or with some methods",
          "Not actively, but I'm mindful",
          "No, not a current focus"
        ]
      }
    ]
  },
  {
    section: "Purchases & Other",
    fields: [
      {
        name: "pets_number_and_type",
        label: "Describe the pets you have",
        type: "text",
        required: false,
      },
      {
        name: "where_investments_go",
        label: "Do you invest or store money in ethical/green funds or banks?",
        type: "radio",
        required: false,
        options: [
          "Yes, primarily or significantly",
          "Yes, a small portion",
          "No, but I'm considering it",
          "No, not aware or not a priority",
          "I don't have investments/significant savings"
        ]
      },
      {
        name: "clothes_purchased_per_month",
        label: "On average, how many new clothing items (incl. accessories) do you purchase per month?*",
        type: "radio",
        required: true,
        options: [
          "0-1 (Rarely buy new, focus on second-hand/repair)",
          "1-2 items",
          "3-5 items",
          "More than 5 items"
        ]
      },
      {
        name: "water_usage_per_day",
        label: "Describe your typical daily water usage for activities like showering (e.g., shower length).*",
        type: "radio",
        required: true,
        options: [
          "Short showers (under 5 mins), water-saving habits",
          "Average showers (5-10 mins)",
          "Long showers (over 10 mins), and/or frequent baths",
          "Very high water usage (e.g. multiple long showers/baths daily)"
        ]
      }
    ]
  }
];

type FormState = {
  [key: string]: string;
};

// Define the analysis result type based on your API response
type AnalysisResult = {
  totalCO2Lifetime: number;
  percentAboveAverage: number;
  topContributors: [string, string];
  recommendations: [string, string, string];
};

export default function OnboardingForm() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<FormState>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const section = questions[currentSectionIndex];

  // Listen for "start-quiz" event to move from info slide to first real section
  React.useEffect(() => {
    const handler = () => setCurrentSectionIndex(1);
    window.addEventListener("start-quiz", handler);
    return () => window.removeEventListener("start-quiz", handler);
  }, []);

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
    setApiError(null);

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
        setApiError(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log("Gemini analysis result:", result);

      if (result.analysis) {
        setAnalysisResult(result.analysis);
      } else {
        setApiError("No analysis data returned from Gemini API.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setApiError("Error contacting Gemini API: " + (error as Error).message);
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
    setApiError(null);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-green-600">🌱 Your Carbon Footprint Analysis</h2>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-600 text-lg">🔍 Analyzing your carbon footprint with AI...</p>
          </div>
        )}

        {apiError && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="font-semibold mb-2">❌ Analysis Error, try again or contact us.</h3>
            <p>{apiError}</p>
          </div>
        )}

        {analysisResult && !loading && (
          <div className="space-y-6">
            {/* Main Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">🌍 Lifetime CO₂ Footprint</h3>
                <p className="text-3xl font-bold text-blue-600">{analysisResult.totalCO2Lifetime} tonnes</p>
                <p className="text-sm text-gray-600 mt-1">Based on 80-year lifespan estimate</p>
              </div>
              
              <div className={`p-6 rounded-lg border ${
                analysisResult.percentAboveAverage > 0 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 ${
                  analysisResult.percentAboveAverage > 0 ? 'text-red-800' : 'text-green-800'
                }`}>
                  📊 Compared to Global Average
                </h3>
                <p className={`text-3xl font-bold ${
                  analysisResult.percentAboveAverage > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {analysisResult.percentAboveAverage > 0 ? '+' : ''}{analysisResult.percentAboveAverage}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {analysisResult.percentAboveAverage > 0 ? 'Above' : 'Below'} global average
                </p>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-4">🔥 Your Top Carbon Contributors</h3>
              <div className="space-y-2">
                {analysisResult.topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      #{index + 1}
                    </span>
                    <span className="text-gray-700">{contributor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">💡 Personalized AI Recommendations</h3>
              <div className="space-y-3">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form Data Summary (Collapsible) */}
        <details className="mt-8 bg-gray-50 p-4 rounded-lg">
          <summary className="cursor-pointer font-medium text-gray-700 mb-2">
            📋 View Your Submitted Data
          </summary>
          <pre className="bg-white p-4 rounded border text-xs overflow-auto max-h-64">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </details>

        <div className="flex gap-4 mt-6">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleReset}
          >
            🔄 Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  // Render info slide if section 0
  if (currentSectionIndex === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-10">
        {infoSection.info}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Section {currentSectionIndex} of {questions.length - 1}</span>
          <span>{Math.round((currentSectionIndex / (questions.length - 1)) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentSectionIndex / (questions.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-gray-800">{section.section}</h2>

      <div className="space-y-6">
        {section.fields.map((field) => (
          <div key={field.name} className="space-y-3">
            <label className="block font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === "radio" && field.options ? (
              <div className="space-y-2">
                {field.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={field.name}
                      value={option}
                      checked={formData[field.name] === option}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                name={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mt-6">
          <div className="flex items-center space-x-2 mb-2">
            <span>⚠️</span>
            <strong>Data Missing Error: Please complete the following required fields:</strong>
          </div>
          <ul className="list-disc ml-6 space-y-1">
            {errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentSectionIndex === 1}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            currentSectionIndex === 1 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
        >
          ← Previous
        </button>

        {currentSectionIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "🌱 Get My Carbon Analysis"}
          </button>
        )}
      </div>
    </div>
  );
}