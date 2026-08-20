import { useState } from 'react';
import { Power, ArrowRight, X } from 'lucide-react';

interface PowerConnectionProps {
  onLightIsGreen: () => void;
  onLightIsNotGreen: () => void;
  onGoBack?: () => void;
  isAndroid?: boolean;
}

export function PowerConnection({ onLightIsGreen, onLightIsNotGreen, onGoBack, isAndroid = false }: PowerConnectionProps) {
  const [showTroublePopup, setShowTroublePopup] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-onboard-bg px-6 py-8">
      <div className="flex flex-col items-center max-w-md w-full text-center">
        <div className="w-20 h-20 bg-app-onboard-box rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-app-status-warning">
          <Power className="w-10 h-10 text-app-status-warning" />
        </div>

        <h1 className="text-3xl mb-3 text-app-root-fg">Verify Camera is Ready</h1>
        <p className="text-base text-app-text-2 mx-[0px] mt-[0px] mb-[15px]">Confirm the Camera Power Light is green and that you&apos;re on the same Wi-Fi network.</p>

        {/* LED Status Flow */}
        <div className="w-full bg-app-onboard-box rounded-xl border border-app-status-warning/30 px-4 py-3 mb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-app-surface-3 border-2 border-gray-500 mb-1"></div>
              <span className="text-xs text-app-text-3">Off</span>
            </div>
            <ArrowRight className="w-5 h-5 text-app-text-4" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#B95555] border-2 border-[#B95555] mb-1 shadow-lg shadow-[#B95555]/50"></div>
              <span className="text-xs text-app-text-3">Red</span>
            </div>
            <ArrowRight className="w-5 h-5 text-app-text-4" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-app-status-good border-2 border-app-status-good mb-1 shadow-lg shadow-app-status-good/50"></div>
              <span className="text-xs text-app-text-3">Green</span>
            </div>
          </div>
        </div>

        <div className="bg-app-onboard-box border border-app-status-good/30 rounded-xl p-6 w-full mx-[0px] mt-[0px] mb-[20px]">
          <p className="text-base text-app-text-2 leading-relaxed">
            Pro tip: For better speed and a more reliable connection, leave the camera connected to the Sami Hub or your home Wi-Fi router with an Ethernet cable (LAN port).
          </p>
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={onLightIsGreen}
            className="w-full bg-app-cta text-white py-4 rounded-xl text-lg shadow-lg hover:bg-app-cta/80 transition-colors"
          >
            Light is green
          </button>

          <button
            onClick={isAndroid ? onGoBack : onLightIsNotGreen}
            className="w-full bg-app-surface-2 text-app-root-fg py-4 rounded-xl text-lg hover:bg-app-surface-3 transition-colors"
          >
            {isAndroid ? 'Go Back' : 'Having trouble'}
          </button>
        </div>
      </div>

      {/* Trouble popup — Android only */}
      {showTroublePopup && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-6">
          <div className="bg-app-onboard-box rounded-2xl w-full max-w-md overflow-hidden border border-app-line-1">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-app-root-fg text-xl font-semibold">Having Trouble?</h2>
              <button onClick={() => setShowTroublePopup(false)} className="p-1 hover:bg-app-surface-2 rounded-lg transition-colors">
                <X className="w-5 h-5 text-app-text-3" />
              </button>
            </div>
            <div className="px-6 pb-6">
              <p className="text-app-text-2 text-base leading-relaxed">
                If you are having trouble please check the instructions included on the Sami Package or contact support.
              </p>
            </div>
            <div className="border-t border-app-line-1">
              <button
                onClick={() => setShowTroublePopup(false)}
                className="w-full py-4 text-lg font-semibold transition-colors hover:bg-app-surface-2"
                style={{ color: 'var(--app-cta)' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
