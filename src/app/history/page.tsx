\
// src/app/history/page.tsx
import React from 'react';

const HistoryPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 bg-background-app text-text-on-light-primary font-sans">
      <div className="w-full max-w-5xl mx-auto mt-8">
        <h1 className="text-5xl font-bold text-center text-forest-green font-serif mb-12">
          Scan History
        </h1>
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
          <p className="text-xl text-gray-700">
            The History page is currently under construction.
          </p>
          <p className="mt-4 text-gray-600">
            This section will display your past scan results and CO2 calculations.
          </p>
          {/* Placeholder for future graph or list of history items */}
          <div className="mt-8">
            <span className="text-6xl">🚧</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HistoryPage;
