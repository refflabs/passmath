/**
 * components/PasswordInput.tsx
 * Komponen input password dengan toggle visibility, tombol aksi, dan validasi.
 */

import { useState, useCallback } from 'react';
import { MAX_PASSWORD_LENGTH } from '../utils/analyzePassword';
import { detectUnsupportedChars } from '../utils/characterAnalysis';

interface PasswordInputProps {
  onAnalyze: (password: string) => void;
  onReset: () => void;
  isAnalyzed: boolean;
}

const EXAMPLE_PASSWORD = 'Informatika#2026';

export default function PasswordInput({ onAnalyze, onReset, isAnalyzed }: PasswordInputProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unsupported, setUnsupported] = useState<string[]>([]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, MAX_PASSWORD_LENGTH);
    setPassword(value);
    setUnsupported(detectUnsupportedChars(value));
  }, []);

  const handleAnalyze = useCallback(() => {
    if (password.trim().length > 0 && unsupported.length === 0) {
      onAnalyze(password);
    }
  }, [password, unsupported, onAnalyze]);

  const handleReset = useCallback(() => {
    setPassword('');
    setShowPassword(false);
    setUnsupported([]);
    onReset();
  }, [onReset]);

  const handleUseExample = useCallback(() => {
    setPassword(EXAMPLE_PASSWORD);
    setUnsupported(detectUnsupportedChars(EXAMPLE_PASSWORD));
    onAnalyze(EXAMPLE_PASSWORD);
  }, [onAnalyze]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleAnalyze();
    },
    [handleAnalyze]
  );

  const canAnalyze = password.length > 0 && unsupported.length === 0;
  const remaining = MAX_PASSWORD_LENGTH - password.length;

  return (
    <div className="card p-6 sm:p-8 animate-fade-in">
      {/* Header card */}
      <div className="flex items-center gap-3 mb-6">
        <div className="card-icon bg-blue-500/15 text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h2 className="card-title">Input Password</h2>
          <p className="text-xs text-gray-500 mt-0.5">Analisis dijalankan sepenuhnya di browser Anda</p>
        </div>
      </div>

      {/* Input group */}
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="password-input" className="sr-only">Password</label>
          <input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Masukkan password untuk dianalisis..."
            maxLength={MAX_PASSWORD_LENGTH}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-full bg-gray-950/60 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 font-mono text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Character counter */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{password.length} karakter</span>
          <span>{remaining} karakter tersisa</span>
        </div>

        {/* Warning: unsupported characters */}
        {unsupported.length > 0 && (
          <div className="warning-box flex items-start gap-3" role="alert">
            <span className="text-amber-400 flex-shrink-0 mt-0.5">⚠</span>
            <div>
              <p className="font-medium text-amber-300 mb-1">Karakter Tidak Didukung</p>
              <p>
                Karakter berikut tidak termasuk dalam model charset (A, B, C, D):{' '}
                {unsupported.map((ch, i) => (
                  <span key={i} className="font-mono bg-amber-900/30 px-1.5 py-0.5 rounded mx-0.5 text-amber-200">
                    {ch === ' ' ? '[spasi]' : ch}
                  </span>
                ))}
              </p>
              <p className="mt-1.5 text-amber-400/70">
                Ganti karakter tersebut atau gunakan hanya A–Z, a–z, 0–9, dan simbol: !@#$%^&amp;*()-_=+[]{}|;:,.&lt;&gt;?
              </p>
            </div>
          </div>
        )}

        {/* Tombol aksi */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="btn-analyze"
            type="button"
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Analisis Password
          </button>

          <button
            id="btn-example"
            type="button"
            onClick={handleUseExample}
            className="sm:flex-none bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-3 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/5 active:scale-[0.98]"
            title={`Gunakan contoh: ${EXAMPLE_PASSWORD}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Contoh
          </button>

          {isAnalyzed && (
            <button
              id="btn-reset"
              type="button"
              onClick={handleReset}
              className="sm:flex-none bg-gray-800 hover:bg-red-900/30 hover:border-red-500/30 text-gray-400 hover:text-red-400 font-medium py-3 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-white/5 active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          )}
        </div>

        {/* Catatan privasi */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-500/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Password diproses sepenuhnya di browser Anda — tidak pernah dikirim ke server manapun</span>
        </div>
      </div>
    </div>
  );
}
