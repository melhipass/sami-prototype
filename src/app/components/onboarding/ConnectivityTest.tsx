import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface ConnectivityTestProps {
  onComplete: (success: boolean) => void;
  onRetry: () => void;
  shouldFail: boolean;
}

export function ConnectivityTest({ onComplete, onRetry, shouldFail }: ConnectivityTestProps) {
  const [attempt, setAttempt] = useState(1);
  const [hasError, setHasError] = useState(false);
  const maxAttempts = 5;

  useEffect(() => {
    const timer = setInterval(() => {
      setAttempt((prev) => prev + 1);
    }, 600);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (attempt > maxAttempts) {
      if (shouldFail) {
        setHasError(true);
      } else {
        onComplete(true);
      }
    }
  }, [attempt, maxAttempts, shouldFail, onComplete]);

  const progress = (attempt / maxAttempts) * 100;

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
        <div className="flex flex-col items-center max-w-md text-center">
          <div className="w-32 h-32 bg-gray-800 rounded-3xl flex items-center justify-center mb-6 border-2 border-[#FFC7BD]">
            <AlertCircle className="w-16 h-16 text-[#FFC7BD]" />
          </div>

          <h2 className="text-2xl mb-4 text-white">Connection Failed</h2>

          <p className="text-base text-gray-300 mb-8">
            Error connecting to the camera. Please verify your password and try again.
          </p>

          <div className="space-y-3 w-full">
            <button
              onClick={onRetry}
              className="w-full bg-[#5B8BBF] text-white py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-8 border-2 border-[#BFE3D9]">
          <Loader2 className="w-12 h-12 text-[#BFE3D9] animate-spin" />
        </div>

        <h2 className="text-2xl mb-4 text-white">Testing Camera Connection</h2>

        <p className="text-lg text-[#BFE3D9] mb-8">
          Step {attempt} of {maxAttempts}
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-gray-800 rounded-full h-3 overflow-hidden border border-[#FCEAAD]/30">
          <div
            className="bg-[#FCEAAD] h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-400 mt-6">
          This may take up to a minute
        </p>
      </div>
    </div>
  );
}
