import React, { useState } from "react";

interface KoreanWordAnalysis {
  phrase: string;
  pronunciation: string;
  origin: string;
  example: string;
  context: string;
  formality: {
    level: string;
    alternatives: string[];
  };
}

const KoreanBreakdown: React.FC = () => {
  const [lookupPhrase, setLookupPhrase] = useState("");
  const [analysis, setAnalysis] = useState<KoreanWordAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestDuration, setRequestDuration] = useState<number | null>(null);

  const handleLookupPhrase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhrase.trim()) return;

    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetch('http://localhost:8000/api/v0/phrase-lookup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phrase: lookupPhrase }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // The API returns a string, so we need to parse it as JSON
      const parsedAnalysis = JSON.parse(data.analysis);
      setAnalysis(parsedAnalysis);
      const endTime = performance.now();
      setRequestDuration(endTime - startTime);
    } catch (err) {
      setError(`Failed to fetch phrase analysis: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Korean Breakdown</h1>

        <div className="mb-8">
          <form onSubmit={handleLookupPhrase} className="space-y-4">
            <div>
              <label htmlFor="lookup-phrase" className="block text-sm font-medium text-gray-700 mb-2">
                Enter a Korean phrase:
              </label>
              <input
                type="text"
                id="lookup-phrase"
                value={lookupPhrase}
                onChange={(e) => setLookupPhrase(e.target.value)}
                placeholder="Enter a Korean phrase..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Looking up...' : 'Look Up'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {analysis && (
          <div className="mt-8 space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Phrase Details</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Phrase:</span> {analysis.phrase}
                </div>
                <div>
                  <span className="font-medium">Pronunciation:</span> {analysis.pronunciation}
                </div>
                <div>
                  <span className="font-medium">Origin:</span> {analysis.origin}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Example Usage</h2>
              <p className="text-gray-700">{analysis.example}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Cultural Context</h2>
              <p className="text-gray-700">{analysis.context}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Formality Level</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Level:</span> {analysis.formality.level}
                </div>
                {analysis.formality.alternatives.length > 0 && (
                  <div>
                    <span className="font-medium">Alternative Forms:</span>
                    <ul className="list-disc pl-6 mt-2">
                      {analysis.formality.alternatives.map((alt, index) => (
                        <li key={index}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {requestDuration && (
              <div className="text-sm text-gray-500 mt-4">
                Request took {requestDuration.toFixed(1)}ms
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KoreanBreakdown;
