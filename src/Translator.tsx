import React, { useState, useEffect, useRef } from "react";

interface TranslationHistoryItem {
  fromLang: "en" | "ko";
  toLang: "en" | "ko";
  original: string;
  translated: string;
  timestamp: string;
}

interface TranslatorProps {
  onWordClick?: (word: string) => void;
}

const translate = async (text: string, from: "en" | "ko", to: "en" | "ko") => {
  try {
    const response = await fetch('http://localhost:8000/api/v0/translate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        from,
        to
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.translation;
  } catch (error: unknown) {
    console.error("Backend API failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return `Translation failed: ${errorMessage}`;
  }
};

const Translator: React.FC<TranslatorProps> = ({ onWordClick }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fromLang, setFromLang] = useState<"en" | "ko">("en");
  const [toLang, setToLang] = useState<"en" | "ko">("ko");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [requestDuration, setRequestDuration] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSwap = () => {
    const newFromLang = toLang;
    const newToLang = fromLang;

    setFromLang(newFromLang);
    setToLang(newToLang);

    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const handleTranslate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const startTime = performance.now();
    try {
      const translated = await translate(input, fromLang, toLang);
      setOutput(translated);

      const newHistoryItem: TranslationHistoryItem = {
        fromLang,
        toLang,
        original: input,
        translated,
        timestamp: new Date().toLocaleString(),
      };

      setHistory((prev) => [...prev, newHistoryItem]);
      const endTime = performance.now();
      setRequestDuration(endTime - startTime);
    } catch (error) {
      console.error("Translation error:", error);
      setOutput("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (word: string) => {
    if (onWordClick) {
      onWordClick(word);
    }
  };

  return (
    <div className="flex-1 transition-all duration-300">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Korean-English Translator
      </h1>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">
                {fromLang === 'en' ? 'English' : 'Korean'}
              </span>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-700 font-medium">
                {toLang === 'en' ? 'English' : 'Korean'}
              </span>
            </div>
            <button
              onClick={handleSwap}
              className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors flex items-center gap-2 mt-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Swap Languages
            </button>
          </div>
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter text in ${fromLang === 'en' ? 'English' : 'Korean'}`}
              className="w-full h-64 p-6 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleTranslate();
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleTranslate}
            disabled={loading}
            className={`px-8 py-3 rounded-lg text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>

        <div className="mt-8">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Translation</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">From: {fromLang.toUpperCase()}</span>
                <span className="text-sm text-gray-500">To: {toLang.toUpperCase()}</span>
              </div>
              <div className="space-y-4">
                <div className="text-gray-600 text-lg">
                  {output.split('\n').map((line, index) => (
                    <div key={index} className="mb-4">
                      <p className="break-words leading-relaxed">
                        {line}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {requestDuration && (
                <div className="text-sm text-gray-500 mt-4">
                  Request took {requestDuration.toFixed(1)}ms
                </div>
              )}
            </div>
          </div>
        </div>
        {history.length > 0 && (
          <div className="w-full md:w-80 bg-gray-50 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Translation History
            </h2>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {history.map((item, index) => (
                <div key={index} className="mt-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Translation</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">From: {item.fromLang.toUpperCase()}</span>
                        <span className="text-sm text-gray-500">To: {item.toLang.toUpperCase()}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-gray-600">
                          {item.translated.split('\n').map((line, index) => (
                            <div key={index} className="mb-4">
                              <p className="break-words leading-relaxed">
                                {line}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {requestDuration && (
                        <div className="text-sm text-gray-500 mt-4">
                          Request took {requestDuration.toFixed(1)}ms
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translator;
