/**
 * components/ScoringCard.tsx
 * Menampilkan Hybrid Scoring: ES, GCD Score, Randomness Score, Final Score.
 */

import type { PasswordAnalysisResult } from '../types/analysis';
import { getStatusColor } from '../utils/scoring';
import { toFixed } from '../utils/formatting';

interface ScoringCardProps {
  result: PasswordAnalysisResult;
}

export default function ScoringCard({ result }: ScoringCardProps) {
  const { entropyScore, gcdScore, moduloAnalysis, randomnessScore, finalScore, securityStatus } = result;
  const colors = getStatusColor(securityStatus);

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-300">
          <span aria-hidden="true" className="text-sm">⚡</span>
        </div>
        <div>
          <h2 className="card-title">8. Hybrid Scoring</h2>
          <p className="text-xs text-gray-500 mt-0.5">Final Score = (ES × 60%) + (RS × 40%)</p>
        </div>
      </div>

      {/* Komponen scoring */}
      <div className="space-y-4 mb-6">
        {/* Entropy Score */}
        <ScoreRow
          label="Entropy Score (ES)"
          formula="min(100, (H / 128) × 100)"
          value={entropyScore}
          weight="60%"
          color="blue"
          description={`ES = min(100, (${toFixed(result.entropy)} / 128) × 100) = ${toFixed(entropyScore)}`}
        />

        {/* Randomness Score - breakdown */}
        <div className="bg-gray-950/50 rounded-xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-300">Randomness Score (RS)</p>
              <p className="text-xs text-gray-600 font-mono">RS = (GCD Score × 0.5) + (Modulo Score × 0.5)</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold font-mono text-purple-400">{toFixed(randomnessScore)}</p>
              <p className="text-xs text-gray-600">bobot 40%</p>
            </div>
          </div>

          {/* Sub-components */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-gray-900/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">GCD Score</p>
              <p className="text-lg font-bold font-mono text-green-400">{toFixed(gcdScore)}</p>
              <p className="text-xs text-gray-600 mt-0.5">bobot 50% dari RS</p>
            </div>
            <div className="bg-gray-900/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Modulo Score (MDS)</p>
              <p className="text-lg font-bold font-mono text-orange-400">{toFixed(moduloAnalysis.score)}</p>
              <p className="text-xs text-gray-600 mt-0.5">bobot 50% dari RS</p>
            </div>
          </div>

          <div className="formula-box mt-3 text-xs text-gray-400 py-2 px-3">
            RS = ({toFixed(gcdScore)} × 0.5) + ({toFixed(moduloAnalysis.score)} × 0.5) = {toFixed(randomnessScore)}
          </div>

          <div className="progress-container h-2 mt-3">
            <div
              className="progress-bar bg-gradient-to-r from-purple-600 to-pink-500"
              style={{ width: `${Math.min(100, randomnessScore)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Final Score calculation */}
      <div className={`rounded-xl p-5 border ${colors.bg} ${colors.border}`}>
        <p className="section-label mb-3">Perhitungan Final Hybrid Score</p>
        <div className="formula-box mb-4 space-y-1.5 text-sm">
          <p className="text-gray-400">Final Score = (ES × 0.6) + (RS × 0.4)</p>
          <p className="text-gray-400">
            Final Score = ({toFixed(entropyScore)} × 0.6) + ({toFixed(randomnessScore)} × 0.4)
          </p>
          <p className="text-gray-400">
            Final Score = {toFixed(entropyScore * 0.6)} + {toFixed(randomnessScore * 0.4)}
          </p>
          <p className={`text-2xl font-bold ${colors.text} mt-2`}>
            Final Score = {toFixed(finalScore)}
          </p>
        </div>

        <div className="progress-container h-4">
          <div
            className={`progress-bar ${colors.progress}`}
            style={{ width: `${Math.min(100, finalScore)}%` }}
            role="progressbar"
            aria-valuenow={finalScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Final Score: ${toFixed(finalScore)}`}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-600">0 — Tidak Aman</span>
          <span className={`badge border ${colors.bg} ${colors.text} ${colors.border} text-sm font-bold`}>
            {securityStatus}
          </span>
          <span className="text-xs text-gray-600">100 — Sangat Aman</span>
        </div>
      </div>

      <div className="note-box mt-4 text-xs">
        Randomness Score merupakan skor heuristik akademik berdasarkan GCD dan distribusi modulo,
        bukan hasil uji randomness kriptografis.
      </div>
    </div>
  );
}

function ScoreRow({
  label,
  formula,
  value,
  weight,
  color,
  description,
}: {
  label: string;
  formula: string;
  value: number;
  weight: string;
  color: 'blue' | 'purple' | 'green';
  description: string;
}) {
  const colorMap = {
    blue: { text: 'text-blue-400', bar: 'bg-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    purple: { text: 'text-purple-400', bar: 'bg-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    green: { text: 'text-green-400', bar: 'bg-green-600', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  }[color];

  return (
    <div className={`rounded-xl p-4 border ${colorMap.bg} ${colorMap.border}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-gray-300">{label}</p>
          <p className="text-xs text-gray-600 font-mono">{formula}</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold font-mono ${colorMap.text}`}>{toFixed(value)}</p>
          <p className="text-xs text-gray-600">bobot {weight}</p>
        </div>
      </div>
      <div className="formula-box text-xs py-1.5 px-3 text-gray-500 mb-2">
        {description}
      </div>
      <div className="progress-container h-2">
        <div
          className={`progress-bar ${colorMap.bar}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}
