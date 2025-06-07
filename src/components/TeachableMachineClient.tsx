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
      webcamRef.current.canvas
      // labelContainerRef.current will be checked more robustly below
    ) {
      const currentLabelContainer = labelContainerRef.current;
      if (!currentLabelContainer) {
        // If labelContainerRef.current is null here, exit early or handle
        onPrediction({ trashType: null, confidence: null });
        return;
      }

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

          // Robust check for labelContainerRef and its childNodes
          if (
            currentLabelContainer.childNodes &&
            currentLabelContainer.childNodes[i]
          ) {
            (currentLabelContainer.childNodes[i] as HTMLElement).innerHTML =
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
    <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-white/70 backdrop-blur-sm border border-leaf-green/30 shadow-md w-full">
      <div className="text-xl font-serif font-semibold text-pine-green">
        Live Camera Feed
      </div>
      <div
        ref={webcamContainerRef}
        className="w-full max-w-xs h-auto aspect-square bg-stone-gray/20 rounded-md overflow-hidden shadow-inner flex items-center justify-center"
      >
        {/* Webcam canvas will be appended here */}
        <p className="text-sm text-bark-brown p-4">
          Click &quot;Start Camera&quot; to begin.
        </p>
      </div>
      <button
        type="button"
        onClick={init}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-leaf-green hover:bg-pine-green text-white rounded-lg transition-colors shadow-md hover:shadow-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-leaf-green focus:ring-offset-2 focus:ring-offset-pale-leaf"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
          />
        </svg>
        Start Camera
      </button>
      <div
        ref={labelContainerRef}
        className="w-full text-center text-sm text-bark-brown"
      >
        {/* Prediction labels will be appended here */}
        {/* Initial placeholder text can be added if desired */}
      </div>
    </div>
  );
};

export default TeachableMachineClient;
