"use client";

import { useEffect, useRef } from "react";

interface TMPrediction {
  className: string;
  probability: number;
}

interface TMImageModel {
  predict: (canvas: HTMLCanvasElement) => Promise<TMPrediction[]>;
  getTotalClasses: () => number;
}

interface TMWebcam {
  setup: (options?: { facingMode?: string }) => Promise<void>;
  play: () => Promise<void>;
  stop: () => void;
  update: () => void;
  canvas: HTMLCanvasElement;
}

interface TF {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

declare global {
  interface Window {
    tmImage: {
      load: (modelURL: string, metadataURL: string) => Promise<TMImageModel>;
      Webcam: new (width: number, height: number, flip: boolean) => TMWebcam;
    };
    tf: TF;
  }
}

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Z49AQXORf/";

interface TeachableMachineClientProps {
  onPrediction: (prediction: {
    trashType: string | null;
    confidence: number | null;
  }) => void;
}

const TeachableMachineClient: React.FC<TeachableMachineClientProps> = ({
  onPrediction,
}) => {
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const labelContainerRef = useRef<HTMLDivElement>(null);

  const modelRef = useRef<TMImageModel | null>(null);
  const webcamRef = useRef<TMWebcam | null>(null);
  const maxPredictionsRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  const init = async () => {
    if (!window.tmImage) {
      console.error("Teachable Machine Image script (tmImage) not loaded yet.");
      alert(
        "Error: Teachable Machine script not loaded. Please ensure you have an internet connection and try again."
      );
      return;
    }
    if (!window.tf) {
      console.error("TensorFlow.js (tf) script not loaded yet.");
      alert(
        "Error: TensorFlow.js script not loaded. Please ensure you have an internet connection and try again."
      );
      return;
    }

    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    try {
      modelRef.current = await window.tmImage.load(modelURL, metadataURL);
      maxPredictionsRef.current = modelRef.current.getTotalClasses();

      const flip = true;
      webcamRef.current = new window.tmImage.Webcam(200, 200, flip);
      await webcamRef.current.setup({ facingMode: "environment" });
      await webcamRef.current.play();

      if (animationFrameIdRef.current) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
      animationFrameIdRef.current = window.requestAnimationFrame(loop);

      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = "";
        webcamContainerRef.current.appendChild(webcamRef.current.canvas);
      }

      if (labelContainerRef.current) {
        labelContainerRef.current.innerHTML = "";
        for (let i = 0; i < maxPredictionsRef.current; i++) {
          const div = document.createElement("div");
          div.className = "text-sm";
          labelContainerRef.current.appendChild(div);
        }
      }
    } catch (error) {
      console.error("Error initializing Teachable Machine:", error);
      alert(
        "Failed to initialize the camera or model. Please check permissions and model URL."
      );
    }
  };

  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update();
      await predict();
      animationFrameIdRef.current = window.requestAnimationFrame(loop);
    }
  };

  const predict = async () => {
    if (
      modelRef.current &&
      webcamRef.current &&
      webcamRef.current.canvas &&
      labelContainerRef.current
    ) {
      try {
        const predictions = await modelRef.current.predict(
          webcamRef.current.canvas
        );
        let highestProb = 0;
        let predictedClass: string | null = null;

        for (let i = 0; i < maxPredictionsRef.current; i++) {
          const prediction = predictions[i];
          const classPredictionText =
            prediction.className + ": " + prediction.probability.toFixed(2);

          if (labelContainerRef.current.childNodes[i]) {
            (labelContainerRef.current.childNodes[i] as HTMLElement).innerHTML =
              classPredictionText;
          }

          if (prediction.probability > highestProb) {
            highestProb = prediction.probability;
            predictedClass = prediction.className;
          }
        }
        if (predictedClass) {
          onPrediction({ trashType: predictedClass, confidence: highestProb });
        } else {
          onPrediction({ trashType: null, confidence: null });
        }
      } catch (error) {
        console.error("Error during prediction:", error);
        onPrediction({ trashType: null, confidence: null });
      }
    } else {
      onPrediction({ trashType: null, confidence: null });
    }
  };

  useEffect(() => {
    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop();
      }
      if (animationFrameIdRef.current) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-green-300 dark:border-green-600 rounded-lg bg-white/70 dark:bg-green-800/50 shadow-xl">
      <div className="text-xl font-semibold text-green-700 dark:text-lime-200">
        Teachable Machine Image Model
      </div>
      <button
        type="button"
        onClick={init}
        className="px-6 py-3 bg-lime-500 hover:bg-lime-600 text-white dark:bg-green-500 dark:hover:bg-green-600 rounded-lg transition-colors shadow-md hover:shadow-lg text-lg font-medium"
      >
        Start Camera
      </button>
      <div
        id="webcam-container"
        ref={webcamContainerRef}
        className="w-[200px] h-[200px] bg-gray-300 dark:bg-gray-600 rounded-md overflow-hidden shadow-inner border border-gray-400 dark:border-gray-500"
      ></div>
      <div
        id="label-container"
        ref={labelContainerRef}
        className="flex flex-col gap-1.5 mt-3 text-base text-green-700 dark:text-lime-300 w-full max-w-xs items-start"
      ></div>
    </div>
  );
};

export default TeachableMachineClient;
