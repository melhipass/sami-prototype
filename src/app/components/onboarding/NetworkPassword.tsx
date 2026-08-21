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
    <div className="flex flex-col items-center justify-center h-full bg-app-surface px-6">
      <div className="bg-app-card rounded-2xl p-8 max-w-md w-full shadow-2xl border border-app-line/15 dark:border-[#374151]">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Wifi className="w-6 h-6 text-app-content" />
          <h2 className="text-xl text-center text-app-content">{ssid}</h2>
        </div>

        <p className="text-sm text-app-content-faint mb-6 text-center">
          Enter the password for this network
        </p>

        {showError && (
          <div className="mb-4 px-4 py-3 bg-app-card dark:bg-[#B85555]/20 border border-app-alert/50 dark:border-[#B85555]/50 rounded-xl">
            <p className="text-app-alert dark:text-[#F08080] text-sm text-center">Incorrect password. Please try again.</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm mb-2 text-app-content-faint">
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
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-app-card text-app-content placeholder-gray-600 ${showError ? 'border-[#B85555] focus:border-[#B85555]' : 'border-app-line/20 dark:border-[#4b5563] focus:border-[#5B8BBF]'}`}
              placeholder="Enter password"
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            disabled={password.length === 0}
            className="w-full bg-app-navy text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-app-navy-700 transition-colors"
          >
            Connect
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-app-sunken text-app-content py-3 rounded-xl border border-app-line/15 dark:border-transparent hover:bg-app-content/10 dark:hover:bg-[#4b5563] transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
