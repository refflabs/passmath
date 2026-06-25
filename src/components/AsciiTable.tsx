/**
 * components/AsciiTable.tsx
 * Menampilkan tabel nilai ASCII setiap karakter password.
 */

import type { GcdAnalysisResult } from '../types/analysis';

interface AsciiTableProps {
  gcdAnalysis: GcdAnalysisResult;
}

export default function AsciiTable({ gcdAnalysis }: AsciiTableProps) {
  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-teal-500/15 text-teal-400">
          <span aria-hidden="true" className="text-xs font-bold">ASCII</span>
        </div>
        <div>
          <h2 className="card-title">5. Tabel Nilai ASCII</h2>
          <p className="text-xs text-gray-500 mt-0.5">Representasi numerik setiap karakter password</p>
        </div>
      </div>

      <div className="overflow-x-auto-mobile rounded-xl border border-white/5">
        <table className="data-table" aria-label="Tabel nilai ASCII karakter password">
          <thead>
            <tr className="bg-gray-900/60">
              <th className="w-16">Posisi</th>
              <th className="w-24">Karakter</th>
              <th>Nilai ASCII</th>
              <th>Biner (8-bit)</th>
              <th>Hex</th>
            </tr>
          </thead>
          <tbody>
            {gcdAnalysis.asciiValues.map(({ char, ascii }, index) => (
              <tr key={index}>
                <td className="text-gray-600">{index + 1}</td>
                <td>
                  <span className="bg-gray-800 px-2 py-0.5 rounded text-sm text-white font-mono">
                    {char === ' ' ? '[spasi]' : char}
                  </span>
                </td>
                <td className="text-blue-300 font-mono font-medium">{ascii}</td>
                <td className="text-gray-500 font-mono text-xs tracking-wider">
                  {ascii.toString(2).padStart(8, '0')}
                </td>
                <td className="text-violet-400 font-mono text-xs uppercase">
                  0x{ascii.toString(16).padStart(2, '0').toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {gcdAnalysis.asciiValues.length > 10 && (
        <p className="text-xs text-gray-600 mt-3 text-center">
          Scroll horizontal untuk melihat seluruh kolom
        </p>
      )}
    </div>
  );
}
