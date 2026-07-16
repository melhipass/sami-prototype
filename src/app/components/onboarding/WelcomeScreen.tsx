import { Camera, Info, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface WelcomeScreenProps {
  onLearnMore: () => void;
  onConfigure: () => void;
  onSkip: () => void;
  platform?: 'ios' | 'android';
}

export function WelcomeScreen({ onLearnMore, onConfigure, onSkip, platform = 'ios' }: WelcomeScreenProps) {
  const isAndroid = platform === 'android';
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      router.replace('/login');
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 relative">
      <div className="absolute top-6 left-6 flex flex-col items-start gap-2">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-gray-500 hover:text-white transition-colors text-lg disabled:opacity-60"
        >
          {isLoggingOut ? 'Saliendo...' : 'Logout'}
        </button>
        <button
          onClick={onSkip}
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <X className="w-6 h-6" />
          <span className="text-lg">Skip</span>
        </button>
      </div>
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-32 h-32 bg-gray-800 rounded-3xl flex items-center justify-center mb-8 border-2 border-[#FCEAAD]">
          <Camera className="w-16 h-16 text-[#FCEAAD]" />
        </div>

        <h1 className="text-4xl mb-4 text-white">Welcome to Sami</h1>

        <div className="bg-gray-800 border border-[#BFE3D9]/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-[#FFC7BD] flex-shrink-0 mt-1" />
            {isAndroid ? (
              <p className="text-base text-[#FFC7BD] text-left leading-relaxed">
                This tablet is configured exclusively for Sami use. Please follow the instructions on your package to connect the Sami Camera before you start.
              </p>
            ) : (
              <p className="text-base text-[#FFC7BD] text-left leading-relaxed">
                This app is designed to work exclusively with Sami Camera hardware.
                You'll need a Sami Camera to use this application.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={onConfigure}
            className="w-full bg-[#5B8BBF] text-white py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors"
          >
            Configure My Sami Camera
          </button>

          {!isAndroid && (
            <button
              onClick={() => window.open('https://www.samialert.com/', '_blank')}
              className="w-full bg-gray-700 text-white py-4 rounded-xl text-lg hover:bg-gray-600 transition-colors"
            >
              Learn More About Sami
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
