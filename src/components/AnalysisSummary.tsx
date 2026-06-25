/**
 * components/AnalysisSummary.tsx
 * Ringkasan hasil analisis password.
 */

import { useState } from 'react';
import type { PasswordAnalysisResult } from '../types/analysis';
import { getStatusColor, getStatusIcon } from '../utils/scoring';
import { toFixed } from '../utils/formatting';
import { CHARSET_SIZES } from '../utils/characterAnalysis';

interface AnalysisSummaryProps {
  result: PasswordAnalysisResult;
}

export default function AnalysisSummary({ result }: AnalysisSummaryProps) {
  const [showPassword, setShowPassword] = useState(false);
  const colors = getStatusColor(result.securityStatus);
  const icon = getStatusIcon(result.securityStatus);

  const masked = '•'.repeat(result.length);
  const scorePercent = Math.min(100, result.finalScore);

  const categories = [
    { label: 'A: Huruf Besar', active: result.charAnalysis.hasUppercase, size: CHARSET_SIZES.uppercase },
    { label: 'B: Huruf Kecil', active: result.charAnalysis.hasLowercase, size: CHARSET_SIZES.lowercase },
    { label: 'C: Angka', active: result.charAnalysis.hasDigit, size: CHARSET_SIZES.digit },
    { label: 'D: Simbol', active: result.charAnalysis.hasSymbol, size: CHARSET_SIZES.symbol },
  ];

  return (
    <div className="card p-6 sm:p-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`card-icon ${colors.bg} ${colors.text}`}>
            <span aria-hidden="true">{icon}</span>
          </div>
          <div>
            <h2 className="card-title">Ringkasan Analisis</h2>
            <p className="text-xs text-gray-500 mt-0.5">Hasil keseluruhan</p>
          </div>
        </div>
        <div className={`badge ${colors.bg} ${colors.text} ${colors.border} px-3 py-1.5 text-sm`}>
          <span aria-label={`Status: ${result.securityStatus}`}>{icon}</span>
          {result.securityStatus}
        </div>
      </div>

      {/* Password display */}
      <div className="bg-gray-950/50 rounded-xl p-4 mb-6 border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="section-label">Password</span>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
            aria-label={showPassword ? 'Sembunyikan password dalam laporan' : 'Tampilkan password dalam laporan'}
          >
            {showPassword ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                Sembunyikan
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Tampilkan
              </>
            )}
          </button>
        </div>
        <p className="font-mono text-white text-sm tracking-widest break-all">
          {showPassword ? result.password : masked}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatBox label="Panjang (L)" value={String(result.length)} unit="karakter" />
        <StatBox label="Charset (N)" value={String(result.charsetSize)} unit="karakter" />
        <StatBox label="Entropy (H)" value={toFixed(result.entropy)} unit="bit" />
        <StatBox label="Final Score" value={toFixed(result.finalScore)} unit="/ 100" color={colors.text} />
      </div>

      {/* Kategori aktif */}
      <div className="mb-6">
        <p className="section-label mb-3">Kategori Karakter Aktif</p>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ label, active, size }) => (
            <span
              key={label}
              className={`badge ${
                active
                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                  : 'bg-gray-800/60 text-gray-600 border-gray-700/40'
              }`}
              aria-label={`${label}: ${active ? `aktif (${size} karakter)` : 'tidak aktif'}`}
            >
              {active ? '✓' : '✗'} {label} {active && <span className="opacity-60">(|·| = {size})</span>}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-3 font-mono">
          N = {categories
            .filter((c) => c.active)
            .map((c) => c.size)
            .join(' + ')} = <span className="text-white font-semibold">{result.charsetSize}</span>
        </p>
      </div>

      {/* Final Score gauge */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="section-label">Final Hybrid Score</span>
          <span className={`text-sm font-bold ${colors.text}`}>
            {toFixed(result.finalScore)} / 100
          </span>
        </div>
        <div className="progress-container h-3">
          <div
            className={`progress-bar ${colors.progress}`}
            style={{ width: `${scorePercent}%` }}
            role="progressbar"
            aria-valuenow={result.finalScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Final Score: ${toFixed(result.finalScore)} dari 100`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1.5">
          <span>Tidak Aman</span>
          <span>Kurang Aman</span>
          <span>Aman</span>
          <span>Sangat Aman</span>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  unit,
  color = 'text-white',
}: {
  label: string;
  value: string;
  unit: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-950/50 rounded-xl p-3 border border-white/5 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
      <p className="text-xs text-gray-600">{unit}</p>
    </div>
  );
}
