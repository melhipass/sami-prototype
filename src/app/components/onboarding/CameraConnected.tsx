import { CheckCircle } from 'lucide-react';

interface CameraConnectedProps {
  onSetupWifi: () => void;
  onContinueEthernet: () => void;
}

// Final iOS onboarding screen shown when the camera is on a non-Sami network.
// Offers to set up camera Wi-Fi now (opens the shared picker popup) or continue
// using the Ethernet cable and open the app.
export function CameraConnected({ onSetupWifi, onContinueEthernet }: CameraConnectedProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-app-surface px-6 py-8">
      <div className="flex flex-col items-center max-w-md w-full text-center">
        <div className="w-20 h-20 bg-app-mint dark:bg-[#BFE3D9] rounded-2xl flex items-center justify-center mb-4 mt-16">
          <CheckCircle className="w-10 h-10 text-app-mint-ink dark:text-app-dk-panel" />
        </div>

        <h1 className="text-3xl mb-3 text-app-content">Camera connected</h1>
        <p className="text-base text-app-content-soft mb-8 leading-relaxed">
          Your camera is connected with the Ethernet cable. Would you like to connect it to Wi-Fi now? You can also do it later from Camera Settings.
        </p>

        <div className="space-y-3 w-full">
          <button
            onClick={onSetupWifi}
            className="w-full bg-app-navy text-white dark:text-app-on-navy py-4 rounded-xl text-lg shadow-lg hover:bg-app-navy-700 transition-colors"
          >
            Set up Wi-Fi
          </button>

          <button
            onClick={onContinueEthernet}
            className="w-full bg-app-sunken text-app-content py-4 rounded-xl text-lg border border-app-line/15 dark:border-transparent hover:bg-app-content/10 dark:hover:bg-app-dk-border-strong transition-colors"
          >
            Continue with Ethernet cable
          </button>
        </div>
      </div>
    </div>
  );
}
