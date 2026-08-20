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
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-onboard-bg px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-24 h-24 bg-app-onboard-box rounded-full flex items-center justify-center mb-8 border-2 border-app-status-good">
          <Loader2 className="w-12 h-12 text-app-status-good animate-spin" />
        </div>

        <h2 className="text-2xl mb-4 text-app-root-fg">Testing Camera Connection</h2>

        <p className="text-lg text-app-status-good mb-8">
          Step {attempt} of {maxAttempts}
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-app-onboard-box rounded-full h-3 overflow-hidden border border-app-status-warning/30">
          <div
            className="bg-app-status-warning h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-app-text-3 mt-6">
          This may take up to a minute
        </p>
      </div>
    </div>
  );
}
