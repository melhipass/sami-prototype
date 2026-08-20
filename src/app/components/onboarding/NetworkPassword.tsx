import { useState } from 'react';
import { Wifi } from 'lucide-react';

interface NetworkPasswordProps {
  ssid: string;
  onSubmit: (password: string) => void;
  onCancel: () => void;
  showErrorOnMount?: boolean;
  // Pre-fills the input with the password from the failed attempt, so the user
  // can see and correct it instead of retyping from scratch.
  initialPassword?: string;
}

export function NetworkPassword({ ssid, onSubmit, onCancel, showErrorOnMount = false, initialPassword = '' }: NetworkPasswordProps) {
  const [password, setPassword] = useState(initialPassword);
  const [showError, setShowError] = useState(showErrorOnMount);

  const handleSubmit = () => {
    if (password.length === 0) return;
    setShowError(false);
    onSubmit(password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-root-bg px-6">
      <div className="bg-app-surface-1 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-app-line-1">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Wifi className="w-6 h-6 text-app-root-fg" />
          <h2 className="text-xl text-center text-app-root-fg">{ssid}</h2>
        </div>

        <p className="text-sm text-app-text-3 mb-6 text-center">
          Enter the password for this network
        </p>

        {showError && (
          <div className="mb-4 px-4 py-3 bg-[#B85555]/20 border border-[#B85555]/50 rounded-xl">
            <p className="text-[#F08080] text-sm text-center">Incorrect password. Please try again.</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm mb-2 text-app-text-3">
            Wi-Fi Password
          </label>
          <div className="relative">
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-app-root-bg text-app-root-fg placeholder-gray-600 ${showError ? 'border-[#B85555] focus:border-[#B85555]' : 'border-app-line-2 focus:border-[#5B8BBF]'}`}
              placeholder="Enter password"
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={password.length === 0}
            className="w-full bg-[#5B8BBF] text-app-root-fg py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5B8BBF]/80 transition-colors"
          >
            Connect
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-app-surface-2 text-app-root-fg py-3 rounded-xl hover:bg-app-surface-3 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
