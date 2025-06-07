"use client";

import TeachableMachineClient from "@/components/TeachableMachineClient";
import { useState } from "react";

interface PredictionResult {
  trashType: string | null; // This will be the direct output from the model, e.g., "Class 6"
  confidence: number | null;
}

interface DisplayPrediction {
  // This will store the type after mapping, e.g., "Glass"
  trashType: string | null;
  confidence: number | null;
}

interface BinDetails {
  bin: string;
  color: string;
  emoji: string;
}

interface CountryBinInfo {
  [country: string]: {
    [trashType: string]: BinDetails;
  };
}

// Changed "Class 6" to "Glass" as a key
const countrySpecificBinInfo: CountryBinInfo = {
  "United States": {
    Recycle: { bin: "Recycling Bin", color: "bg-blue-500", emoji: "♻️" },
    Compost: { bin: "Compost Bin", color: "bg-green-600", emoji: "🌿" },
    Trash: { bin: "Trash Bin", color: "bg-gray-600", emoji: "🗑️" },
    Glass: { bin: "Glass Recycling", color: "bg-sky-500", emoji: "🍾" },
  },
  Canada: {
    Recycle: { bin: "Recycling Bin", color: "bg-blue-500", emoji: "♻️" },
    Compost: { bin: "Compost Bin", color: "bg-green-600", emoji: "🌿" },
    Trash: { bin: "Trash Bin", color: "bg-gray-600", emoji: "🗑️" },
    Glass: { bin: "Glass Recycling", color: "bg-sky-500", emoji: "🍾" },
  },
  "United Kingdom": {
    Recycle: { bin: "Mixed Recycling", color: "bg-orange-500", emoji: "♻️" },
    Compost: { bin: "Food & Garden Waste", color: "bg-lime-600", emoji: "🥕" },
    Trash: { bin: "General Waste", color: "bg-slate-600", emoji: "🗑️" },
    Glass: { bin: "Glass - Separate", color: "bg-cyan-500", emoji: "🍾" },
  },
  Germany: {
    Recycle: {
      bin: "Yellow Bin (Packaging)",
      color: "bg-yellow-400",
      emoji: "🟡",
    },
    Compost: { bin: "Bio Waste", color: "bg-brown-500", emoji: "🍂" },
    Trash: { bin: "Residual Waste", color: "bg-zinc-700", emoji: "🗑️" },
    Glass: { bin: "Glass Container", color: "bg-green-400", emoji: "🍾" },
    Paper: { bin: "Paper Bin", color: "bg-blue-400", emoji: "📰" }, // Example if model could detect paper
  },
  Other: {
    // Fallback
    Recycle: { bin: "Recycling Bin", color: "bg-blue-500", emoji: "♻️" },
    Compost: { bin: "Compost Bin", color: "bg-green-600", emoji: "🌿" },
    Trash: { bin: "Trash Bin", color: "bg-gray-600", emoji: "🗑️" },
    Glass: { bin: "Glass Recycling", color: "bg-sky-500", emoji: "🍾" },
  },
};

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    width="16px"
    height="16px"
    className="inline-block mr-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 1.905c-.007.379.137.752.431.992l1.003.827c.432.355.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 0 1-.22.128c-.333.183-.583.495-.646.87l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.646-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.905c.007-.379-.137-.752-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.646-.87l.213-1.28Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
    />
  </svg>
);

const CO2Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 12.75A3.75 3.75 0 0 0 3.75 9h-1.5a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h1.5a3.75 3.75 0 0 0 3.75-3.75Zm0 0h9.375m-13.125 0A3.75 3.75 0 0 1 7.5 9h1.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-1.5A3.75 3.75 0 0 1 .375 12.75Zm13.125 0A3.75 3.75 0 0 0 10.125 9h1.5a.75.75 0 0 0 .75.75v3a.75.75 0 0 0 .75.75h1.5a3.75 3.75 0 0 0 3.75-3.75Zm0 0h3.375c.621 0 1.125-.504 1.125-1.125V10.5c0-.621-.504-1.125-1.125-1.125h-3.375"
    />
  </svg>
);

export default function Home() {
  const [prediction, setPrediction] = useState<DisplayPrediction>({
    // Stores mapped type
    trashType: null,
    confidence: null,
  });
  const [selectedCountry, setSelectedCountry] =
    useState<string>("United States");

  const handlePrediction = (modelOutput: PredictionResult) => {
    let internalTrashType = modelOutput.trashType;
    // Map "Class 6" from model to "Glass" for our internal logic
    if (modelOutput.trashType === "Class 6") {
      internalTrashType = "Glass";
    }
    setPrediction({
      trashType: internalTrashType,
      confidence: modelOutput.confidence,
    });
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const currentBinsForCountry =
    countrySpecificBinInfo[selectedCountry] || countrySpecificBinInfo["Other"]; // Fallback to "Other"
  const currentBinInfo =
    prediction.trashType && currentBinsForCountry
      ? currentBinsForCountry[prediction.trashType]
      : null;

  return (
    <div className="flex flex-col min-h-screen items-center bg-lime-50 dark:bg-green-900 text-green-800 dark:text-lime-100 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="w-full max-w-md py-6">
        <h1 className="text-3xl font-bold text-center text-green-700 dark:text-lime-200">
          Trash Sorting App
        </h1>
      </header>

      {/* Camera and Prediction Section */}
      <main className="flex flex-col items-center w-full max-w-md flex-grow">
        {/* Teachable Machine Client - Camera View and Start Button */}
        <div className="w-full mb-6">
          <TeachableMachineClient onPrediction={handlePrediction} />
        </div>

        {/* Prediction Info */}
        <div className="w-full bg-white dark:bg-green-800/50 p-6 rounded-xl shadow-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-lg font-semibold text-green-700 dark:text-lime-200">
                Type:
              </p>
              {prediction.trashType ? (
                <p className="text-xl text-green-700 dark:text-lime-200">
                  {prediction.trashType}
                  {prediction.confidence && (
                    <span className="text-sm opacity-75">
                      {" "}
                      ({(prediction.confidence * 100).toFixed(0)}% confident)
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-md opacity-75 text-green-600 dark:text-lime-300">
                  [Waiting for prediction...]
                </p>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-green-700 dark:text-lime-200">
                Bin:
              </p>
              {currentBinInfo ? (
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{currentBinInfo.emoji}</span>
                  <p
                    className={`text-xl ${currentBinInfo.color.replace(
                      "bg-",
                      "text-"
                    )}`}
                  >
                    {currentBinInfo.bin}
                  </p>
                </div>
              ) : (
                <p className="text-md opacity-75 text-green-600 dark:text-lime-300">
                  [Waiting for type...]
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="w-full bg-white dark:bg-green-800/50 p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold text-green-700 dark:text-lime-200 mb-3 flex items-center">
            <SettingsIcon /> Settings
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label
                htmlFor="country"
                className="text-green-700 dark:text-lime-200"
              >
                Country:
              </label>
              <select
                id="country"
                name="country"
                value={selectedCountry} // Controlled component
                onChange={handleCountryChange} // Handle changes
                className="p-2 rounded-md border border-green-300 dark:border-green-600 bg-lime-50 dark:bg-green-700 text-green-800 dark:text-lime-100 focus:ring-lime-500 focus:border-lime-500"
              >
                {Object.keys(countrySpecificBinInfo).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-lime-200">
                Feedback:
              </span>
              <button className="text-lime-600 dark:text-lime-300 hover:underline">
                Send form
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Buttons */}
      <footer className="w-full max-w-md py-6 mt-auto">
        <div className="flex justify-around">
          <button className="p-3 bg-lime-200 dark:bg-green-700 rounded-lg shadow-md hover:bg-lime-300 dark:hover:bg-green-600 transition-colors">
            <LeafIcon />
          </button>
          <button className="p-3 bg-lime-200 dark:bg-green-700 rounded-lg shadow-md hover:bg-lime-300 dark:hover:bg-green-600 transition-colors">
            <CO2Icon />
          </button>
        </div>
      </footer>
    </div>
  );
}