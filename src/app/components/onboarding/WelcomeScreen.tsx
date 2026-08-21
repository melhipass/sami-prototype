import { Camera, Info } from 'lucide-react';

interface WelcomeScreenProps {
  onLearnMore: () => void;
  onConfigure: () => void;
  onSkip: () => void;
  platform?: 'ios' | 'android';
}

export function WelcomeScreen({ onLearnMore, onConfigure, onSkip, platform = 'ios' }: WelcomeScreenProps) {
  const isAndroid = platform === 'android';

  return (
    <div className="flex flex-col items-center justify-center h-full bg-app-surface px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-32 h-32 bg-app-card rounded-3xl flex items-center justify-center mb-8 border-2 border-app-amber">
          <Camera className="w-16 h-16 text-app-amber" />
        </div>

        <h1 className="text-4xl mb-4 text-app-content">Welcome to Sami</h1>

        <div className="bg-app-card border border-app-quiet/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Info className="w-6 h-6 text-app-mint-ink dark:text-app-alert flex-shrink-0 mt-1" />
            {isAndroid ? (
              <p className="text-base text-app-mint-ink dark:text-app-alert text-left leading-relaxed">
                This tablet is configured exclusively for Sami use. Please follow the instructions on your package to connect the Sami Camera before you start.
              </p>
            ) : (
              <p className="text-base text-app-mint-ink dark:text-app-alert text-left leading-relaxed">
                This app is designed to work exclusively with Sami Camera hardware.
                You'll need a Sami Camera to use this application.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={onConfigure}
            className="w-full bg-app-navy text-white py-4 rounded-xl text-lg shadow-lg hover:bg-app-navy-700 transition-colors"
          >
            Configure My Sami Camera
          </button>

          {!isAndroid && (
            <button
              onClick={() => window.open('https://www.samialert.com/', '_blank')}
              className="w-full bg-app-sunken text-app-content py-4 rounded-xl text-lg border border-app-line/15 dark:border-transparent hover:bg-app-content/10 dark:hover:bg-[#4b5563] transition-colors"
            >
              Learn More About Sami
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
