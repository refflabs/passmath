/**
 * components/GcdAnalysisCard.tsx
 * Menampilkan analisis GCD dengan langkah-langkah algoritma Euclidean.
 */

import type { GcdAnalysisResult } from '../types/analysis';
import { toFixed } from '../utils/formatting';

interface GcdAnalysisCardProps {
  gcdAnalysis: GcdAnalysisResult;
}

export default function GcdAnalysisCard({ gcdAnalysis }: GcdAnalysisCardProps) {
  const { steps, gcdValue, isCoprime, gcdScore } = gcdAnalysis;

  const statusColor = isCoprime ? 'text-green-400' : 'text-orange-400';
  const statusBg = isCoprime
    ? 'bg-green-500/10 border-green-500/20'
    : 'bg-orange-500/10 border-orange-500/20';

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-pink-500/15 text-pink-400">
          <span aria-hidden="true" className="text-xs font-bold">GCD</span>
        </div>
        <div>
          <h2 className="card-title">6. Analisis GCD (Greatest Common Divisor)</h2>
          <p className="text-xs text-gray-500 mt-0.5">Algoritma Euclidean pada nilai ASCII</p>
        </div>
      </div>

      {/* Penjelasan algoritma */}
      <div className="info-box mb-5 text-xs">
        <p className="font-medium text-blue-300 mb-1">Algoritma Euclidean Iteratif:</p>
        <div className="font-mono bg-gray-950/60 rounded-lg p-3 mt-2 text-gray-400">
          <p>selama b ≠ 0:</p>
          <p className="pl-4">remainder = a mod b</p>
          <p className="pl-4">a ← b</p>
          <p className="pl-4">b ← remainder</p>
          <p>kembalikan |a|</p>
        </div>
      </div>

      {/* Langkah GCD */}
      <div className="mb-5">
        <p className="section-label mb-3">Langkah-Langkah Perhitungan GCD</p>
        <div className="bg-gray-950/50 rounded-xl border border-white/5 p-4 max-h-64 overflow-y-auto">
          {steps.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-4">
              Hanya satu karakter — tidak ada langkah GCD.
            </p>
          ) : (
            <div className="space-y-1.5">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-gray-700 text-xs w-6 flex-shrink-0">{i + 1}.</span>
                  <span className="font-mono text-sm text-gray-300">{step.description}</span>
                  {step.result === 1 && (
                    <span className="badge bg-green-500/15 text-green-400 border-green-500/30 border text-xs">
                      Coprime
                    </span>
                  )}
                </div>
              ))}
              <div className="border-t border-white/5 mt-3 pt-3">
                <span className="font-mono text-sm font-bold">
                  <span className="text-gray-400">Hasil akhir GCD = </span>
                  <span className={statusColor}>{gcdValue}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interpretasi */}
      <div className={`rounded-xl p-4 border mb-5 ${statusBg}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={`font-semibold ${statusColor} mb-1`}>
              GCD = {gcdValue} → {isCoprime ? 'Coprime' : 'Struktur Aritmetika Terdeteksi'}
            </p>
            <p className="text-sm text-gray-400">
              {isCoprime
                ? 'Tidak terdapat faktor pembagi bersama selain 1 pada seluruh nilai ASCII karakter password.'
                : `Seluruh nilai ASCII memiliki faktor pembagi bersama: ${gcdValue}. Ini mengindikasikan adanya struktur aritmetika pada karakter yang digunakan.`}
            </p>
          </div>
        </div>
      </div>

      {/* GCD Score */}
      <div className="bg-gray-950/50 rounded-xl p-4 border border-white/5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-gray-300">GCD Score</p>
            <p className="text-xs text-gray-600 font-mono">
              {isCoprime ? 'GCD = 1 → Score = 100' : 'max(0, 100 - 25 × log₂(GCD))'}
            </p>
          </div>
          <p className={`text-2xl font-bold font-mono ${isCoprime ? 'text-green-400' : 'text-orange-400'}`}>
            {toFixed(gcdScore)}
          </p>
        </div>
        {!isCoprime && (
          <div className="formula-box text-xs py-2 px-3 text-gray-500 mt-2">
            Score = max(0, 100 - 25 × log₂({gcdValue})) = max(0, 100 - 25 × {toFixed(Math.log2(gcdValue), 3)}) = {toFixed(gcdScore)}
          </div>
        )}
        <div className="progress-container h-2 mt-3">
          <div
            className={`progress-bar ${isCoprime ? 'bg-green-500' : 'bg-orange-500'}`}
            style={{ width: `${gcdScore}%` }}
            role="progressbar"
            aria-valuenow={gcdScore}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Catatan ilmiah */}
      <div className="warning-box text-xs">
        <p className="font-medium text-amber-300 mb-1">⚠ Catatan Ilmiah</p>
        <p>
          Analisis GCD merupakan <strong>indikator aritmetika tambahan</strong>.
          GCD = 1 tidak membuktikan bahwa password benar-benar acak, sedangkan GCD &gt; 1
          hanya menunjukkan adanya faktor pembagi bersama pada nilai ASCII.
          Fitur ini digunakan sebagai komponen heuristic randomness dalam proyek akademik.
        </p>
      </div>
    </div>
  );
}
