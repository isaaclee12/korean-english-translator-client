import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Translator from "./Translator";
import KoreanBreakdown from "./KoreanBreakdown";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Korean-English Translator
              </Link>
              <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link to="/" className="text-gray-900 hover:text-primary-600 font-medium ml-16">
                    Translator
                  </Link>
                  <Link to="/korean-breakdown" className="text-gray-900 hover:text-primary-600 font-medium ml-16">
                    Korean Breakdown
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </nav>

        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<Translator />} />
              <Route path="/korean-breakdown" element={<KoreanBreakdown />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
