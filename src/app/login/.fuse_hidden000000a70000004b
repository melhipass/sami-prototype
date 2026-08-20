'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Usuario o contraseña incorrectos.');
        setIsLoading(false);
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setError('No se pudo conectar. Intenta de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#E8F2FC] px-4">
      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#B9E3D3] opacity-70 blur-[1px]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#F7E6B0] opacity-70 blur-[1px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#F6D0CC] opacity-70 blur-[1px]" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm space-y-7 rounded-2xl bg-white p-10 shadow-xl"
      >
        {/* Logo */}
        <div className="space-y-2">
          <div className="flex items-center">
            <img
              src="/assets/Sami_horizontal.svg"
              alt="Sami"
              className="h-8 w-auto"
            />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Prototype
          </p>
        </div>

        <div className="space-y-3">
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
            placeholder="Usuario"
            className="w-full rounded-xl bg-[#EAF3FC] px-4 py-3 text-sm text-[#283891] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#283891]/30"
          />
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="Contraseña"
              className="w-full rounded-xl bg-[#EAF3FC] px-4 py-3 pr-11 text-sm text-[#283891] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#283891]/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#283891] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#283891] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1f2c73] disabled:opacity-60"
        >
          {isLoading ? 'Ingresando...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
