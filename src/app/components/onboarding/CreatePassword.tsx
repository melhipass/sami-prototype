import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!passwordHint.trim()) {
      setError('Please provide a password hint');
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
  const canSubmit = validation.isValid && passwordsMatch && passwordHint.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 mt-16 border-2 border-[#FCEAAD]">
          <Lock className="w-10 h-10 text-[#FCEAAD]" />
        </div>

        <h1 className="text-3xl mb-3 text-white">Create Password</h1>
        <p className="text-base text-gray-300 mb-8">
          Password must contain a capital letter, at least 4 letters and 2 numbers
        </p>

        <div className="mb-6 w-full space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'password' : 'text'}
              value={password}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-gray-800 text-white placeholder-gray-500 ${
                error ? 'border-[#FFC7BD] focus:border-[#FFC7BD]' : 'border-[#FCEAAD]/30 focus:border-[#FCEAAD]'
              }`}
              placeholder="Enter password"
            />
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'password' : 'text'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none bg-gray-800 text-white placeholder-gray-500 ${
                error ? 'border-[#FFC7BD] focus:border-[#FFC7BD]' : 'border-[#FCEAAD]/30 focus:border-[#FCEAAD]'
              }`}
              placeholder="Confirm password"
            />
          </div>

          <div>
            <input
              type="text"
              value={passwordHint}
              onChange={(e) => setPasswordHint(e.target.value.slice(0, 30))}
              maxLength={30}
              className="w-full px-4 py-3 border border-[#FCEAAD]/30 rounded-xl focus:outline-none focus:border-[#FCEAAD] bg-gray-800 text-white placeholder-gray-500"
              placeholder="Password hint (e.g., my first pet's name)"
            />
            <p className="text-xs text-gray-400 mt-1 text-left">This will help you remember your password ({passwordHint.length}/30)</p>
          </div>

          {error && (
            <p className="text-sm text-[#FFC7BD] text-left">{error}</p>
          )}
        </div>

        <div className="space-y-3 w-full">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-[#5B8BBF] text-white py-4 rounded-xl text-lg shadow-lg hover:bg-[#5B8BBF]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>

          <button
            onClick={onCancel}
            className="w-full text-gray-400 py-3 text-base hover:text-white transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
