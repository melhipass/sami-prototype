import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface WifiTestingScreenProps {
  onComplete: () => void;
  heading?: string;
}

export function WifiTestingScreen({ onComplete, heading = 'Testing Wi-Fi Connection' }: WifiTestingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-app-surface px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-24 h-24 bg-app-card rounded-full flex items-center justify-center mb-8 border-2 border-app-quiet">
          <Loader2 className="w-12 h-12 text-app-quiet animate-spin" />
        </div>
        <h2 className="text-2xl mb-4 text-app-content">{heading}</h2>
        <p className="text-sm text-app-content-faint mt-2">This may take a few seconds</p>
      </div>
    </div>
  );
}
