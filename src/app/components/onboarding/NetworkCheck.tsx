import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface CameraDevice {
  id: string;
  name: string;
  status: string;
  isNewCamera: boolean;
}

interface NetworkCheckProps {
  onComplete: (found: boolean, cameraName: string, cameras: CameraDevice[]) => void;
  onError: () => void;
  isFirstAttempt?: boolean;
  selectedWifi?: string;
}

export function NetworkCheck({ onComplete, onError, isFirstAttempt = false, selectedWifi }: NetworkCheckProps) {
  const [status, setStatus] = useState<'verifying' | 'searching' | 'error' | 'found'>('verifying');
  const [networkName, setNetworkName] = useState(selectedWifi ?? 'Sami-5G');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    // Simulate network verification
    const timer1 = setTimeout(() => {
      if (!isMounted) return;
      setStatus('searching');

      // Simulate camera search
      const timer2 = setTimeout(() => {
        if (!isMounted) return;

        const mockCameras: CameraDevice[] = isFirstAttempt ? [] : [
          { id: 'Sami-3c: 7812FFA01839', name: 'Sami-3c: 7812FFA01839', status: 'online', isNewCamera: true },
          { id: 'Sami-3c: 7812FFA01840', name: 'Sami-3c: 7812FFA01840', status: 'offline', isNewCamera: false },
          { id: 'Sami-3c: 7812FFA01841', name: 'Sami-3c: 7812FFA01841', status: 'online', isNewCamera: true },
        ];

        // Simulate finding a camera
        setStatus('found');
        const timer3 = setTimeout(() => {
          if (!isMounted) return;
          onComplete(mockCameras.length > 0, mockCameras.length > 0 ? 'Sami Camera' : '', mockCameras);
        }, 1000);
      }, 2500);
    }, 1500);

    return () => {
      isMounted = false;
    };
  }, [isFirstAttempt]);

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="w-16 h-16 text-[#B95555] mb-4" />
            <h2 className="text-xl mb-3 text-white">Connection Issue</h2>
            <p className="text-sm text-gray-400 mb-6">{errorMessage}</p>
            <div className="space-y-3 w-full">
              <button
                onClick={onError}
                className="w-full bg-[#5B8BBF] text-white py-3 rounded-xl hover:bg-[#5B8BBF]/80 transition-colors"
              >
                Go to Settings
              </button>
              <button
                onClick={onError}
                className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
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

        <h2 className="text-2xl mb-4 text-white">
          {status === 'verifying' ? 'Verifying network...' : `Searching ${networkName} for cameras...`}
        </h2>

        <p className="text-base text-gray-300">
          {status === 'verifying'
            ? 'Checking your network connection'
            : 'This may take a few moments'}
        </p>
      </div>
    </div>
  );
}
