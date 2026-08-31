import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface WifiTestingScreenProps {
  onComplete: () => void;
  // Optional: when provided, a "Cancel" button is shown so the user can
  // abort the wait (Android connections can take a while).
  onCancel?: () => void;
  heading?: string;
}

export function WifiTestingScreen({ onComplete, onCancel, heading = 'Testing Wi-Fi Connection' }: WifiTestingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-app-surface px-6">
      <div className="flex flex-col items-center max-w-md w-full text-center">
        <div className="w-24 h-24 bg-app-card rounded-full flex items-center justify-center mb-8 border-2 border-app-quiet">
          <Loader2 className="w-12 h-12 text-app-quiet animate-spin" />
        </div>
        <h2 className="text-2xl mb-4 text-app-content">{heading}</h2>
        <p className="text-sm text-app-content-faint mt-2">This may take a few seconds</p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-8 w-full bg-app-sunken text-app-content py-3 rounded-xl border border-app-line/15 dark:border-transparent hover:bg-app-content/10 dark:hover:bg-[#4b5563] transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
