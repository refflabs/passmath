/**
 * components/SetTheoryCard.tsx
 * Menampilkan analisis teori himpunan: A ∪ B ∪ C ∪ D.
 */

import type { CharacterCategoryResult } from '../types/analysis';
import { CHARSET_SIZES, STANDARD_SYMBOLS } from '../utils/characterAnalysis';

interface SetTheoryCardProps {
  charAnalysis: CharacterCategoryResult;
  charsetSize: number;
}

export default function SetTheoryCard({ charAnalysis, charsetSize }: SetTheoryCardProps) {
  const sets = [
    {
      id: 'A',
      name: 'Huruf Besar (A)',
      definition: 'A–Z',
      size: CHARSET_SIZES.uppercase,
      active: charAnalysis.hasUppercase,
      count: charAnalysis.uppercaseCount,
      color: 'blue',
    },
    {
      id: 'B',
      name: 'Huruf Kecil (B)',
      definition: 'a–z',
      size: CHARSET_SIZES.lowercase,
      active: charAnalysis.hasLowercase,
      count: charAnalysis.lowercaseCount,
      color: 'emerald',
    },
    {
      id: 'C',
      name: 'Angka (C)',
      definition: '0–9',
      size: CHARSET_SIZES.digit,
      active: charAnalysis.hasDigit,
      count: charAnalysis.digitCount,
      color: 'violet',
    },
    {
      id: 'D',
      name: 'Simbol (D)',
      definition: STANDARD_SYMBOLS,
      size: CHARSET_SIZES.symbol,
      active: charAnalysis.hasSymbol,
      count: charAnalysis.symbolCount,
      color: 'amber',
    },
  ] as const;

  const activeTerms = sets.filter((s) => s.active);
  const calculationStr = activeTerms.map((s) => s.size).join(' + ');

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-purple-500/15 text-purple-400">
          <span aria-hidden="true" className="text-base">∪</span>
        </div>
        <div>
          <h2 className="card-title">1. Teori Himpunan</h2>
          <p className="text-xs text-gray-500 mt-0.5">Ukuran charset efektif N = |A ∪ B ∪ C ∪ D|</p>
        </div>
      </div>

      {/* Penjelasan */}
      <div className="info-box mb-5">
        <p>
          Karena himpunan A, B, C, D bersifat <strong className="text-blue-300">disjoint</strong> (saling terpisah),
          ukuran gabungan sama dengan jumlah ukuran himpunan yang aktif dalam password.
          Ukuran setiap himpunan menggunakan nilai penuh (bukan hanya karakter unik yang digunakan),
          karena penyerang diasumsikan mencoba seluruh charset.
        </p>
      </div>

      {/* Kartu himpunan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {sets.map((set) => (
          <SetCard key={set.id} {...set} />
        ))}
      </div>

      {/* Rumus kalkulasi */}
      <div className="formula-box">
        <div className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Kalkulasi N</div>
        <div className="space-y-1.5 text-gray-300">
          <p>N = |A ∪ B ∪ C ∪ D|</p>
          <p className="text-gray-500">
            N ={' '}
            {sets.map((s, i) => (
              <span key={s.id}>
                {i > 0 && <span className="mx-1 text-gray-600">+</span>}
                <span className={s.active ? 'text-white' : 'line-through text-gray-700'}>
                  {s.size} [{s.id}]
                </span>
              </span>
            ))}
          </p>
          {activeTerms.length > 0 && (
            <p>
              N = {calculationStr}{' '}
              <span className="text-gray-500">({activeTerms.map((s) => `|${s.id}|`).join(' + ')})</span>
            </p>
          )}
          <p className="text-lg font-bold text-blue-400 mt-2">
            N = {charsetSize}
          </p>
        </div>
      </div>
    </div>
  );
}

function SetCard({
  id,
  name,
  definition,
  size,
  active,
  count,
  color,
}: {
  id: string;
  name: string;
  definition: string;
  size: number;
  active: boolean;
  count: number;
  color: 'blue' | 'emerald' | 'violet' | 'amber';
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      badge: 'bg-blue-500/20 text-blue-300',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      badge: 'bg-emerald-500/20 text-emerald-300',
    },
    violet: {
      bg: 'bg-violet-500/10',
      text: 'text-violet-400',
      border: 'border-violet-500/20',
      badge: 'bg-violet-500/20 text-violet-300',
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      badge: 'bg-amber-500/20 text-amber-300',
    },
  }[color];

  return (
    <div
      className={`rounded-xl p-4 border transition-all duration-200 ${
        active
          ? `${colorMap.bg} ${colorMap.border}`
          : 'bg-gray-900/50 border-gray-800/50 opacity-50'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider ${active ? colorMap.text : 'text-gray-600'}`}>
            {id}
          </span>
          <p className={`text-sm font-medium mt-0.5 ${active ? 'text-gray-200' : 'text-gray-600'}`}>{name}</p>
        </div>
        <div className={`badge ${active ? colorMap.badge : 'bg-gray-800 text-gray-600 border-gray-700'} border`}>
          {active ? `✓ Aktif (${count})` : '✗ Tidak Ada'}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600 font-mono truncate max-w-[140px]" title={definition}>
          {definition}
        </p>
        <p className={`text-sm font-bold font-mono ${active ? colorMap.text : 'text-gray-700'}`}>
          |{id}| = {size}
        </p>
      </div>
    </div>
  );
}
