import { useState } from 'react';
import { Wifi, Radio, Check } from 'lucide-react';

interface ConnectionChoiceProps {
  onContinue: (connectionType: 'hub' | 'wifi') => void;
  onCancel: () => void;
}

export function ConnectionChoice({ onContinue, onCancel }: ConnectionChoiceProps) {
  const [selectedConnection, setSelectedConnection] = useState<'hub' | 'wifi'>('hub');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 py-8">
      <div className="flex flex-col items-center max-w-md w-full">
        <h1 className="text-3xl mb-8 text-white text-center">Select connection method</h1>

        <div className="w-full mb-8 space-y-4">
          {/* Sami Hub Option */}
          <button
            onClick={() => setSelectedConnection('hub')}
            className={`w-full bg-gray-800 rounded-xl p-5 border-2 transition-all text-left ${
              selectedConnection === 'hub'
                ? 'border-[#FCEAAD]'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Radio className="w-6 h-6 text-[#BFE3D9]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Sami Hub</h3>
                  <span className="text-xs text-[#BFE3D9] bg-[#BFE3D9]/20 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
              </div>
              {selectedConnection === 'hub' && (
                <div className="w-6 h-6 bg-[#FCEAAD] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#2C3B4A]" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 ml-15">
              Dedicated, always-on connection. Most reliable for overnight monitoring.
            </p>
          </button>

          {/* Home Wi-Fi Option */}
          <button
            onClick={() => setSelectedConnection('wifi')}
            className={`w-full bg-gray-800 rounded-xl p-5 border-2 transition-all text-left ${
              selectedConnection === 'wifi'
                ? 'border-[#FCEAAD]'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-6 h-6 text-[#5B8BBF]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Home Wi-Fi</h3>
                </div>
              </div>
              {selectedConnection === 'wifi' && (
                <div className="w-6 h-6 bg-[#FCEAAD] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#2C3B4A]" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 ml-15">
              Connect the camera directly to your home network. 2.4 GHz only.
            </p>
          </button>
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={() => onContinue(selectedConnection)}
            className="w-full bg-[#5B8BBF] text-white py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors"
          >
            Continue
          </button>

          <button
            onClick={onCancel}
            className="w-full text-gray-400 py-3 text-base hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
