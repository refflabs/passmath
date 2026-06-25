/**
 * components/ModuloDistributionChart.tsx
 * Visualisasi distribusi modulo ASCII mod 97.
 */

import { useMemo } from 'react';
import type { ModuloAnalysis } from '../types/analysis';
import { BUCKET_DEFINITIONS, MODULO_PRIME } from '../utils/moduloDistribution';
import { toFixed } from '../utils/formatting';

interface ModuloDistributionChartProps {
  moduloAnalysis: ModuloAnalysis;
}

export default function ModuloDistributionChart({ moduloAnalysis }: ModuloDistributionChartProps) {
  const { residues, uniqueResidueRatio, bucketCounts, bucketEntropy, normalizedBucketEntropy, score, status } = moduloAnalysis;

  const statusColor = status === 'Relatif Tersebar' ? 'text-green-400' : 'text-orange-400';
  const statusBg = status === 'Relatif Tersebar'
    ? 'bg-green-500/10 border-green-500/20'
    : 'bg-orange-500/10 border-orange-500/20';

  // Hitung tinggi relatif bar chart berdasarkan bucket counts
  const maxBucket = Math.max(...bucketCounts, 1);

  // Buat data dot plot untuk visualisasi residue (0–96)
  const dotsByResidue = useMemo(() => {
    const map = new Map<number, number>();
    residues.forEach(({ residue }) => {
      map.set(residue, (map.get(residue) ?? 0) + 1);
    });
    return map;
  }, [residues]);

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-orange-500/15 text-orange-400">
          <span aria-hidden="true" className="text-xs font-bold">mod</span>
        </div>
        <div>
          <h2 className="card-title">7. Distribusi Modulo</h2>
          <p className="text-xs text-gray-500 mt-0.5">ASCII(karakter) mod {MODULO_PRIME} — Distribusi residu</p>
        </div>
      </div>

      {/* Tabel residue */}
      <div className="overflow-x-auto-mobile rounded-xl border border-white/5 mb-5">
        <table className="data-table" aria-label="Tabel residue modulo">
          <thead>
            <tr className="bg-gray-900/60">
              <th className="w-16">Posisi</th>
              <th>Karakter</th>
              <th>ASCII</th>
              <th>ASCII mod {MODULO_PRIME}</th>
              <th>Bucket</th>
            </tr>
          </thead>
          <tbody>
            {residues.map(({ char, ascii, residue, position }) => {
              // Tentukan bucket
              const bucketIdx = BUCKET_DEFINITIONS.findIndex(
                (b) => residue >= b.min && residue <= b.max
              );
              return (
                <tr key={position}>
                  <td className="text-gray-600">{position}</td>
                  <td>
                    <span className="bg-gray-800 px-2 py-0.5 rounded text-sm text-white font-mono">
                      {char}
                    </span>
                  </td>
                  <td className="text-blue-300 font-mono">{ascii}</td>
                  <td className="text-orange-300 font-mono font-medium">{residue}</td>
                  <td className="text-gray-500 text-xs">{BUCKET_DEFINITIONS[bucketIdx]?.label ?? '?'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dot Plot Visualisasi */}
      <div className="mb-5">
        <p className="section-label mb-3">Dot Plot Residue (0–96)</p>
        <div className="bg-gray-950/50 rounded-xl p-4 border border-white/5 overflow-x-auto-mobile">
          <div className="relative" style={{ minWidth: '400px' }}>
            {/* Garis basis */}
            <div className="flex items-end gap-0.5 h-16">
              {Array.from({ length: MODULO_PRIME }, (_, i) => {
                const count = dotsByResidue.get(i) ?? 0;
                const heightPct = count > 0 ? Math.max(20, (count / Math.max(...Array.from(dotsByResidue.values()), 1)) * 100) : 0;
                // Warna berdasarkan bucket
                const bucketIdx = BUCKET_DEFINITIONS.findIndex((b) => i >= b.min && i <= b.max);
                const bucketColors = [
                  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
                  'bg-pink-500', 'bg-rose-500', 'bg-orange-500',
                ];
                const barColor = count > 0 ? bucketColors[bucketIdx] ?? 'bg-blue-500' : 'bg-gray-800';

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end group relative"
                    title={count > 0 ? `Residue ${i}: ${count} karakter` : `Residue ${i}: kosong`}
                  >
                    <div
                      className={`w-full rounded-sm transition-all duration-300 ${barColor}`}
                      style={{ height: count > 0 ? `${heightPct}%` : '2px', opacity: count > 0 ? 1 : 0.15 }}
                    />
                    {count > 1 && (
                      <span className="absolute -top-4 text-xs text-yellow-400 font-bold">{count}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Label sumbu X */}
            <div className="flex justify-between text-xs text-gray-700 mt-1">
              <span>0</span>
              <span>24</span>
              <span>48</span>
              <span>72</span>
              <span>96</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            Setiap bar mewakili satu nilai residue (0–96). Tinggi bar = jumlah karakter dengan residue tersebut.
          </p>
        </div>
      </div>

      {/* Bucket bar chart */}
      <div className="mb-5">
        <p className="section-label mb-3">Distribusi per Bucket (7 Bucket)</p>
        <div className="space-y-2">
          {BUCKET_DEFINITIONS.map((bucket, i) => {
            const count = bucketCounts[i];
            const widthPct = (count / maxBucket) * 100;
            const bucketColors = [
              'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
              'bg-pink-500', 'bg-rose-500', 'bg-orange-500',
            ];

            return (
              <div key={bucket.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-mono w-16 flex-shrink-0 text-right">
                  {bucket.label}
                </span>
                <div className="flex-1 progress-container h-5">
                  <div
                    className={`progress-bar ${bucketColors[i]} flex items-center justify-end pr-2`}
                    style={{ width: count > 0 ? `${Math.max(8, widthPct)}%` : '0%' }}
                  >
                    {count > 0 && (
                      <span className="text-white text-xs font-bold">{count}</span>
                    )}
                  </div>
                </div>
                {count === 0 && <span className="text-gray-700 text-xs">0</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Metriks distribusi */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <MetricChip
          label="Unique Residue Ratio"
          value={toFixed(uniqueResidueRatio * 100, 1) + '%'}
          sub={`${new Set(residues.map((r) => r.residue)).size}/${residues.length} unik`}
        />
        <MetricChip
          label="Bucket Entropy"
          value={toFixed(bucketEntropy, 3)}
          sub="bit"
        />
        <MetricChip
          label="Normalized Entropy"
          value={toFixed(normalizedBucketEntropy * 100, 1) + '%'}
          sub="dari maksimum"
        />
        <MetricChip
          label="MDS Score"
          value={toFixed(score)}
          sub={status}
          highlight
          color={status === 'Relatif Tersebar' ? 'green' : 'orange'}
        />
      </div>

      {/* Formula MDS */}
      <div className="formula-box mb-5 text-xs space-y-1 text-gray-400">
        <div className="text-gray-500 uppercase tracking-wider mb-2">Perhitungan MDS</div>
        <p>UR = {toFixed(uniqueResidueRatio, 4)} &nbsp;|&nbsp; Normalized Hm = {toFixed(normalizedBucketEntropy, 4)}</p>
        <p>MDS = 100 × ((0.5 × UR) + (0.5 × NormHm))</p>
        <p>MDS = 100 × ((0.5 × {toFixed(uniqueResidueRatio, 4)}) + (0.5 × {toFixed(normalizedBucketEntropy, 4)}))</p>
        <p className="text-sm text-white font-bold mt-1">MDS = {toFixed(score)}</p>
      </div>

      {/* Status */}
      <div className={`rounded-xl p-4 border ${statusBg}`}>
        <p className={`font-semibold ${statusColor} mb-1`}>
          {status} {status === 'Relatif Tersebar' ? '✓' : '⚠'}
        </p>
        <p className="text-sm text-gray-400">
          {status === 'Relatif Tersebar'
            ? `MDS = ${toFixed(score)} ≥ 70. Residue modulo relatif tersebar di berbagai bucket.`
            : `MDS = ${toFixed(score)} < 70. Terdeteksi konsentrasi residue pada bucket tertentu.`}
        </p>
      </div>

      <div className="warning-box text-xs mt-4">
        <strong className="text-amber-300">⚠ Catatan Ilmiah:</strong>{' '}
        Distribusi modulo pada password yang pendek hanya merupakan indikator heuristik.
        Hasil ini tidak membuktikan randomness secara statistik.
        Uji chi-square pada 97 kategori tidak digunakan karena jumlah sampel tidak mencukupi.
      </div>
    </div>
  );
}

function MetricChip({
  label,
  value,
  sub,
  highlight = false,
  color = 'blue',
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  color?: 'blue' | 'green' | 'orange';
}) {
  const colorMap = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
  }[color];

  return (
    <div className={`bg-gray-950/50 rounded-xl p-3 border border-white/5 text-center ${highlight ? 'ring-1 ring-white/10' : ''}`}>
      <p className="text-xs text-gray-500 mb-1 leading-tight">{label}</p>
      <p className={`text-lg font-bold font-mono ${highlight ? colorMap : 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5 leading-tight">{sub}</p>}
    </div>
  );
}
