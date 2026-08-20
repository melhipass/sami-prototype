import { Camera, Info, X } from 'lucide-react';

interface WelcomeScreenProps {
  onLearnMore: () => void;
  onConfigure: () => void;
  onSkip: () => void;
  platform?: 'ios' | 'android';
}

export function WelcomeScreen({ onLearnMore, onConfigure, onSkip, platform = 'ios' }: WelcomeScreenProps) {
  const isAndroid = platform === 'android';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-root-bg px-6 relative">
      <button
        onClick={onSkip}
        className="absolute top-16 left-6 text-app-text-3 hover:text-app-root-fg transition-colors flex items-center gap-2"
      >
        <X className="w-6 h-6" />
        <span className="text-lg">Skip</span>
      </button>
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-32 h-32 bg-app-surface-1 rounded-3xl flex items-center justify-center mb-8 border-2 border-app-status-warning">
          <Camera className="w-16 h-16 text-app-status-warning" />
        </div>

        <h1 className="text-4xl mb-4 text-app-root-fg">Welcome to Sami</h1>

        <div className="bg-app-surface-1 border border-app-status-good/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-app-status-bad flex-shrink-0 mt-1" />
            {isAndroid ? (
              <p className="text-base text-app-status-bad text-left leading-relaxed">
                This tablet is configured exclusively for Sami use. Please follow the instructions on your package to connect the Sami Camera before you start.
              </p>
            ) : (
              <p className="text-base text-app-status-bad text-left leading-relaxed">
                This app is designed to work exclusively with Sami Camera hardware.
                You'll need a Sami Camera to use this application.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={onConfigure}
            className="w-full bg-[#5B8BBF] text-app-root-fg py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors"
          >
            Configure My Sami Camera
          </button>

          {!isAndroid && (
            <button
              onClick={() => window.open('https://www.samialert.com/', '_blank')}
              className="w-full bg-app-surface-2 text-app-root-fg py-4 rounded-xl text-lg hover:bg-app-surface-3 transition-colors"
            >
              Learn More About Sami
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
