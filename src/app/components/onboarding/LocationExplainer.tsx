import { Shield } from 'lucide-react';

interface LocationExplainerProps {
  onContinue: () => void;
  onCancel: () => void;
}

export function LocationExplainer({ onContinue, onCancel }: LocationExplainerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-8 border-2 border-[#BFE3D9]">
          <Shield className="w-12 h-12 text-[#BFE3D9]" />
        </div>

        <h1 className="text-3xl mb-4 text-white">Access Permissions</h1>

        <p className="text-lg text-gray-300 mb-12 leading-relaxed">
          Sami needs access to your location and Wi-Fi to identify available networks
          and help you connect your camera to your home network.
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-[#5B8BBF] text-white py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors"
          >
            Continue
          </button>

          <button
            onClick={onCancel}
            className="w-full text-gray-400 py-3 text-base hover:text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
