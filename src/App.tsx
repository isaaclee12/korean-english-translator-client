import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Anthropic from '@anthropic-ai/sdk';
// TypeScript types for Anthropic API response
interface AnthropicResponse {
  completion: string;
}

// Main translation function
const translate = async (text: string, from: "en" | "ko", to: "en" | "ko") => {
  try {
    return await translateWithAnthropic(text, from, to);
  } catch (error: unknown) {
    console.error("Anthropic API failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return `Translation failed: ${errorMessage}`;
  }
};

// Anthropic API implementation
const translateWithAnthropic = async (
  text: string,
  from: "en" | "ko",
  to: "en" | "ko"
) => {
  try {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Anthropic API key not found");
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const msg = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: "Hello, Claude" }],
    });
    return msg;
//     const response = await fetch("https://api.anthropic.com/v1/complete", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": apiKey,
//       },
//       body: JSON.stringify({
//         model: "claude-2",
//         prompt: `Translate the following text from ${from.toUpperCase()} to ${to.toUpperCase()}:

// ${text}

// Translation:`,
//         max_tokens: 300,
//         temperature: 0.7,
//       }),
//     });

    // if (!response.ok) {
    //   throw new Error(`API error: ${response.status} ${response.statusText}`);
    // }

    // const data = (await response.json()) as AnthropicResponse;
    // return data.completion.trim();
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Translation failed. Please try again.");
  }
};

interface TranslationHistoryItem {
  fromLang: "en" | "ko";
  toLang: "en" | "ko";
  original: string;
  translated: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [fromLang, setFromLang] = useState<"en" | "ko">("en");
  const [toLang, setToLang] = useState<"en" | "ko">("ko");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSwap = () => {
    // Swap languages
    const newFromLang = toLang;
    const newToLang = fromLang;

    setFromLang(newFromLang);
    setToLang(newToLang);

    // Swap input/output
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const handleTranslate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const translated = await translate(input, fromLang, toLang);
      setOutput(translated);

      // Add to history
      const newHistoryItem: TranslationHistoryItem = {
        fromLang,
        toLang,
        original: input,
        translated,
        timestamp: new Date().toLocaleString(),
      };

      setHistory((prev) => [...prev, newHistoryItem]);
    } catch (error) {
      console.error("Translation error:", error);
      setOutput("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
        <div className="flex-1 transition-all duration-300">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Korean-English Translator
          </h1>
          <div className="flex justify-center gap-2 mb-4">
            <select
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value as "en" | "ko")}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="en">English</option>
              <option value="ko">Korean</option>
            </select>
            <button
              onClick={handleSwap}
              title="Swap languages"
              className="rounded-full w-8 h-8 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ⇄
            </button>
            <select
              value={toLang}
              onChange={(e) => setToLang(e.target.value as "en" | "ko")}
              className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="en">English</option>
              <option value="ko">Korean</option>
            </select>
          </div>
          <textarea
            ref={inputRef}
            rows={4}
            placeholder={`Enter text in ${
              fromLang === "en" ? "English" : "Korean"
            }...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault();
                handleTranslate();
              } else if (e.key === " " && !loading) {
                e.preventDefault();
                handleSwap();
              }
            }}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mb-4 p-2"
          />
          <button
            onClick={handleTranslate}
            disabled={loading || !input}
            className={`w-full rounded-md px-4 py-2 text-sm font-medium ${
              loading || !input
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700 text-white"
            }`}
          >
            {loading ? "Translating..." : "Translate"}
          </button>
          <textarea
            rows={4}
            placeholder={`Translation in ${
              toLang === "en" ? "English" : "Korean"
            }...`}
            value={output}
            readOnly
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 mt-4 p-2"
          />
        </div>
        {history.length > 0 && (
          <div className="w-full md:w-80 bg-gray-50 rounded-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Translation History
            </h2>
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
              {history.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{item.timestamp}</span>
                    <span>
                      {item.fromLang.toUpperCase()} →{" "}
                      {item.toLang.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-700">{item.original}</p>
                    <p className="mt-1 text-gray-600">{item.translated}</p>
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

export default App;
