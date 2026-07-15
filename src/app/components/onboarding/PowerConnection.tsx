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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 py-8">
      <div className="flex flex-col items-center max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-[#FCEAAD]">
          <Power className="w-10 h-10 text-[#FCEAAD]" />
        </div>

        <h1 className="text-3xl mb-3 text-white">Verify Camera is Ready</h1>
        <p className="text-base text-gray-300 mx-[0px] mt-[0px] mb-[15px]">Confirm the Camera Power Light is green and that you&apos;re on the same Wi-Fi network.</p>

        {/* LED Status Flow */}
        <div className="w-full bg-gray-800 rounded-xl border border-[#FCEAAD]/30 px-4 py-3 mb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-500 mb-1"></div>
              <span className="text-xs text-gray-400">Off</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#B95555] border-2 border-[#B95555] mb-1 shadow-lg shadow-[#B95555]/50"></div>
              <span className="text-xs text-gray-400">Red</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#BFE3D9] border-2 border-[#BFE3D9] mb-1 shadow-lg shadow-[#BFE3D9]/50"></div>
              <span className="text-xs text-gray-400">Green</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-[#BFE3D9]/30 rounded-xl p-6 w-full mx-[0px] mt-[0px] mb-[20px]">
          <p className="text-base text-gray-300 leading-relaxed">
            Pro tip: For better speed and a more reliable connection, leave the camera connected to the Sami Hub or your home Wi-Fi router with an Ethernet cable (LAN port).
          </p>
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={onLightIsGreen}
            className="w-full bg-[#5B8BBF] text-white py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors"
          >
            Light is green
          </button>

          <button
            onClick={isAndroid ? onGoBack : onLightIsNotGreen}
            className="w-full bg-gray-700 text-white py-4 rounded-xl text-lg hover:bg-gray-600 transition-colors"
          >
            {isAndroid ? 'Go Back' : 'Having trouble'}
          </button>
        </div>
      </div>

      {/* Trouble popup — Android only */}
      {showTroublePopup && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-6">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden border border-gray-700">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="text-white text-xl font-semibold">Having Trouble?</h2>
              <button onClick={() => setShowTroublePopup(false)} className="p-1 hover:bg-gray-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 pb-6">
              <p className="text-gray-300 text-base leading-relaxed">
                If you are having trouble please check the instructions included on the Sami Package or contact support.
              </p>
            </div>
            <div className="border-t border-gray-700">
              <button
                onClick={() => setShowTroublePopup(false)}
                className="w-full py-4 text-lg font-semibold transition-colors hover:bg-gray-700"
                style={{ color: '#5B8BBF' }}
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
