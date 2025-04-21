
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Welcome to Your App
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Start building your amazing project with a powerful sidebar and responsive layout.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
            <p className="text-gray-400">
              Works perfectly on all devices, from mobile to desktop.
            </p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-2">Modern UI</h3>
            <p className="text-gray-400">
              Clean and intuitive interface with smooth animations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
