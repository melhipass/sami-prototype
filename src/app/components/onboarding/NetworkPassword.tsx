import { useState } from 'react';
import { Wifi } from 'lucide-react';

interface NetworkPasswordProps {
  ssid: string;
  onSubmit: (password: string) => void;
  onCancel: () => void;
  firstAttemptFails?: boolean;
  showErrorOnMount?: boolean;
}

export function NetworkPassword({ ssid, onSubmit, onCancel, firstAttemptFails = false, showErrorOnMount = false }: NetworkPasswordProps) {
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(showErrorOnMount);

  const handleSubmit = () => {
    if (password.length === 0) return;
    if (firstAttemptFails) {
      setShowError(true);
      setPassword('');
      onSubmit(password); // notify parent to increment attempt counter
      return;
    }
    setShowError(false);
    onSubmit(password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Wifi className="w-6 h-6 text-white" />
          <h2 className="text-xl text-center text-white">{ssid}</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6 text-center">
          Enter the password for this network
        </p>

        {showError && (
          <div className="mb-4 px-4 py-3 bg-[#B85555]/20 border border-[#B85555]/50 rounded-xl">
            <p className="text-[#F08080] text-sm text-center">Incorrect password. Please try again.</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm mb-2 text-gray-400">
            Wi-Fi Password
          </label>
          <div className="relative">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-gray-900 text-white placeholder-gray-600 ${showError ? 'border-[#B85555] focus:border-[#B85555]' : 'border-gray-600 focus:border-[#5B8BBF]'}`}
              placeholder="Enter password"
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={password.length === 0}
            className="w-full bg-[#5B8BBF] text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5B8BBF]/80 transition-colors"
          >
            Connect
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
