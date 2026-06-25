/**
 * components/BruteForceCard.tsx
 * Menampilkan simulasi estimasi waktu brute force.
 */

import type { PasswordAnalysisResult } from '../types/analysis';
import { bigIntToScientific } from '../utils/bigIntMath';

interface BruteForceCardProps {
  result: PasswordAnalysisResult;
}

const ATTACK_RATE_DISPLAY = '1.000.000.000';

export default function BruteForceCard({ result }: BruteForceCardProps) {
  const { bruteForce, combinationScientific } = result;
  const { worstCaseSeconds, averageCaseSeconds, timeBreakdown } = bruteForce;

  const timeRows = [
    { label: 'Detik', value: formatBigForDisplay(worstCaseSeconds), unit: 'detik' },
    { label: 'Menit', value: formatBigForDisplay(worstCaseSeconds / 60n), unit: 'menit' },
    { label: 'Jam', value: formatBigForDisplay(worstCaseSeconds / 3_600n), unit: 'jam' },
    { label: 'Hari', value: formatBigForDisplay(worstCaseSeconds / 86_400n), unit: 'hari' },
    { label: 'Tahun', value: formatBigForDisplay(worstCaseSeconds / 31_536_000n), unit: 'tahun' },
    { label: 'Juta Tahun', value: formatBigForDisplay(worstCaseSeconds / 31_536_000_000_000n), unit: 'juta tahun' },
    { label: 'Miliar Tahun', value: formatBigForDisplay(worstCaseSeconds / 31_536_000_000_000_000n), unit: 'miliar tahun' },
    { label: 'Triliun Tahun', value: formatBigForDisplay(worstCaseSeconds / 31_536_000_000_000_000_000n), unit: 'triliun tahun' },
  ];

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-red-500/15 text-red-400">
          <span aria-hidden="true" className="text-sm">⚔</span>
        </div>
        <div>
          <h2 className="card-title">9. Simulasi Brute Force</h2>
          <p className="text-xs text-gray-500 mt-0.5">Estimasi waktu exhaustive search</p>
        </div>
      </div>

      {/* Asumsi */}
      <div className="bg-gray-950/50 rounded-xl p-4 border border-white/5 mb-5">
        <p className="section-label mb-3">Parameter Serangan</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Attack Rate</p>
            <p className="font-mono text-sm text-red-300 font-semibold">{ATTACK_RATE_DISPLAY}</p>
            <p className="text-xs text-gray-600">percobaan per detik</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Ruang Kombinasi (K)</p>
            <p className="font-mono text-sm text-blue-300 font-semibold">{combinationScientific}</p>
            <p className="text-xs text-gray-600">kemungkinan kombinasi</p>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="formula-box mb-5 space-y-1.5 text-sm">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Perhitungan Waktu</div>
        <p className="text-gray-400">Worst-case time = K / {ATTACK_RATE_DISPLAY}</p>
        <p className="text-gray-400">Average-case time = K / (2 × {ATTACK_RATE_DISPLAY})</p>
      </div>

      {/* Hasil worst-case */}
      <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 mb-4">
        <p className="text-xs text-red-400/70 mb-2 uppercase tracking-wider">Worst-Case Time (Utama)</p>
        <p className="text-2xl font-bold text-red-300 break-all leading-tight">
          {timeBreakdown.humanReadable}
        </p>
        <p className="text-xs text-gray-600 font-mono mt-2">
          ≈ {bigIntToScientific(worstCaseSeconds)} detik
        </p>
      </div>

      {/* Hasil average-case */}
      <div className="bg-gray-950/50 border border-white/5 rounded-xl p-3 mb-5">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Average-Case Time (Informasi Tambahan)</p>
        <p className="font-mono text-sm text-gray-400">
          ≈ {bigIntToScientific(averageCaseSeconds)} detik
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Rata-rata separuh ruang kombinasi
        </p>
      </div>

      {/* Tabel konversi satuan */}
      <div className="overflow-x-auto-mobile rounded-xl border border-white/5 mb-5">
        <table className="data-table" aria-label="Konversi satuan waktu brute force">
          <thead>
            <tr className="bg-gray-900/60">
              <th>Satuan</th>
              <th className="text-right">Worst-Case</th>
            </tr>
          </thead>
          <tbody>
            {timeRows.map(({ label, value, unit }) => (
              <tr key={label}>
                <td className="text-gray-400">{label}</td>
                <td className="text-right font-mono text-red-300">{value} {unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="warning-box text-xs">
        <p className="font-medium text-amber-300 mb-2">⚠ Catatan Model</p>
        <p>
          Estimasi ini menggunakan model <strong>exhaustive search</strong> terhadap seluruh ruang charset
          dan belum mempertimbangkan:
        </p>
        <ul className="mt-2 space-y-0.5 text-amber-300/70 list-disc list-inside">
          <li>Dictionary attack dan daftar password umum</li>
          <li>Password reuse dan kebocoran database</li>
          <li>Social engineering dan phishing</li>
          <li>Pola bahasa, keyboard, dan personal information</li>
          <li>Optimasi hardware GPU/ASIC</li>
          <li>Peningkatan kapasitas komputasi di masa depan</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Format BigInt untuk tampilan — gunakan notasi ilmiah jika terlalu panjang.
 */
function formatBigForDisplay(n: bigint): string {
  const str = n.toString();
  if (str.length > 15) {
    return bigIntToScientific(n);
  }
  // Tambah pemisah ribuan
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
