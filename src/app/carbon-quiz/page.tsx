"use client";

import { useState, useEffect } from "react";
// Removed axios import as it\'s not used with mock data
import "./carbon-quiz.css";

// Updated AnswerOption interface to include score
interface AnswerOption {
  id: number;
  text: string;
  score: number; // Score associated with this option
}

interface Question {
  id: number;
  questionText: string;
  options: AnswerOption[];
}

interface QuizData {
  questions: Question[];
  results: Record<number, string>; // This will need recalibration
}

// Helper to create unique IDs for options
let optionIdCounter = 1;
const newOption = (text: string, score: number): AnswerOption => ({
  id: optionIdCounter++,
  text,
  score,
});

const samuelAdaptedQuestions: Question[] = [
  // Section: Personal Details
  {
    id: 1,
    questionText: "What is your approximate age range?", // Adapted from DOB
    options: [
      newOption("<18 years", 0),
      newOption("18-30 years", 1),
      newOption("31-45 years", 1),
      newOption("46-60 years", 1),
      newOption(">60 years", 0),
    ],
  },
  {
    id: 2,
    questionText: "In which region are you currently residing?*",
    options: [
      newOption("North America", 3),
      newOption("Europe", 2),
      newOption("Asia", 4),
      newOption("South America", 3),
      newOption("Africa", 4),
      newOption("Oceania", 2),
    ],
  },
  {
    id: 3,
    questionText:
      "In which region have you spent the majority of your life living in?*",
    options: [
      newOption("North America", 3),
      newOption("Europe", 2),
      newOption("Asia", 4),
      newOption("South America", 3),
      newOption("Africa", 4),
      newOption("Oceania", 2),
    ],
  },
  {
    id: 4,
    questionText: "What is your gender?",
    options: [
      newOption("Male", 0),
      newOption("Female", 0),
      newOption("Other", 0),
      newOption("Prefer not to say", 0),
    ],
  },
  {
    id: 5,
    questionText: "What is your primary occupation type?*",
    options: [
      newOption("Student", 1),
      newOption("Unemployed/Retired", 1),
      newOption("Office-based work", 2),
      newOption("Remote work", 1),
      newOption("Manual labor/Field work", 3),
      newOption("Other", 2),
    ],
  },
  // Section: Home & Energy
  {
    id: 6,
    questionText: "What is the size of your home (in number of bedrooms)?",
    options: [
      newOption("1 bedroom (or studio)", 1),
      newOption("2 bedrooms", 2),
      newOption("3 bedrooms", 3),
      newOption("4 bedrooms", 4),
      newOption("5+ bedrooms", 5),
    ],
  },
  {
    id: 7,
    questionText: "What is your main energy source at home?*",
    options: [
      newOption("Fully Renewable (e.g., own solar)", 0),
      newOption("Grid (certified green/renewable tariff)", 1),
      newOption("Grid (standard mix, varies by region)", 3),
      newOption("Mostly Fossil Fuels (e.g., gas heating, mixed grid)", 4),
      newOption("Primarily Coal/Oil (e.g., oil heating, coal-heavy grid)", 5),
    ],
  },
  {
    id: 8,
    questionText:
      "How would you describe the energy efficiency of your appliances?",
    options: [
      newOption("Most are high-efficiency models", 1),
      newOption("Some are high-efficiency", 2),
      newOption("Few are high-efficiency", 3),
      newOption("Mostly older/standard models", 4),
    ],
  },
  {
    id: 9,
    questionText: "What type of heating do you primarily use?",
    options: [
      newOption("Efficient Electric (Heat Pump)", 1),
      newOption("Standard Electric (Resistive)", 3),
      newOption("Natural Gas", 2),
      newOption("Heating Oil", 4),
      newOption("Wood/Biomass (sustainable source)", 1),
      newOption("Wood/Biomass (unknown source)", 3),
      newOption("No heating / Minimal use", 0),
    ],
  },
  {
    id: 10,
    questionText:
      "How many prompts do you send to AI (e.g., ChatGPT, Gemini) on average per day?*",
    options: [
      newOption("0-10 (Minimal use)", 0),
      newOption("11-50 (Light use)", 1),
      newOption("51-100 (Moderate use)", 2),
      newOption("100+ (Heavy use)", 3),
    ],
  },
  // Section: Transportation
  {
    id: 11,
    questionText: "Which best describes your vehicle ownership?*",
    options: [
      newOption("No vehicles", 0),
      newOption("Bicycle/E-bike only", 0),
      newOption("Motorcycle/Scooter", 2),
      newOption("One small/efficient car (gas/diesel)", 3),
      newOption("One large car/SUV/truck (gas/diesel)", 5),
      newOption("Multiple gas/diesel cars", 7),
      newOption("Electric Vehicle (EV)", 1),
      newOption("Hybrid Vehicle", 2),
    ],
  },
  {
    id: 12,
    questionText:
      "On average, how many hours do you spend in a car per day (as driver or passenger)?*",
    options: [
      newOption("0 hours (or very rarely)", 0),
      newOption("Less than 1 hour", 1),
      newOption("1-2 hours", 3),
      newOption("2-3 hours", 5),
      newOption("More than 3 hours", 7),
    ],
  },
  {
    id: 13,
    questionText:
      "How many international flights (round trip) do you take on average per year?*",
    options: [
      newOption("None", 0),
      newOption("1 short-haul (e.g., within continent)", 3),
      newOption("1 long-haul (e.g., intercontinental)", 7),
      newOption("2-3 short-haul", 6),
      newOption("2-3 long-haul", 14),
      newOption("More than 3 long-haul", 20),
    ],
  },
  {
    id: 14,
    questionText:
      "How many domestic flights (round trip) do you take on average per year?*",
    options: [
      newOption("None", 0),
      newOption("1-2 flights", 2),
      newOption("3-5 flights", 4),
      newOption("6-10 flights", 6),
      newOption("More than 10 flights", 8),
    ],
  },
  // Section: Food
  {
    id: 15,
    questionText: "What best describes your diet?*",
    options: [
      newOption("Vegan (no animal products)", 0),
      newOption("Vegetarian (no meat/fish, may include dairy/eggs)", 1),
      newOption("Pescatarian (vegetarian + fish)", 2),
      newOption("Omnivore (balanced, eats meat occasionally)", 3),
      newOption("Meat-heavy (red meat most days)", 5),
    ],
  },
  {
    id: 16,
    questionText: "How often do you consume beef or lamb per week?",
    options: [
      newOption("Never/Rarely", 0),
      newOption("1-2 times a week", 2),
      newOption("3-4 times a week", 4),
      newOption("Almost daily", 6),
    ],
  },
  {
    id: 17,
    questionText:
      "On average, what percentage of your purchased food goes to waste (e.g., leftovers, spoilage)?*",
    options: [
      newOption("Very little (0-10%)", 0),
      newOption("Some (11-25%)", 2),
      newOption("Moderate (26-40%)", 4),
      newOption("A lot (Over 40%)", 6),
    ],
  },
  {
    id: 18,
    questionText:
      "Do you actively try to reduce food waste (e.g., meal planning, composting)?*",
    options: [
      newOption("Yes, consistently and effectively", 0),
      newOption("Yes, sometimes or with some methods", 1),
      newOption("Not actively, but I'm mindful", 2),
      newOption("No, not a current focus", 3),
    ],
  },
  // Section: Purchases & Other
  {
    id: 19,
    questionText: "How many pets do you have, and what type?",
    options: [
      newOption("No pets", 0),
      newOption("Small pet(s) (e.g., fish, hamster)", 0),
      newOption("Cat(s)", 1),
      newOption("Medium dog(s)", 2),
      newOption("Large dog(s)", 3),
      newOption("Multiple pets (mix of cat/dog)", 3),
    ],
  },
  {
    id: 20,
    questionText:
      "Do you invest or store money in ethical/green funds or banks?",
    options: [
      newOption("Yes, primarily or significantly", 0),
      newOption("Yes, a small portion", 1),
      newOption("No, but I'm considering it", 2),
      newOption("No, not aware or not a priority", 3),
      newOption("I don't have investments/significant savings", 0),
    ],
  },
  {
    id: 21,
    questionText:
      "On average, how many new clothing items (incl. accessories) do you purchase per month?*",
    options: [
      newOption("0-1 (Rarely buy new, focus on second-hand/repair)", 0),
      newOption("1-2 items", 2),
      newOption("3-5 items", 4),
      newOption("More than 5 items", 6),
    ],
  },
  {
    id: 22,
    questionText:
      "Describe your typical daily water usage for activities like showering (e.g., shower length).*",
    options: [
      newOption("Short showers (under 5 mins), water-saving habits", 0),
      newOption("Average showers (5-10 mins)", 1),
      newOption("Long showers (over 10 mins), and/or frequent baths", 3),
      newOption(
        "Very high water usage (e.g. multiple long showers/baths daily)",
        5
      ),
    ],
  },
];

const CarbonQuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use the new adapted questions
        const responseData: QuizData = {
          questions: samuelAdaptedQuestions,
          results: {
            // IMPORTANT: These results thresholds are placeholders and WILL NOT BE ACCURATE
            // with the new questions and scoring. They need to be recalibrated.
            0: "Amazing! Your carbon footprint is impressively low. (Recalibrate this message!)",
            20: "Good effort! You're making some positive choices. (Recalibrate this message!)",
            40: "There's room for improvement. Consider more sustainable habits. (Recalibrate this message!)",
            60: "Your footprint is on the higher side. Explore significant changes. (Recalibrate this message!)",
            80: "Very high impact. Urgent action is needed. (Recalibrate this message!)",
          },
        };
        setQuizData(responseData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load quiz data");
        } else {
          setError("An unknown error occurred while loading quiz data");
        }
      }
      setIsLoading(false);
    };

    fetchQuizData();
  }, []);

  // Updated handleAnswerSubmit to use the score from the selected option
  const handleAnswerSubmit = (optionId: number) => {
    setSelectedAnswer(optionId);

    if (quizData) {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      const selectedOptionData = currentQuestion.options.find(
        (option) => option.id === optionId
      );

      // Add the score from the selected option
      if (selectedOptionData && typeof selectedOptionData.score === "number") {
        setScore((prev) => prev + selectedOptionData.score);
      }
    }

    // Delay before moving to the next question or completing the quiz
    setTimeout(() => {
      if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null); // Reset selection for the next question
      } else {
        setQuizCompleted(true);
      }
    }, 1000); // 1-second delay to show selection
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    // Optionally, re-fetch or re-initialize quizData if it could change
    // For now, we assume it\'s static after initial load.
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pale-leaf p-4 font-sans">
        <div className="text-2xl font-serif text-pine-green">
          Loading Quiz...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pale-leaf p-4 font-sans">
        <div className="text-2xl font-serif text-red-600">Error: {error}</div>
        <p className="text-bark-brown mt-2">
          Could not load the quiz. Please try again later.
        </p>
      </div>
    );
  }

  if (!quizData || quizData.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pale-leaf p-4 font-sans">
        <div className="text-2xl font-serif text-pine-green">
          Quiz not available.
        </div>
        <p className="text-bark-brown mt-2">
          We&apos;re working on bringing you a great quiz soon!
        </p>
        {/* <NavigationBar /> */}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-pale-leaf font-sans">
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-pine-green mb-2">
            Carbon Footprint Quiz
          </h1>
          <p className="text-lg text-forest-green">
            Answer these questions to estimate your carbon footprint.
          </p>
        </header>

        {!quizCompleted ? (
          <div className="w-full max-w-xl p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-leaf-green/30">
            <h2 className="text-2xl sm:text-3xl font-serif text-pine-green mb-6">
              Question {currentQuestionIndex + 1} / {quizData.questions.length}
            </h2>
            <p className="text-xl text-forest-green mb-8 min-h-[60px]">
              {quizData.questions[currentQuestionIndex].questionText}
            </p>
            <div className="space-y-4">
              {quizData.questions[currentQuestionIndex].options.map(
                (option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSubmit(option.id)}
                    disabled={selectedAnswer !== null} // Disable after an answer is selected
                    className={`w-full p-4 text-left text-lg rounded-lg transition-all duration-150 ease-in-out
                              font-medium border-2 
                              ${
                                selectedAnswer === option.id
                                  ? "bg-leaf-green text-white scale-105 shadow-md border-pine-green" // Highlight selected
                                  : selectedAnswer !== null
                                  ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed" // Dim unselected after selection
                                  : "bg-white/70 hover:bg-leaf-green/20 text-forest-green hover:shadow-md border-leaf-green/50" // Default state
                              }`}
                  >
                    {option.text}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-xl p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-leaf-green/30">
            <h2 className="text-3xl sm:text-4xl font-serif text-pine-green mb-4">
              Quiz Completed!
            </h2>
            <p className="text-2xl text-forest-green mb-6">
              Your Estimated Score:{" "}
              <span className="font-bold text-pine-green">{score}</span>
              {/* Removed / quizData.questions.length as score is cumulative */}
            </p>
            <p className="text-lg text-bark-brown mb-8">
              {/* Logic to display result message based on score - NEEDS RECALIBRATION */}
              {getResultMessage(score, quizData.results)}
            </p>
            <button
              onClick={resetQuiz}
              className="px-8 py-4 bg-pine-green text-white text-lg font-semibold rounded-lg hover:bg-forest-green transition-colors duration-150 shadow-md hover:shadow-lg"
            >
              Play Again
            </button>
          </div>
        )}
      </main>
      {/* <NavigationBar /> */}
    </div>
  );
};

// Helper function to get result message (needs recalibration for new scores)
const getResultMessage = (
  score: number,
  results: Record<number, string>
): string => {
  // Find the closest score threshold that is less than or equal to the current score
  const thresholds = Object.keys(results)
    .map(Number)
    .sort((a, b) => b - a); // Sort descending
  for (const threshold of thresholds) {
    if (score >= threshold) {
      return results[threshold];
    }
  }
  // Fallback if score is lower than any threshold (or if results is empty)
  const lowestThreshold = Math.min(...Object.keys(results).map(Number));
  if (Object.keys(results).length > 0) return results[lowestThreshold];
  return "Great effort! Every step towards sustainability counts. (Default message - recalibrate results)";
};

export default CarbonQuizPage;
