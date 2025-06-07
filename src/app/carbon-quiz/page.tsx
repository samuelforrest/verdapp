"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from "../../components/NavigationBar";
import "./carbon-quiz.css";

interface Question {
  id: number;
  questionText: string;
  options: AnswerOption[];
}

interface AnswerOption {
  id: number;
  text: string;
}

interface QuizData {
  questions: Question[];
  results: Record<number, string>;
}

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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const response = {
          data: {
            questions: [
              {
                id: 1,
                questionText: "How often do you eat red meat?",
                options: [
                  { id: 1, text: "Never/Rarely", score: 0 },
                  { id: 2, text: "Occasionally (1-2 times/week)", score: 2 },
                  { id: 3, text: "Often (3-5 times/week)", score: 4 },
                  { id: 4, text: "Daily", score: 6 },
                ],
              },
              {
                id: 2,
                questionText: "How do you primarily commute to work/school?",
                options: [
                  { id: 1, text: "Walk/Cycle", score: 0 },
                  { id: 2, text: "Public Transport", score: 1 },
                  { id: 3, text: "Electric Vehicle", score: 2 },
                  { id: 4, text: "Gasoline Car (solo)", score: 5 },
                ],
              },
              {
                id: 3,
                questionText:
                  "How much of your household waste do you recycle?",
                options: [
                  { id: 1, text: "Almost everything", score: 0 },
                  { id: 2, text: "About half", score: 1 },
                  { id: 3, text: "Very little", score: 3 },
                  { id: 4, text: "None", score: 4 },
                ],
              },
              {
                id: 4,
                questionText: "How often do you fly per year?",
                options: [
                  { id: 1, text: "Never", score: 0 },
                  { id: 2, text: "1-2 short-haul flights", score: 3 },
                  {
                    id: 3,
                    text: "Multiple short-haul or 1-2 long-haul",
                    score: 6,
                  },
                  { id: 4, text: "Multiple long-haul flights", score: 10 },
                ],
              },
              {
                id: 5,
                questionText:
                  "What is the primary source of energy for your home?",
                options: [
                  { id: 1, text: "Renewable (Solar, Wind)", score: 0 },
                  { id: 2, text: "Natural Gas", score: 3 },
                  { id: 3, text: "Grid Electricity (mixed sources)", score: 2 }, // Assuming average grid mix
                  { id: 4, text: "Coal/Oil", score: 7 },
                ],
              },
            ],
            results: {
              0: "Amazing! You're a true eco-warrior! Your carbon footprint is impressively low.",
              5: "Great job! You're making conscious choices that significantly reduce your impact.",
              10: "Good start! There are areas for improvement, but you're on the right track.",
              15: "Considerable impact. Explore ways to reduce your carbon footprint further.",
              20: "High impact. Significant lifestyle changes could make a big difference.",
              25: "Very high impact. It's crucial to take steps to reduce your environmental footprint.",
            },
          },
        };
        setQuizData(response.data as QuizData); // Added type assertion
      } catch (err: any) {
        // Added type for err
        setError(err.message || "Failed to fetch quiz data");
      }
      setIsLoading(false);
    };

    fetchQuizData();
  }, []);

  const handleAnswerSubmit = (optionId: number) => {
    setSelectedAnswer(optionId);

    if (quizData) {
      const isCorrect = quizData.questions[currentQuestionIndex].options.some(
        (option) => option.id === optionId && option.text === "True"
      );

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }
    }

    setTimeout(() => {
      if (currentQuestionIndex < quizData!.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
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
        <NavigationBar />
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
          <p className="text-lg text-forest-green">Test your eco-knowledge!</p>
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
                    className={`w-full p-4 text-left text-lg rounded-lg transition-all duration-150 ease-in-out
                              font-medium border-2 border-leaf-green/50
                              ${
                                selectedAnswer === option.id
                                  ? "bg-leaf-green text-white scale-105 shadow-md"
                                  : "bg-white/70 hover:bg-leaf-green/20 text-forest-green hover:shadow-md"
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
              Your Score:{" "}
              <span className="font-bold text-leaf-green">{score}</span> /{" "}
              {quizData.questions.length}
            </p>
            <p className="text-lg text-bark-brown mb-8">
              {quizData.results[score] ||
                "Great effort! Every step towards sustainability counts."}
            </p>
            <button
              onClick={resetQuiz}
              className="px-8 py-4 bg-leaf-green text-white text-lg font-semibold rounded-lg hover:bg-pine-green transition-colors duration-150 shadow-md hover:shadow-lg"
            >
              Play Again
            </button>
          </div>
        )}
      </main>
      <NavigationBar />
    </div>
  );
};

export default CarbonQuizPage;
