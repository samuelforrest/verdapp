// src/app/about/page.tsx
import React from "react";
import Link from "next/link";
import "../globals.css"; // Import global styles for background and fonts

const AboutPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-transparent text-text-on-light-primary font-sans">
      <div className="w-full max-w-5xl mx-auto mt-8">
        <h1 className="text-5xl font-bold text-center text-verda-green font-serif mb-12">
          About Verda
        </h1>
        <div className="bg-white p-8 rounded-xl shadow-2xl space-y-6">
          <section>
            <h2 className="text-3xl font-semibold text-pine-green mb-3">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We aim to encourage users to make more environmentally conscious
              descisions. Our motto is{" "}
              <span className="font-semibold">Track More, Waste Less.</span> We
              have 2 platforms on one; our Trash Sorter and the CO2 Calculator,
              which link together with our backend 'history' database for users
              with an account.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-pine-green mb-3">
              Features
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 pl-4">
              <li>
                <strong>Trash Sorter:</strong> Uses AI to identify items via your
                camera and suggests the correct disposal bin based on regional
                guidelines.
              </li>
              <li>
                <strong>CO2 Calculator:</strong> Helps you estimate the carbon
                footprint of your activities.
              </li>
              <li>
                <strong>History: </strong>Track your trash scans scans and CO2
                calculations & AI recommendations over time, as you take into
                account AI reccomendations
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
              classification models quickly and easily. <br></br>
              <br></br>The model was trained using the{" "}
              <Link
                href="https://github.com/garythung/trashnet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-green hover:text-forest-green underline"
              >
                TrashNet dataset
              </Link>
              .
              <br></br>
              <br></br>We also used Google Gemini 2.0 Flash model to power the AI
              recommendations and the calculation of your average CO2 emissions
              lifetime. This could not be done with a simple mathematical formula,
              as there are so many parameters and things to consider.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-pine-green mb-3">
              Contact Us
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Have questions or feedback? Did the AI not respond? We’d love to
              hear from you! Reach out to us at{" "}
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
