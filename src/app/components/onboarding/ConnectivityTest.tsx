import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ConnectivityTestProps {
  onComplete: (success: boolean) => void;
  shouldFail: boolean;
}

export function ConnectivityTest({ onComplete, shouldFail }: ConnectivityTestProps) {
  const [attempt, setAttempt] = useState(1);
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
      onComplete(!shouldFail);
    }
  }, [attempt, maxAttempts, shouldFail, onComplete]);

  const progress = (attempt / maxAttempts) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-app-surface px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-24 h-24 bg-app-card rounded-full flex items-center justify-center mb-8 border-2 border-app-quiet">
          <Loader2 className="w-12 h-12 text-app-quiet animate-spin" />
        </div>

        <h2 className="text-2xl mb-4 text-app-content">Testing Camera Connection</h2>

        <p className="text-lg text-app-quiet mb-8">
          Step {attempt} of {maxAttempts}
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-app-mint rounded-full h-3 overflow-hidden border border-app-amber/30">
          <div
            className="bg-app-amber h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-app-content-faint mt-6">
          This may take up to a minute
        </p>
      </div>
    </div>
  );
}
