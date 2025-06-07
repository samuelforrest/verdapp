"use client";

import Image from "next/image";
import TeachableMachineClient from "@/components/TeachableMachineClient";
import { useState } from "react";

interface PredictionResult {
  trashType: string | null;
  confidence: number | null;
}

const binInfo: Record<string, { bin: string; color: string; emoji: string }> = {
  Recycle: { bin: "Recycling Bin", color: "bg-blue-500", emoji: "♻️" },
  Compost: { bin: "Compost Bin", color: "bg-green-600", emoji: "🌿" },
  Trash: { bin: "Trash Bin", color: "bg-gray-600", emoji: "🗑️" },
};

export default function Home() {
  const [prediction, setPrediction] = useState<PredictionResult>({
    trashType: null,
    confidence: null,
  });

  const handlePrediction = (result: PredictionResult) => {
    setPrediction(result);
  };

  const currentBinInfo = prediction.trashType
    ? binInfo[prediction.trashType]
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-8 p-8 sm:p-12 md:p-24 bg-lime-50 dark:bg-green-900 text-green-800 dark:text-lime-100">
      <div className="z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between font-mono text-sm">
        <p className="w-full sm:w-auto flex justify-center sm:justify-start border-b border-green-300 bg-gradient-to-b from-lime-200 pb-4 pt-6 backdrop-blur-2xl dark:border-green-700 dark:bg-green-800/60 dark:from-inherit lg:rounded-xl lg:border lg:bg-lime-100 lg:p-4 lg:dark:bg-green-800/60 text-center sm:text-left mb-4 sm:mb-0">
          Trash Sorting App
        </p>
        <div className="flex h-auto items-end justify-center lg:static lg:size-auto lg:bg-none opacity-75 hover:opacity-100 transition-opacity">
          <a
            className="flex place-items-center gap-2 p-4 lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={80}
              height={20}
              priority
            />
          </a>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center">
        <TeachableMachineClient onPrediction={handlePrediction} />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
        <div className="group rounded-xl border border-green-300 dark:border-green-700 bg-white dark:bg-green-800/50 p-6 shadow-md transition-all hover:shadow-lg hover:border-green-400 dark:hover:border-green-500 min-h-[150px]">
          <h2 className="mb-3 text-2xl font-semibold text-green-700 dark:text-lime-200">
            Detected Trash Type{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          {prediction.trashType ? (
            <p className="m-0 max-w-[30ch] text-lg opacity-90 text-green-700 dark:text-lime-200 mx-auto md:mx-0">
              {prediction.trashType}{" "}
              {prediction.confidence && (
                <span className="text-sm opacity-75">
                  {" "}
                  ({(prediction.confidence * 100).toFixed(0)}% confident)
                </span>
              )}
            </p>
          ) : (
            <p className="m-0 max-w-[30ch] text-sm opacity-75 text-green-600 dark:text-lime-300 mx-auto md:mx-0">
              [Waiting for model prediction...]
            </p>
          )}
        </div>

        <div
          className={`group rounded-xl border ${
            currentBinInfo
              ? "border-transparent"
              : "border-green-300 dark:border-green-700"
          } bg-white dark:bg-green-800/50 p-6 shadow-md transition-all hover:shadow-lg min-h-[150px] ${
            currentBinInfo ? currentBinInfo.color : ""
          }`}
        >
          <h2
            className={`mb-3 text-2xl font-semibold ${
              currentBinInfo
                ? "text-white"
                : "text-green-700 dark:text-lime-200"
            }`}
          >
            Designated Bin{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          {currentBinInfo ? (
            <div className="m-0 max-w-[30ch] text-lg opacity-90 text-white mx-auto md:mx-0 flex items-center gap-2">
              <span className="text-3xl">{currentBinInfo.emoji}</span>
              <span>{currentBinInfo.bin}</span>
            </div>
          ) : (
            <p className="m-0 max-w-[30ch] text-sm opacity-75 text-green-600 dark:text-lime-300 mx-auto md:mx-0">
              [Waiting for trash type...]
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
