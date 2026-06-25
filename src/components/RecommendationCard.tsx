/**
 * components/RecommendationCard.tsx
 * Menampilkan rekomendasi perbaikan password.
 */

import type { Recommendation } from '../types/analysis';
import { severityBadgeColor, severityLabel } from '../utils/formatting';

interface RecommendationCardProps {
  recommendations: Recommendation[];
}

const categoryIcon: Record<Recommendation['category'], string> = {
  length: '📏',
  charset: '🔤',
  gcd: '🔢',
  modulo: '📊',
  entropy: '⚡',
  pattern: '🔍',
};

const categoryLabel: Record<Recommendation['category'], string> = {
  length: 'Panjang',
  charset: 'Charset',
  gcd: 'GCD',
  modulo: 'Distribusi Modulo',
  entropy: 'Entropy',
  pattern: 'Pola',
};

export default function RecommendationCard({ recommendations }: RecommendationCardProps) {
  // Urutkan berdasarkan severity: high → medium → low
  const sorted = [...recommendations].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  const highCount = recommendations.filter((r) => r.severity === 'high').length;
  const mediumCount = recommendations.filter((r) => r.severity === 'medium').length;
  const lowCount = recommendations.filter((r) => r.severity === 'low').length;

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-blue-500/15 text-blue-400">
          <span aria-hidden="true" className="text-sm">💡</span>
        </div>
        <div>
          <h2 className="card-title">11. Rekomendasi Perbaikan</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {recommendations.length} rekomendasi ditemukan
          </p>
        </div>
      </div>

      {/* Counter badges */}
      <div className="flex gap-2 mb-5">
        {highCount > 0 && (
          <span className="badge bg-red-500/15 text-red-400 border-red-500/30 border">
            {highCount} Kritis
          </span>
        )}
        {mediumCount > 0 && (
          <span className="badge bg-orange-500/15 text-orange-400 border-orange-500/30 border">
            {mediumCount} Sedang
          </span>
        )}
        {lowCount > 0 && (
          <span className="badge bg-blue-500/15 text-blue-400 border-blue-500/30 border">
            {lowCount} Rendah
          </span>
        )}
      </div>

      {/* Daftar rekomendasi */}
      <div className="space-y-3">
        {sorted.map((rec) => (
          <RecommendationItem key={rec.id} recommendation={rec} />
        ))}
      </div>

      {/* Catatan */}
      <div className="note-box mt-5 text-xs">
        <p>
          Rekomendasi di atas berdasarkan analisis otomatis komposisi karakter dan pola umum.
          Password yang kuat secara matematis masih dapat lemah jika merupakan kata dari kamus,
          kata sandi yang pernah bocor, atau mengandung informasi pribadi.
        </p>
        <p className="mt-2">
          Pertimbangkan menggunakan <strong className="text-gray-300">password manager</strong> untuk
          membuat dan menyimpan password yang benar-benar acak dan unik untuk setiap akun.
        </p>
      </div>
    </div>
  );
}

function RecommendationItem({ recommendation }: { recommendation: Recommendation }) {
  const { category, severity, title, description } = recommendation;
  const badgeColor = severityBadgeColor(severity);

  return (
    <div className={`rounded-xl p-4 border transition-all duration-200 ${
      severity === 'high'
        ? 'bg-red-950/20 border-red-500/15 hover:border-red-500/30'
        : severity === 'medium'
        ? 'bg-orange-950/20 border-orange-500/15 hover:border-orange-500/30'
        : 'bg-gray-900/50 border-white/5 hover:border-white/10'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">
          {categoryIcon[category]}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
            <span className={`badge border text-xs ${badgeColor}`}>
              {severityLabel(severity)}
            </span>
            <span className="badge bg-gray-800 text-gray-500 border-gray-700 border text-xs">
              {categoryLabel[category]}
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
