'use client';

import { useState, useRef, useEffect } from 'react';

interface RequestCodeMessageProps {
  projectName: string;
  techStack: string;
  onMessageGenerated?: (message: string) => void;
}

const PRE_DEFINED_MESSAGES = [
  "Hi Anirudha! I loved exploring your PORTFOLIO_NAME project and would really appreciate learning from your approach. Could you please share the source code with me?",
  "Hey there! I was really impressed by what you built with PORTFOLIO_NAME. Would it be possible to get access to the repository to see how you structured the code?",
  "Hello Anirudha, your work on PORTFOLIO_NAME is fantastic! I am trying to build something similar and would love to study your source code if you're open to sharing it.",
  "Hi! I came across your PORTFOLIO_NAME project and was blown away. Could you kindly share the code so I can understand your TECH_STACK implementation better?",
  "Hey Anirudha, amazing work on PORTFOLIO_NAME! I'm very interested in learning from your coding style. Would you mind sharing the source codebase with me?"
];

export default function RequestCodeMessage({
  projectName,
  techStack,
  onMessageGenerated,
}: RequestCodeMessageProps) {
  const [message, setMessage] = useState('');
  const [fullMessage, setFullMessage] = useState('');
  const [highlight, setHighlight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightTimerRef = useRef<number | null>(null);

  const generateMessage = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Simulate a small delay for a natural UX transition
      await new Promise((resolve) => setTimeout(resolve, 400));

      const randomIndex = Math.floor(Math.random() * PRE_DEFINED_MESSAGES.length);
      const rawMessage = PRE_DEFINED_MESSAGES[randomIndex];
      
      const full = rawMessage
        .replace(/PORTFOLIO_NAME/g, projectName || "project")
        .replace(/TECH_STACK/g, techStack || "tech");

      setFullMessage(full);
      const preview = computePreview(full);
      setMessage(preview);
      // Focus and highlight the textarea so user sees the preview immediately
      setTimeout(() => {
        try {
          textareaRef.current?.focus();
          textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {
          /* ignore */
        }
        setHighlight(true);
        if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = window.setTimeout(() => setHighlight(false), 3000);
      }, 50);
      if (onMessageGenerated) onMessageGenerated(preview);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
  };

  function computePreview(txt: string) {
    if (!txt) return '';
    const firstLine = txt.split(/\r?\n/).find(l => l.trim()) || '';
    const firstSentenceMatch = firstLine.match(/^[^.!?]*[.!?]?/);
    let minimal = firstSentenceMatch ? firstSentenceMatch[0].trim() : firstLine.trim();
    if (!minimal) minimal = firstLine.trim();
    if (minimal && !/[.!?]$/.test(minimal)) minimal = `${minimal}.`;
    const words = minimal.split(/\s+/).filter(Boolean);
    if (words.length > 25) {
      minimal = words.slice(0, 25).join(' ') + '...';
    }
    return minimal;
  }

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
    };
  }, []);

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
            <label className="block text-sm font-medium mb-2">Generated Message:</label>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                // if user edits, remove highlight
                if (highlight) setHighlight(false);
              }}
              className={`w-full h-32 p-3 border rounded-lg resize-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${highlight ? 'ring-4 ring-blue-400/50 ring-offset-2 animate-pulse' : ''}`}
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

          {fullMessage && fullMessage !== message && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Preview (single-line):</strong>
                  <div className="text-sm mt-1">{message}</div>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMessage(fullMessage);
                      if (onMessageGenerated) onMessageGenerated(fullMessage);
                      // focus and highlight when restoring
                      setTimeout(() => {
                        textareaRef.current?.focus();
                        textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setHighlight(true);
                        if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
                        highlightTimerRef.current = window.setTimeout(() => setHighlight(false), 3000);
                      }, 50);
                    }}
                    className="px-3 py-1 bg-white dark:bg-gray-800 border rounded text-xs"
                  >
                    Restore full
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400">You can edit the message above before sending</p>
        </div>
      )}
    </div>
  );
}
