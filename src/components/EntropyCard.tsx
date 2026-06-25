/**
 * components/EntropyCard.tsx
 * Menampilkan analisis entropy H = L × log₂(N) dengan progress bar.
 */

import type { PasswordAnalysisResult } from '../types/analysis';
import { getEntropyStatus } from '../utils/entropy';
import { toFixed } from '../utils/formatting';

interface EntropyCardProps {
  result: PasswordAnalysisResult;
}

const ENTROPY_THRESHOLDS = [
  { max: 28, label: 'Sangat Lemah', color: 'text-red-400', bg: 'bg-red-600', trackPct: 22 },
  { max: 36, label: 'Lemah', color: 'text-orange-400', bg: 'bg-orange-500', trackPct: 28 },
  { max: 60, label: 'Cukup', color: 'text-yellow-400', bg: 'bg-yellow-500', trackPct: 47 },
  { max: 128, label: 'Kuat', color: 'text-green-400', bg: 'bg-green-500', trackPct: 100 },
  { max: Infinity, label: 'Sangat Kuat', color: 'text-cyan-400', bg: 'bg-gradient-to-r from-cyan-500 to-blue-500', trackPct: 100 },
];

export default function EntropyCard({ result }: EntropyCardProps) {
  const { entropy, entropyScore, charsetSize, length } = result;
  const status = getEntropyStatus(entropy);

  // Normalisasi progress ke 0-128 bit (progress bar max = 128)
  const progressPct = Math.min(100, (entropy / 128) * 100);
  const threshold = ENTROPY_THRESHOLDS.find((t) => entropy < t.max) ?? ENTROPY_THRESHOLDS[3];

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-yellow-500/15 text-yellow-400">
          <span aria-hidden="true" className="text-sm font-bold">H</span>
        </div>
        <div>
          <h2 className="card-title">4. Analisis Entropy</h2>
          <p className="text-xs text-gray-500 mt-0.5">H = L × log₂(N) — Entropy teoretis ruang pencarian</p>
        </div>
      </div>

      {/* Rumus */}
      <div className="formula-box mb-5 space-y-2">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Perhitungan Entropy</div>
        <p className="text-gray-400 text-sm"><span className="text-gray-600">Rumus: </span><span className="text-white">H = L × log₂(N)</span></p>
        <p className="text-gray-400 text-sm">
          <span className="text-gray-600">Substitusi: </span>
          <span className="text-white">H = {length} × log₂({charsetSize})</span>
        </p>
        <p className="text-gray-400 text-sm">
          <span className="text-gray-600">H = </span>
          <span className="text-white">{length} × {toFixed(Math.log2(charsetSize), 4)}</span>
        </p>
        <p className="text-lg font-bold">
          <span className="text-gray-500">H ≈ </span>
          <span className={threshold.color}>{toFixed(entropy)} bit</span>
        </p>
      </div>

      {/* Progress bar entropy (0 → 128+ bit) */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="section-label">Entropy Progress (0 – 128+ bit)</span>
          <span className={`badge border ${threshold.color} border-current/30 bg-current/10 text-xs`}>
            {status}
          </span>
        </div>
        <div className="progress-container h-3 mb-1">
          <div
            className={`progress-bar ${threshold.bg}`}
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={entropy}
            aria-valuemin={0}
            aria-valuemax={128}
            aria-label={`Entropy: ${toFixed(entropy)} bit`}
          />
        </div>
        {/* Threshold markers */}
        <div className="relative h-4 mt-1">
          {[
            { pct: (28 / 128) * 100, label: '28' },
            { pct: (36 / 128) * 100, label: '36' },
            { pct: (60 / 128) * 100, label: '60' },
            { pct: 100, label: '128' },
          ].map(({ pct, label }) => (
            <div
              key={label}
              className="absolute top-0 text-gray-700 text-xs -translate-x-1/2"
              style={{ left: `${pct}%` }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Entropy Score */}
      <div className="bg-gray-950/50 rounded-xl p-4 border border-white/5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-gray-300">Entropy Score (ES)</p>
            <p className="text-xs text-gray-600 font-mono">ES = min(100, (H / 128) × 100)</p>
          </div>
          <p className={`text-2xl font-bold font-mono ${threshold.color}`}>
            {toFixed(entropyScore)}
          </p>
        </div>
        <div className="formula-box text-xs py-2 px-3 text-gray-500">
          ES = min(100, ({toFixed(entropy)} / 128) × 100) = {toFixed(entropyScore)}
        </div>
        <div className="progress-container h-2 mt-3">
          <div
            className={`progress-bar ${threshold.bg}`}
            style={{ width: `${Math.min(100, entropyScore)}%` }}
          />
        </div>
      </div>

      {/* Tabel klasifikasi */}
      <div className="overflow-x-auto-mobile rounded-xl border border-white/5">
        <table className="data-table" aria-label="Klasifikasi entropy">
          <thead>
            <tr className="bg-gray-900/60">
              <th>Rentang Entropy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { range: 'H < 28 bit', status: 'Sangat Lemah', color: 'text-red-400' },
              { range: '28 ≤ H < 36 bit', status: 'Lemah', color: 'text-orange-400' },
              { range: '36 ≤ H < 60 bit', status: 'Cukup', color: 'text-yellow-400' },
              { range: '60 ≤ H < 128 bit', status: 'Kuat', color: 'text-green-400' },
              { range: 'H ≥ 128 bit', status: 'Sangat Kuat', color: 'text-cyan-400' },
            ].map(({ range, status: s, color }) => (
              <tr key={s} className={status === s ? 'bg-white/3' : ''}>
                <td className="font-mono text-gray-400">{range}</td>
                <td>
                  <span className={`font-semibold ${color} ${status === s ? 'font-bold' : ''}`}>
                    {status === s && '→ '}{s}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="note-box mt-4 text-xs">
        <strong className="text-gray-300">Catatan:</strong> Entropy yang dihitung adalah{' '}
        <em>entropy teoretis ruang pencarian</em>, bukan entropy empiris. Rumus mengasumsikan
        pemilihan karakter independen dan seragam — bukan jaminan bahwa password dipilih secara acak.
      </div>
    </div>
  );
}
