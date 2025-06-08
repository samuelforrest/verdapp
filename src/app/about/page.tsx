// src/app/about/page.tsx
import React from "react";
import Link from "next/link";

const AboutPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-background-app text-text-on-light-primary font-sans">
      <div className="w-full max-w-5xl mx-auto mt-8">
        <h1 className="text-5xl font-bold text-center text-forest-green font-serif mb-12">
          About EcoScan
        </h1>
        <div className="bg-white p-8 rounded-xl shadow-2xl space-y-6">
          <section>
            <h2 className="text-3xl font-semibold text-pine-green mb-3">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              EcoScan aims to empower users to make more environmentally
              conscious decisions. By providing tools to easily identify
              recyclable materials and understand their carbon footprint, we
              hope to contribute to a greener planet.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-pine-green mb-3">
              Features
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 pl-4">
              <li>
                <strong>Trash Sorter:</strong> Uses AI to identify items via
                your camera and suggests the correct disposal bin based on
                regional guidelines.
              </li>
              <li>
                <strong>CO2 Calculator:</strong> Helps you estimate the carbon
                footprint of your activities.
              </li>
              <li>
                <strong>History:</strong> (Coming Soon) Track your scans and CO2
                calculations over time.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-pine-green mb-3">
              Technology Used
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              The Trash Sorter feature is powered by machine learning models
              created with{" "}
              <Link
                href="https://teachablemachine.withgoogle.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-green hover:text-forest-green underline"
              >
                Google’s Teachable Machine
              </Link>
              . This amazing tool allows for the creation of custom image
              classification models quickly and easily. The model was trained
              using the{" "}
              <Link
                href="https://github.com/garythung/trashnet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-green hover:text-forest-green underline"
              >
                TrashNet dataset
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-pine-green mb-3">
              Contact Us
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Have questions or feedback? We’d love to hear from you! Reach out
              to us at{" "}
              <Link
                href="mailto:kunseljchodak@gmail.com"
                className="text-emerald-green hover:text-forest-green underline"
              >
                kunseljchodak@gmail.com
              </Link>{" "}
              and{" "}
              <Link
                href="mailto:sam@samuelforrest.me"
                className="text-emerald-green hover:text-forest-green underline"
              >
                sam@samuelforrest.me
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
