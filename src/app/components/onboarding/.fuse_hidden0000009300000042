import { useEffect } from 'react';
import { CheckCircle, XCircle, Unplug } from 'lucide-react';

interface CompletionStateProps {
  success: boolean;
  onRetry: () => void;
  onDone: () => void;
}

export function CompletionState({ success, onRetry, onDone }: CompletionStateProps) {
  useEffect(() => {
    if (success) {
      // Auto-advance to main app after 2 seconds on success
      const timer = setTimeout(() => {
        onDone();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, onDone]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FCEAAD] px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        {success ? (
          <>
            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>

            <h1 className="text-3xl mb-3 text-[#293283]">Setup Complete!</h1>
            <p className="text-lg text-[#293283] mb-4">
              Camera Wi-Fi connection successful
            </p>

            <div className="bg-[#293283]/10 border border-[#293283]/30 rounded-xl p-4 mb-8 flex items-start gap-3">
              <Unplug className="w-6 h-6 text-[#293283] flex-shrink-0 mt-1" />
              <p className="text-sm text-[#293283] text-left">
                You can now safely unplug the Ethernet cable from your camera.
                Your camera is connected via Wi-Fi.
              </p>
            </div>

            <button
              onClick={onDone}
              className="w-full bg-[#293283] text-[#FCEAAD] py-4 rounded-xl text-lg shadow-lg hover:bg-[#fce196] transition-colors"
            >
              Start Using Sami
            </button>
          </>
        ) : (
          <>
            <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-20 h-20 text-white" />
            </div>

            <h1 className="text-3xl mb-3 text-[#293283]">Connection Failed</h1>
            <p className="text-lg text-[#293283] mb-12">
              Unable to connect camera to Wi-Fi network
            </p>

            <div className="space-y-3 w-full">
              <button
                onClick={onRetry}
                className="w-full bg-[#293283] text-[#FCEAAD] py-4 rounded-xl text-lg shadow-lg hover:bg-[#fce196] transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={onDone}
                className="w-full text-[#293283]/70 py-3 text-base hover:text-[#293283] transition-colors"
              >
                Skip for Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
