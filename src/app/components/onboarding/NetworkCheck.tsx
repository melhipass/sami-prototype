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
  onGoBack: () => void;
  isFirstAttempt?: boolean;
  selectedWifi?: string;
  platform?: 'ios' | 'android';
  // Demo-only: forces one of the connectivity error screens instead of running the search.
  // Progression through vpn -> no-wifi -> real search is controlled by the parent
  // (OnboardingFlow), which advances errorType each time onSearchAgain fires.
  errorType?: 'vpn' | 'no-wifi' | null;
  // Called when the user taps "Search Again" (or "Go to Settings") on one of the
  // connectivity error screens. Parent decides what to show next.
  onSearchAgain?: () => void;
}

export function NetworkCheck({ onComplete, onGoBack, isFirstAttempt = false, selectedWifi, platform = 'ios', errorType = null, onSearchAgain }: NetworkCheckProps) {
  const [status, setStatus] = useState<'verifying' | 'searching' | 'found'>('verifying');
  const [networkName, setNetworkName] = useState(selectedWifi ?? 'Sami-5G');

  useEffect(() => {
    if (errorType) return; // Showing a connectivity error screen instead of running the search.

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
  }, [isFirstAttempt, errorType]);

  if (errorType === 'vpn') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 py-8">
        <div className="flex flex-col items-center max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-[#FFC7BD]">
            <AlertCircle className="w-10 h-10 text-[#FFC7BD]" />
          </div>

          <h1 className="text-3xl mb-3 text-white">VPN Detected</h1>
          <p className="text-base text-gray-400 mb-6">Your VPN may be blocking the camera search</p>

          <div className="w-full mb-8 bg-gray-800 rounded-xl p-6 border border-[#FFC7BD]/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#FFC7BD] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#FFC7BD] text-left">
              It looks like you are using a VPN. This can prevent the Sami app from having the necessary access to your local network. Please disable your VPN, then press Search Again.
            </p>
          </div>

          <div className="space-y-3 w-full">
            <button
              onClick={onSearchAgain}
              className="w-full bg-gray-700 text-white py-4 rounded-xl text-lg hover:bg-gray-600 transition-colors"
            >
              Search Again
            </button>
            <button
              onClick={onGoBack}
              className="w-full text-gray-400 py-3 text-base hover:text-white transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (errorType === 'no-wifi') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 py-8">
        <div className="flex flex-col items-center max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-[#FFC7BD]">
            <AlertCircle className="w-10 h-10 text-[#FFC7BD]" />
          </div>

          <h1 className="text-3xl mb-3 text-white">No Wi-Fi Connection Found</h1>
          <p className="text-base text-gray-400 mb-6">Your device isn't connected to a Wi-Fi network</p>

          <div className="w-full mb-8 bg-gray-800 rounded-xl p-6 border border-[#FFC7BD]/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#FFC7BD] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#FFC7BD] text-left">
              No Wi-Fi connection found. Connect to your Wi-Fi network and try again
            </p>
          </div>

          <div className="space-y-3 w-full">
            {platform === 'ios' && (
              <button
                onClick={onSearchAgain}
                title="Opens the device's Wi-Fi settings (native app only)"
                className="w-full text-white py-4 rounded-xl text-lg shadow-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#5B8BBF' }}
              >
                Go to Settings
              </button>
            )}
            <button
              onClick={onSearchAgain}
              className="w-full bg-gray-700 text-white py-4 rounded-xl text-lg hover:bg-gray-600 transition-colors"
            >
              Search Again
            </button>
            <button
              onClick={onGoBack}
              className="w-full text-gray-400 py-3 text-base hover:text-white transition-colors"
            >
              Go Back
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
