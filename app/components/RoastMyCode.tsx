'use client';

import { useState } from 'react';

export default function RoastMyCode() {
  const [code, setCode] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoast = async () => {
    if (!code.trim()) {
      setError('Please enter some code to roast!');
      return;
    }

    setLoading(true);
    setError('');
    setRoast('');

    try {
      const response = await fetch('/api/ai/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to roast code');
      }

      setRoast(data.roast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">🔥 Roast My Code</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let an AI senior engineer brutally review your code
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="code-input" className="block text-sm font-medium mb-2">
            Paste your code here:
          </label>
          <textarea
            id="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="function example() {&#10;  // Your code here...&#10;}"
            className="w-full h-64 p-4 font-mono text-sm border rounded-lg resize-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleRoast}
          disabled={loading || !code.trim()}
          className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Roasting...' : '🔥 Roast My Code'}
        </button>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {roast && (
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span>🎯</span> The Verdict
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {roast}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
