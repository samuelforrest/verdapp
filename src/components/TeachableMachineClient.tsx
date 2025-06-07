"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
// @ts-expect-error No types available for this package
import * as tmImage from "@teachablemachine/image";

// Props for the TeachableMachineClient component
interface TeachableMachineClientProps {
  modelUrl: string;
  onPrediction: (prediction: string) => void; // Callback function for predictions
}

// Teachable Machine client component for image classification
const TeachableMachineClient: React.FC<TeachableMachineClientProps> = ({
  modelUrl,
  onPrediction,
}) => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null); // Stores the loaded Teachable Machine model
  const [maxPredictions, setMaxPredictions] = useState(0); // Maximum number of prediction classes
  const webcamContainerRef = useRef<HTMLDivElement>(null); // Reference to the div that will contain the webcam canvas
  const labelContainerRef = useRef<HTMLDivElement>(null); // Reference to the label container element
  const webcamInstanceRef = useRef<tmImage.Webcam | null>(null); // Store webcam instance

  // Make predictions on the webcam image
  const predict = useCallback(
    async (webcam: tmImage.Webcam) => {
      if (model && webcam.canvas) {
        const prediction = await model.predict(webcam.canvas);
        let highestPrediction = "";
        let highestProb = 0;
        for (let i = 0; i < maxPredictions; i++) {
          if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            highestPrediction = prediction[i].className;
          }
          // Optional: Display all predictions
          // if (labelContainerRef.current && labelContainerRef.current.childNodes[i]) {
          //   labelContainerRef.current.childNodes[i].innerHTML = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
          // }
        }
        if (highestProb > 0.8) {
          // Confidence threshold
          onPrediction(highestPrediction); // Send the highest probability prediction
        }
      }
    },
    [model, maxPredictions, onPrediction]
  );

  // Prediction loop
  const loop = useCallback(
    async (webcam: tmImage.Webcam) => {
      webcam.update(); // Update the webcam frame
      await predict(webcam);
      if (webcamInstanceRef.current) {
        // Check if webcam is still active
        window.requestAnimationFrame(() => loop(webcam));
      }
    },
    [predict]
  );

  // Load the Teachable Machine model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tmImage.load(
          modelUrl + "model.json",
          modelUrl + "metadata.json"
        );
        setModel(loadedModel);
        setMaxPredictions(loadedModel.getTotalClasses());
      } catch (error) {
        console.error("Error loading model:", error);
        // Consider displaying an error message to the user
      }
    };
    loadModel();
  }, [modelUrl]);

  // Initialize webcam
  useEffect(() => {
    if (model && !webcamInstanceRef.current && webcamContainerRef.current) {
      const setupWebcam = async () => {
        const flip = true; // Whether to flip the webcam
        const webcam = new tmImage.Webcam(400, 400, flip); // Initialize webcam with desired size
        try {
          await webcam.setup(); // Request access to the webcam
          await webcam.play();
          webcamInstanceRef.current = webcam; // Store webcam instance

          // Append the webcam canvas to the container
          if (webcamContainerRef.current) {
            webcamContainerRef.current.innerHTML = ""; // Clear previous content
            webcamContainerRef.current.appendChild(webcam.canvas);
          }
          window.requestAnimationFrame(() => loop(webcam));
        } catch (error) {
          console.error("Error setting up webcam:", error);
          // Consider displaying an error message to the user
        }
      };
      setupWebcam();
    }

    // Cleanup function to stop webcam
    return () => {
      if (webcamInstanceRef.current) {
        webcamInstanceRef.current.stop();
        webcamInstanceRef.current = null;
      }
      // Clear the container if needed when component unmounts or model changes
      // if (webcamContainerRef.current) {
      //   webcamContainerRef.current.innerHTML = '';
      // }
    };
  }, [model, loop]); // loop is a dependency

  return (
    <div className="flex flex-col items-center bg-light-green p-6 rounded-lg shadow-md">
      {/* Webcam display area - canvas will be appended here */}
      <div
        ref={webcamContainerRef}
        className="w-full max-w-md h-auto rounded-md overflow-hidden border-4 border-pine-green mb-4 bg-black"
        style={{ width: "400px", height: "400px" }}
      ></div>
      {/* Label container for displaying predictions (optional) */}
      <div
        ref={labelContainerRef}
        id="label-container"
        className="text-center text-forest-green"
      ></div>
    </div>
  );
};

export default TeachableMachineClient;
