'use client';

import { useState } from 'react';

interface RequestCodeMessageProps {
  projectName: string;
  techStack: string;
  onMessageGenerated?: (message: string) => void;
}

export default function RequestCodeMessage({
  projectName,
  techStack,
  onMessageGenerated,
}: RequestCodeMessageProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateMessage = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/ai/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName, techStack }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate message');
      }

      setMessage(data.message);
      if (onMessageGenerated) {
        onMessageGenerated(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generateMessage}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Generating...' : '✨ Generate Request Message'}
      </button>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="space-y-3">
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Generated Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your generated message will appear here..."
            />
            <button
              onClick={copyToClipboard}
              className="absolute top-8 right-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You can edit the message above before sending
          </p>
        </div>
      )}
    </div>
  );
}
