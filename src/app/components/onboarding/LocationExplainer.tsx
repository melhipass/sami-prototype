import { Shield } from 'lucide-react';

interface LocationExplainerProps {
  onContinue: () => void;
  onCancel: () => void;
}

export function LocationExplainer({ onContinue, onCancel }: LocationExplainerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-onboard-bg px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-24 h-24 bg-app-onboard-box rounded-full flex items-center justify-center mb-8 border-2 border-app-status-good">
          <Shield className="w-12 h-12 text-app-status-good" />
        </div>

        <h1 className="text-3xl mb-4 text-app-root-fg">Access Permissions</h1>

        <p className="text-lg text-app-text-2 mb-12 leading-relaxed">
          Sami needs access to your location and Wi-Fi to identify available networks
          and help you connect your camera to your home network.
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-app-cta text-white py-4 rounded-xl text-lg shadow-lg hover:bg-app-cta/80 transition-colors"
          >
            Continue
          </button>

          <button
            onClick={onCancel}
            className="w-full text-app-text-3 py-3 text-base hover:text-app-root-fg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
