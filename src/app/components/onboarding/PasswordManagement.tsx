import { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordManagementProps {
  passwordHint?: string;
  showErrorOnMount?: boolean;
  // Pre-fills the input with the password from the failed attempt, so the user
  // can see and correct it instead of retyping from scratch.
  initialPassword?: string;
  onSubmit: (password: string) => void;
  onCancel: () => void;
}

function generateRandomPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function getPasswordStrength(password: string): { label: string; color: string } {
  if (password.length < 6) return { label: 'Weak', color: 'text-red-500' };
  if (password.length < 10) return { label: 'Medium', color: 'text-yellow-500' };
  return { label: 'Strong', color: 'text-green-500' };
}

export function PasswordManagement({ passwordHint, showErrorOnMount = false, initialPassword = '', onSubmit, onCancel }: PasswordManagementProps) {
  const [password, setPassword] = useState(initialPassword);
  const [showError, setShowError] = useState(showErrorOnMount);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);

  const handleSubmit = () => {
    if (password.length >= 5) {
      onSubmit(password);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowError(false);
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-app-root-bg px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-32 h-32 bg-app-surface-1 rounded-3xl flex items-center justify-center mb-6 border-2 border-app-status-warning">
          <Lock className="w-16 h-16 text-app-status-warning" />
        </div>

        <h1 className="text-3xl mb-3 text-app-root-fg">Camera Password</h1>
        <p className="text-xl text-app-text-2 mb-8">
          Enter camera password
        </p>

        {showError && (
          <div className="mb-4 px-4 py-3 bg-[#B85555]/20 border border-[#B85555]/50 rounded-xl w-full">
            <p className="text-[#F08080] text-sm text-center">Wrong password. Please try again.</p>
          </div>
        )}

        <div className="mb-8 w-full">
          <div className="relative">
            <input
              type="text"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-app-surface-1 text-app-root-fg placeholder-gray-500 ${
                showError ? 'border-[#B85555] focus:border-[#B85555]' : 'border-app-status-warning/30 focus:border-app-status-warning'
              }`}
              placeholder="Enter password"
            />
          </div>

          {passwordHint && (
            <button
              onClick={() => setShowForgotPasswordDialog(true)}
              className="mt-2 text-sm text-[#5B8BBF] underline hover:text-[#5B8BBF]/80"
            >
              Forgot password?
            </button>
          )}
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={handleSubmit}
            disabled={password.length < 5}
            className="w-full bg-[#5B8BBF] text-app-root-fg py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>

          <button
            onClick={onCancel}
            className="w-full text-app-text-3 py-3 text-base hover:text-app-root-fg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      {showForgotPasswordDialog && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
          <div className="bg-app-surface-1 rounded-2xl p-6 max-w-md w-full border-2 border-app-status-warning/30">
            <h2 className="text-2xl font-semibold text-app-root-fg mb-4 text-center">Forgot Password</h2>

            <div className="mb-4">
              <label className="block text-sm mb-2 text-app-text-3 text-left">Password Hint:</label>
              <div className="bg-app-surface-2 rounded-lg p-4">
                <p className="text-app-root-fg text-lg text-center">{passwordHint}</p>
              </div>
            </div>

            <div className="bg-app-status-good/10 border border-app-status-good/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-app-status-good text-center">
                💡 If you're connected to this camera on another device, you can check the Camera Password in Camera Settings on that device.
              </p>
            </div>

            <p className="text-sm text-app-text-3 mb-6 text-center">
              Still can't remember? Contact customer service for help by clicking below or by going to www.samialert.com.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowForgotPasswordDialog(false)}
                className="w-full bg-[#5B8BBF] text-app-root-fg py-3 rounded-xl hover:bg-[#5B8BBF]/80 transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={() => {
                  // Open customer service link
                  window.open('https://support.samialert.com/hc/en-us/requests/new', '_blank');
                }}
                className="w-full bg-app-surface-2 text-app-root-fg py-3 rounded-xl hover:bg-app-surface-3 transition-colors"
              >
                Contact Customer Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
