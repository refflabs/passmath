/**
 * components/PropositionTable.tsx
 * Tabel logika proposisional P1–P5.
 */

import type { PropositionResult } from '../types/analysis';

interface PropositionTableProps {
  propositions: PropositionResult;
  length: number;
}

export default function PropositionTable({ propositions, length }: PropositionTableProps) {
  const rows = [
    {
      id: 'P1',
      statement: `Panjang password ≥ 12 (saat ini: ${length})`,
      value: propositions.p1,
      formula: 'L ≥ 12',
    },
    {
      id: 'P2',
      statement: 'Terdapat huruf besar (A–Z)',
      value: propositions.p2,
      formula: '∃ ch ∈ A',
    },
    {
      id: 'P3',
      statement: 'Terdapat huruf kecil (a–z)',
      value: propositions.p3,
      formula: '∃ ch ∈ B',
    },
    {
      id: 'P4',
      statement: 'Terdapat angka (0–9)',
      value: propositions.p4,
      formula: '∃ ch ∈ C',
    },
    {
      id: 'P5',
      statement: 'Terdapat simbol',
      value: propositions.p5,
      formula: '∃ ch ∈ D',
    },
  ];

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-cyan-500/15 text-cyan-400">
          <span aria-hidden="true" className="text-base">∧</span>
        </div>
        <div>
          <h2 className="card-title">2. Logika Proposisional</h2>
          <p className="text-xs text-gray-500 mt-0.5">Evaluasi P1 ∧ P2 ∧ P3 ∧ P4 ∧ P5</p>
        </div>
      </div>

      {/* Tabel proposisi */}
      <div className="overflow-x-auto-mobile mb-5 rounded-xl border border-white/5">
        <table className="data-table" aria-label="Tabel logika proposisional">
          <thead>
            <tr className="bg-gray-900/60">
              <th className="w-16">Prop.</th>
              <th>Pernyataan</th>
              <th className="w-20">Formula</th>
              <th className="w-24">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ id, statement, value, formula }) => (
              <tr key={id}>
                <td className="font-bold text-gray-300">{id}</td>
                <td className="text-gray-400">{statement}</td>
                <td className="text-gray-500 text-xs">{formula}</td>
                <td>
                  <span
                    className={`badge border ${
                      value
                        ? 'bg-green-500/15 text-green-400 border-green-500/30'
                        : 'bg-red-500/15 text-red-400 border-red-500/30'
                    }`}
                    aria-label={`${id}: ${value ? 'TRUE' : 'FALSE'}`}
                  >
                    {value ? '✓ TRUE' : '✗ FALSE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hasil konjungsi */}
      <div
        className={`rounded-xl p-4 border ${
          propositions.allTrue
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-red-500/10 border-red-500/20'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-sm text-gray-300">P1 ∧ P2 ∧ P3 ∧ P4 ∧ P5</p>
          <span
            className={`badge border font-bold ${
              propositions.allTrue
                ? 'bg-green-500/20 text-green-300 border-green-500/40'
                : 'bg-red-500/20 text-red-300 border-red-500/40'
            }`}
          >
            {propositions.allTrue ? '✓ TRUE' : '✗ FALSE'}
          </span>
        </div>
        {!propositions.allTrue && (
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-amber-400">ℹ</span>{' '}
            Hasil FALSE tidak selalu berarti password pasti mudah dibobol, tetapi
            menunjukkan bahwa password belum memenuhi seluruh aturan komposisi yang ditentukan.
          </p>
        )}
        {propositions.allTrue && (
          <p className="text-xs text-green-500/70 mt-2">
            Password memenuhi semua kriteria komposisi: panjang cukup, menggunakan keempat kategori karakter.
          </p>
        )}
      </div>
    </div>
  );
}
