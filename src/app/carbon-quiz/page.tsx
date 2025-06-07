"use client";

import { useState } from "react";
import axios from "axios";

export default function CarbonFootprintQuiz() {
  // Define sections & their questions
  const sections = [
    {
      label: "Travel",
      questions: [
        {
          id: 1,
          question: "How many miles do you drive per week?",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          id: 2,
          question: "How often do you fly per year?",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
    },
    {
      label: "Food",
      questions: [
        {
          id: 3,
          question: "Do you eat mostly plant-based or meat-based diet?",
          type: "select",
          options: ["Plant-based", "Mixed", "Meat-based"],
        },
      ],
    },
    {
      label: "Home",
      questions: [
        {
          id: 4,
          question: "How many energy-efficient appliances do you have?",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
    },
    {
      label: "Purchases",
      questions: [
        {
          id: 5,
          question: "How many items do you buy new per month?",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
    },
  ];

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const currentSection = sections[currentSectionIndex];

  // Handle input change
  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Check if current section's questions are all answered
  const isCurrentSectionComplete = currentSection.questions.every(
    (q) => answers[q.id] !== undefined && answers[q.id] !== ""
  );

  // Move to next section
  const goToNextSection = () => {
    if (currentSectionIndex < sections.length - 1 && isCurrentSectionComplete) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  // Move to previous section
  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  // Submit form data
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/carbon-footprint", { answers });
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to fetch AI results. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-lime-50 to-green-100 px-6 py-12 font-inter">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-green-200 animate-fadeIn">
          <h1 className="text-4xl font-extrabold mb-8 text-green-800 drop-shadow-lg">
            Your Carbon Footprint Insight
          </h1>
          {result.error ? (
            <p className="text-red-600 text-lg mb-8">{result.error}</p>
          ) : (
            <p className="text-green-900 text-xl whitespace-pre-line mb-8">
              {result.message}
            </p>
          )}
          <button
            onClick={() => {
              setResult(null);
              setAnswers({});
              setCurrentSectionIndex(0);
            }}
            className="inline-block px-10 py-3 bg-gradient-to-r from-green-600 to-lime-500 text-white font-semibold rounded-full shadow-lg hover:from-green-700 hover:to-lime-600 transition transform hover:scale-105 active:scale-95"
          >
            Restart
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-green-100 px-6 py-12 flex flex-col items-center font-inter">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-12 border border-green-200 animate-fadeIn">
        {/* Section Indicator */}
        <div className="mb-8 text-center">
          <p className="text-green-700 font-semibold tracking-wide">
            Section {currentSectionIndex + 1} of {sections.length} —{" "}
            <span className="text-green-900 text-xl font-bold">
              {currentSection.label}
            </span>
          </p>
          <div className="flex justify-center mt-2 gap-3">
            {sections.map((section, idx) => (
              <div
                key={section.label}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                  idx === currentSectionIndex
                    ? "bg-green-600 border-green-600"
                    : "border-green-300"
                } flex items-center justify-center text-white font-bold select-none transition`}
                onClick={() => setCurrentSectionIndex(idx)}
                title={section.label}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentSectionIndex === sections.length - 1) {
              handleSubmit();
            } else {
              goToNextSection();
            }
          }}
          className="space-y-8"
        >
          {currentSection.questions.map((q) => (
            <div key={q.id} className="flex flex-col">
              <label
                htmlFor={`q-${q.id}`}
                className="mb-3 text-xl font-semibold text-green-800"
              >
                {q.question}
              </label>
              {q.type === "select" ? (
                <select
                  id={`q-${q.id}`}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className="p-4 rounded-xl border-2 border-green-300 bg-white text-green-900 text-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-green-400 transition"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {q.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`q-${q.id}`}
                  type={q.type}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  min={0}
                  className="p-4 rounded-xl border-2 border-green-300 bg-white text-green-900 text-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-green-400 transition"
                />
              )}
            </div>
          ))}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={goToPreviousSection}
              disabled={currentSectionIndex === 0}
              className={`px-6 py-3 rounded-md font-semibold border ${
                currentSectionIndex === 0
                  ? "border-green-200 text-green-400 cursor-not-allowed"
                  : "border-green-600 text-green-700 hover:bg-green-100"
              } transition`}
            >
              Previous
            </button>

            <button
              type="submit"
              disabled={!isCurrentSectionComplete || loading}
              className={`px-6 py-3 rounded-md font-semibold text-white ${
                isCurrentSectionComplete && !loading
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-300 cursor-not-allowed"
              } transition flex items-center gap-2`}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {currentSectionIndex === sections.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-10 text-center text-green-700 opacity-70 text-sm select-none">
        &copy; {new Date().getFullYear()} Carbon Quiz. Made with{" "}
        <span className="text-green-500">♥</span>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap");

        body {
          font-family: "Inter", sans-serif;
        }

        /* FadeIn animation */
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </main>
  );
}