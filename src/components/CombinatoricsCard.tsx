/**
 * components/CombinatoricsCard.tsx
 * Menampilkan perhitungan kombinatorika K = N^L.
 */

import { useState } from 'react';
import type { PasswordAnalysisResult } from '../types/analysis';
import { formatBigIntWithSeparator, isBigIntDisplayable } from '../utils/bigIntMath';

interface CombinatoricsCardProps {
  result: PasswordAnalysisResult;
}

export default function CombinatoricsCard({ result }: CombinatoricsCardProps) {
  const [showFullNumber, setShowFullNumber] = useState(false);

  const { charsetSize, length, combinationCount, combinationScientific } = result;
  const fullStr = combinationCount.toString();
  const displayable = isBigIntDisplayable(combinationCount);

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-indigo-500/15 text-indigo-400">
          <span aria-hidden="true" className="text-sm font-bold">N^L</span>
        </div>
        <div>
          <h2 className="card-title">3. Kombinatorika</h2>
          <p className="text-xs text-gray-500 mt-0.5">K = N^L — Ruang pencarian total (Rule of Product)</p>
        </div>
      </div>

      {/* Penjelasan */}
      <div className="info-box mb-5">
        <p>
          K = N^L adalah ukuran ruang pencarian teoretis dengan asumsi setiap posisi karakter
          dapat dipilih secara independen dari charset yang sama.
          Perhitungan menggunakan <strong className="text-blue-300">BigInt</strong> untuk menjaga presisi penuh
          — nilai ini dapat mencapai ratusan digit desimal.
        </p>
      </div>

      {/* Rumus bertahap */}
      <div className="formula-box space-y-3 mb-5">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Perhitungan K = N^L</div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-400">
            <span className="text-gray-600">Rumus umum: </span>
            <span className="text-white">K = N^L</span>
          </p>
          <p className="text-gray-400">
            <span className="text-gray-600">Substitusi: </span>
            <span className="text-white">K = {charsetSize}^{length}</span>
          </p>
          <p className="text-gray-400">
            <span className="text-gray-600">Notasi ilmiah: </span>
            <span className="text-blue-300 font-bold">K ≈ {combinationScientific}</span>
          </p>
        </div>

        {/* Tombol tampilkan angka lengkap */}
        {!displayable && (
          <div>
            <button
              type="button"
              onClick={() => setShowFullNumber((v) => !v)}
              className="text-xs text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              {showFullNumber ? 'Sembunyikan angka lengkap' : `Tampilkan angka lengkap (${fullStr.length} digit)`}
            </button>
            {showFullNumber && (
              <div className="mt-3 bg-gray-950/60 rounded-lg p-3 max-h-40 overflow-y-auto">
                <p className="font-mono text-xs text-green-300 break-all leading-relaxed">
                  {formatBigIntWithSeparator(combinationCount)}
                </p>
                <p className="text-xs text-gray-600 mt-2">{fullStr.length} digit desimal</p>
              </div>
            )}
          </div>
        )}

        {displayable && (
          <div>
            <p className="text-gray-400 text-xs mt-1">
              <span className="text-gray-600">Nilai lengkap: </span>
              <span className="text-green-300 font-mono">{formatBigIntWithSeparator(combinationCount)}</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">{fullStr.length} digit desimal</p>
          </div>
        )}
      </div>

      {/* Visualisasi perbandingan */}
      <div className="grid grid-cols-3 gap-3">
        <InfoChip label="N (Charset)" value={String(charsetSize)} color="indigo" />
        <InfoChip label="L (Panjang)" value={String(length)} color="purple" />
        <InfoChip label="Digit K" value={String(fullStr.length)} color="blue" sub="digit" />
      </div>
    </div>
  );
}

function InfoChip({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string;
  color: 'indigo' | 'purple' | 'blue';
  sub?: string;
}) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }[color];

  return (
    <div className={`rounded-xl p-3 border text-center ${colorMap}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold font-mono">{value}</p>
      {sub && <p className="text-xs opacity-60">{sub}</p>}
    </div>
  );
}
