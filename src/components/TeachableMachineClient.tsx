"use client";

import { useEffect, useRef } from "react";

// To inform TypeScript about global objects from external scripts
declare global {
  interface Window {
    tmImage: any; // Teachable Machine Image library
    tf: any; // TensorFlow.js
  }
}

// The link to your model provided by Teachable Machine export panel
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Z49AQXORf/";

const TeachableMachineClient = () => {
  const webcamContainerRef = useRef<HTMLDivElement>(null);
  const labelContainerRef = useRef<HTMLDivElement>(null);

  const modelRef = useRef<any>(null); // Stores the loaded Teachable Machine model
  const webcamRef = useRef<any>(null); // Stores the webcam instance
  const maxPredictionsRef = useRef<number>(0); // Stores the total number of classes
  const animationFrameIdRef = useRef<number | null>(null); // Stores the ID of the animation frame for cleanup

  // Initializes the Teachable Machine model and webcam
  const init = async () => {
    // Check if the necessary scripts are loaded
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
      // Load the model and metadata
      modelRef.current = await window.tmImage.load(modelURL, metadataURL);
      maxPredictionsRef.current = modelRef.current.getTotalClasses();

      // Setup webcam
      const flip = true; // Whether to flip the webcam
      webcamRef.current = new window.tmImage.Webcam(200, 200, flip); // width, height, flip
      await webcamRef.current.setup(); // Request access to the webcam
      await webcamRef.current.play();

      // Cancel any existing animation frame to prevent multiple loops
      if (animationFrameIdRef.current) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
      // Start the prediction loop
      animationFrameIdRef.current = window.requestAnimationFrame(loop);

      // Append webcam canvas to the DOM
      if (webcamContainerRef.current) {
        webcamContainerRef.current.innerHTML = ""; // Clear previous canvas
        webcamContainerRef.current.appendChild(webcamRef.current.canvas);
      }

      // Create label containers for predictions
      if (labelContainerRef.current) {
        labelContainerRef.current.innerHTML = ""; // Clear previous labels
        for (let i = 0; i < maxPredictionsRef.current; i++) {
          labelContainerRef.current.appendChild(document.createElement("div"));
        }
      }
    } catch (error) {
      console.error("Error initializing Teachable Machine:", error);
      alert(
        "Failed to initialize the camera or model. Please check permissions and model URL."
      );
    }
  };

  // Prediction loop: updates webcam frame, predicts, and requests next frame
  const loop = async () => {
    if (webcamRef.current) {
      webcamRef.current.update(); // Update the webcam frame
      await predict();
      animationFrameIdRef.current = window.requestAnimationFrame(loop);
    }
  };

  // Runs the webcam image through the image model and updates labels
  const predict = async () => {
    if (
      modelRef.current &&
      webcamRef.current &&
      webcamRef.current.canvas &&
      labelContainerRef.current
    ) {
      try {
        // Predict can take in an image, video or canvas html element
        const prediction = await modelRef.current.predict(
          webcamRef.current.canvas
        );
        for (let i = 0; i < maxPredictionsRef.current; i++) {
          const classPrediction =
            prediction[i].className +
            ": " +
            prediction[i].probability.toFixed(2);
          // Update the content of the corresponding label div
          if (labelContainerRef.current.childNodes[i]) {
            (labelContainerRef.current.childNodes[i] as HTMLElement).innerHTML =
              classPrediction;
          }
        }
      } catch (error) {
        console.error("Error during prediction:", error);
        // Optionally, you could stop the loop here if predictions consistently fail
        // if (animationFrameIdRef.current) {
        //   window.cancelAnimationFrame(animationFrameIdRef.current);
        // }
      }
    }
  };

  // Effect for cleanup: stops webcam and cancels animation frame when component unmounts
  useEffect(() => {
    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop();
      }
      if (animationFrameIdRef.current) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

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
      >
        {/* Webcam canvas will be appended here by the init function */}
      </div>
      <div
        id="label-container"
        ref={labelContainerRef}
        className="flex flex-col gap-1.5 mt-3 text-base text-green-700 dark:text-lime-300 w-full max-w-xs items-center"
      >
        {/* Prediction labels will be appended here by the init function */}
      </div>
    </div>
  );
};

export default TeachableMachineClient;
