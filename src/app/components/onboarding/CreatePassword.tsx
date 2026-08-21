import { useState } from 'react';
import { Lock } from 'lucide-react';

interface CreatePasswordProps {
  onSubmit: (password: string, passwordHint: string) => void;
  onCancel: () => void;
}

function validatePassword(password: string): { isValid: boolean; message: string } {
  const hasCapital = /[A-Z]/.test(password);
  const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
  const numberCount = (password.match(/[0-9]/g) || []).length;

  if (!hasCapital) {
    return { isValid: false, message: 'Password must contain at least one capital letter' };
  }
  if (letterCount < 4) {
    return { isValid: false, message: 'Password must contain at least 4 letters' };
  }
  if (numberCount < 2) {
    return { isValid: false, message: 'Password must contain at least 2 numbers' };
  }
  return { isValid: true, message: '' };
}

export function CreatePassword({ onSubmit, onCancel }: CreatePasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const validation = validatePassword(password);

    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onSubmit(password, passwordHint);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // Validate password requirements if user has started typing
    if (value.length > 0) {
      const validation = validatePassword(value);
      if (!validation.isValid) {
        setError(validation.message);
        return;
      }
    }

    // If confirm password is already filled, check if they match
    if (confirmPassword.length > 0 && value !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    // Show error immediately if passwords don't match and confirm field has content
    if (value.length > 0 && password !== value) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  };

  const validation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = validation.isValid && passwordsMatch;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-app-surface px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-20 h-20 bg-app-card rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-app-amber">
          <Lock className="w-10 h-10 text-app-amber" />
        </div>

        <h1 className="text-3xl mb-3 text-app-content">Create Password</h1>
        <p className="text-base text-app-content-soft mb-8">
          Password must contain a capital letter, at least 4 letters and 2 numbers
        </p>

        <div className="mb-6 w-full space-y-4">
          <div>
            <label className="block text-sm mb-2 text-app-content-faint text-left">
              Password: <span className="text-xs text-app-alert">(required)</span>
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-app-card text-app-content placeholder-gray-500 ${
                    error ? 'border-app-alert focus:border-app-alert' : 'border-app-amber/30 focus:border-app-amber'
                  }`}
                  placeholder="Enter password"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-app-card text-app-content placeholder-gray-500 ${
                    error ? 'border-app-alert focus:border-app-alert' : 'border-app-amber/30 focus:border-app-amber'
                  }`}
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-app-content-faint text-left">
              Password Hint: <span className="text-xs text-app-content-faint">(optional)</span>
            </label>
            <input
              type="text"
              value={passwordHint}
              onChange={(e) => setPasswordHint(e.target.value.slice(0, 30))}
              maxLength={30}
              className="w-full px-4 py-3 border border-app-amber/30 rounded-xl focus:outline-none focus:border-app-amber bg-app-card text-app-content placeholder-gray-500"
              placeholder="Password hint (e.g., my first pet's name)"
            />
            <p className="text-xs text-app-content-faint mt-1 text-left">This will help you remember your password ({passwordHint.length}/30)</p>
          </div>

          {error && (
            <p className="text-sm text-app-alert text-left">{error}</p>
          )}
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-app-navy text-white py-4 rounded-xl text-lg shadow-lg hover:bg-app-navy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>

          <button
            onClick={onCancel}
            className="w-full text-app-content-faint py-3 text-base hover:text-app-content transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
