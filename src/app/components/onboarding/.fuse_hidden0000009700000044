import { AlertCircle } from 'lucide-react';

interface FinalConfirmationProps {
  onContinue: () => void;
  onCancel: () => void;
}

export function FinalConfirmation({ onContinue, onCancel }: FinalConfirmationProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCEAAD] px-6">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mb-4" />
          <h2 className="text-lg mb-3 text-gray-900">Important Notice</h2>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            Your camera will disconnect from this device while switching to the Wi-Fi network.
            If the connection fails, you can recover by using an Ethernet cable.
          </p>
          <div className="space-y-3 w-full">
            <button
              onClick={onContinue}
              className="w-full bg-[#FCEAAD] text-[#293283] py-3 rounded-xl hover:bg-[#1f2563] transition-colors"
            >
              Continue
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-gray-200 text-gray-900 py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
