/**
 * App.tsx
 * Komponen utama aplikasi Sistem Analisis Keamanan Password.
 *
 * Arsitektur:
 * - State password dikelola di sini
 * - Analisis dijalankan melalui analyzePassword()
 * - Setiap section ditampilkan sebagai komponen terpisah
 * - Password TIDAK disimpan ke state, storage, atau dikirim ke jaringan
 */

import { useState, useCallback } from 'react';
import type { PasswordAnalysisResult } from './types/analysis';
import { analyzePassword, MAX_PASSWORD_LENGTH } from './utils/analyzePassword';

import PasswordInput from './components/PasswordInput';
import AnalysisSummary from './components/AnalysisSummary';
import SetTheoryCard from './components/SetTheoryCard';
import PropositionTable from './components/PropositionTable';
import CombinatoricsCard from './components/CombinatoricsCard';
import EntropyCard from './components/EntropyCard';
import AsciiTable from './components/AsciiTable';
import GcdAnalysisCard from './components/GcdAnalysisCard';
import ModuloDistributionChart from './components/ModuloDistributionChart';
import ScoringCard from './components/ScoringCard';
import BruteForceCard from './components/BruteForceCard';
import DecisionTree from './components/DecisionTree';
import RecommendationCard from './components/RecommendationCard';
import DisclaimerCard from './components/DisclaimerCard';

export default function App() {
  const [result, setResult] = useState<PasswordAnalysisResult | null>(null);
  const [analysisPassword, setAnalysisPassword] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);

  const handleAnalyze = useCallback((password: string) => {
    if (!password || password.trim().length === 0) {
      setIsEmpty(true);
      setResult(null);
      return;
    }
    setIsEmpty(false);
    // Jalankan analisis — semua perhitungan di sisi klien
    const analysisResult = analyzePassword(password);
    if (analysisResult) {
      setResult(analysisResult);
      setAnalysisPassword(password);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setAnalysisPassword('');
    setIsEmpty(false);
  }, []);

  return (
    <div className="min-h-screen bg-animated-gradient bg-grid">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-white/5">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="badge bg-green-500/15 text-green-400 border-green-500/30 border">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Client-side Analysis
            </span>
            <span className="badge bg-blue-500/15 text-blue-400 border-blue-500/30 border">
              🔒 Password tidak dikirim ke server
            </span>
            <span className="badge bg-purple-500/15 text-purple-400 border-purple-500/30 border">
              Matematika Diskrit
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 text-balance">
            Sistem Analisis Keamanan Password
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Berbasis <strong className="text-blue-300">Kombinatorika</strong>,{' '}
            <strong className="text-purple-300">Entropy</strong>, dan{' '}
            <strong className="text-cyan-300">Teori Bilangan</strong> — menggunakan metode{' '}
            <strong className="text-white">Hybrid Scoring</strong>.
            Seluruh analisis dijalankan di browser Anda.
          </p>

          {/* Stats badges */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { label: '12 Modul Analisis', icon: '📊' },
              { label: 'BigInt Precision', icon: '🔢' },
              { label: 'Zero Network Requests', icon: '🛡' },
              { label: 'Vitest Tested', icon: '✅' },
            ].map(({ label, icon }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-900/50 rounded-full px-3 py-1 border border-white/5"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Input section */}
        <PasswordInput
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          isAnalyzed={result !== null}
        />

        {/* Empty password warning */}
        {isEmpty && (
          <div className="card p-5 border-amber-500/20 bg-amber-950/10 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-amber-300">Masukkan password terlebih dahulu.</p>
                <p className="text-sm text-amber-400/70 mt-0.5">
                  Ketik password di kolom input di atas, lalu klik tombol Analisis Password.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis results */}
        {result && (
          <>
            {/* Section nav */}
            <nav className="hidden sm:flex flex-wrap gap-2" aria-label="Navigasi section analisis">
              {[
                { href: '#summary', label: 'Ringkasan' },
                { href: '#set-theory', label: '1. Himpunan' },
                { href: '#propositions', label: '2. Logika' },
                { href: '#combinatorics', label: '3. Kombinatorika' },
                { href: '#entropy', label: '4. Entropy' },
                { href: '#ascii', label: '5. ASCII' },
                { href: '#gcd', label: '6. GCD' },
                { href: '#modulo', label: '7. Modulo' },
                { href: '#scoring', label: '8. Scoring' },
                { href: '#bruteforce', label: '9. Brute Force' },
                { href: '#decision', label: '10. Pohon' },
                { href: '#recommendations', label: '11. Rekomendasi' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-xs bg-gray-800/60 hover:bg-gray-700/60 text-gray-400 hover:text-gray-200 px-3 py-1.5 rounded-full border border-white/5 transition-all duration-150"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* 0. Summary */}
            <section id="summary" aria-labelledby="summary-heading">
              <h2 id="summary-heading" className="sr-only">Ringkasan Hasil</h2>
              <AnalysisSummary result={result} />
            </section>

            {/* 1. Set Theory */}
            <section id="set-theory" aria-labelledby="set-theory-heading">
              <h2 id="set-theory-heading" className="sr-only">Teori Himpunan</h2>
              <SetTheoryCard charAnalysis={result.charAnalysis} charsetSize={result.charsetSize} />
            </section>

            {/* 2. Propositions */}
            <section id="propositions" aria-labelledby="propositions-heading">
              <h2 id="propositions-heading" className="sr-only">Logika Proposisional</h2>
              <PropositionTable propositions={result.propositions} length={result.length} />
            </section>

            {/* 3. Combinatorics */}
            <section id="combinatorics" aria-labelledby="combinatorics-heading">
              <h2 id="combinatorics-heading" className="sr-only">Kombinatorika</h2>
              <CombinatoricsCard result={result} />
            </section>

            {/* 4. Entropy */}
            <section id="entropy" aria-labelledby="entropy-heading">
              <h2 id="entropy-heading" className="sr-only">Analisis Entropy</h2>
              <EntropyCard result={result} />
            </section>

            {/* 5. ASCII Table */}
            <section id="ascii" aria-labelledby="ascii-heading">
              <h2 id="ascii-heading" className="sr-only">Tabel ASCII</h2>
              <AsciiTable gcdAnalysis={result.gcdAnalysis} />
            </section>

            {/* 6. GCD */}
            <section id="gcd" aria-labelledby="gcd-heading">
              <h2 id="gcd-heading" className="sr-only">Analisis GCD</h2>
              <GcdAnalysisCard gcdAnalysis={result.gcdAnalysis} />
            </section>

            {/* 7. Modulo Distribution */}
            <section id="modulo" aria-labelledby="modulo-heading">
              <h2 id="modulo-heading" className="sr-only">Distribusi Modulo</h2>
              <ModuloDistributionChart moduloAnalysis={result.moduloAnalysis} password={analysisPassword} />
            </section>

            {/* 8. Hybrid Scoring */}
            <section id="scoring" aria-labelledby="scoring-heading">
              <h2 id="scoring-heading" className="sr-only">Hybrid Scoring</h2>
              <ScoringCard result={result} />
            </section>

            {/* 9. Brute Force */}
            <section id="bruteforce" aria-labelledby="bruteforce-heading">
              <h2 id="bruteforce-heading" className="sr-only">Simulasi Brute Force</h2>
              <BruteForceCard result={result} />
            </section>

            {/* 10. Decision Tree */}
            <section id="decision" aria-labelledby="decision-heading">
              <h2 id="decision-heading" className="sr-only">Pohon Keputusan</h2>
              <DecisionTree finalScore={result.finalScore} securityStatus={result.securityStatus} />
            </section>

            {/* 11. Recommendations */}
            <section id="recommendations" aria-labelledby="recommendations-heading">
              <h2 id="recommendations-heading" className="sr-only">Rekomendasi Perbaikan</h2>
              <RecommendationCard recommendations={result.recommendations} />
            </section>

            {/* 12. Disclaimer */}
            <section id="disclaimer" aria-labelledby="disclaimer-heading">
              <h2 id="disclaimer-heading" className="sr-only">Catatan Keterbatasan Model</h2>
              <DisclaimerCard />
            </section>
          </>
        )}

        {/* Empty state (no analysis yet) */}
        {!result && !isEmpty && (
          <div className="card p-10 text-center animate-fade-in">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              Siap Menganalisis Password Anda
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Masukkan password di kolom di atas dan klik{' '}
              <strong className="text-white">Analisis Password</strong> untuk memulai.
              Atau gunakan tombol <strong className="text-white">Contoh</strong> untuk mencoba password demo.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-sm text-gray-600">
              {[
                '📐 Teori Himpunan',
                '∧ Logika Proposisional',
                'N^L Kombinatorika',
                'H Entropy Analysis',
                'GCD Teori Bilangan',
                '🌳 Pohon Keputusan',
              ].map((item) => (
                <div
                  key={item}
                  className="bg-gray-900/50 border border-white/5 rounded-lg py-2 px-3 text-xs"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Max length info */}
        <p className="text-center text-xs text-gray-700">
          Analisis mendukung password hingga {MAX_PASSWORD_LENGTH} karakter.
          Semua karakter yang tidak termasuk charset (A–Z, a–z, 0–9, simbol) akan ditandai.
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs text-gray-600">
            Sistem Analisis Keamanan Password — Proyek Akademik Matematika Diskrit.
            Dibangun dengan React + Vite + TypeScript + Tailwind CSS.
          </p>
          <p className="text-xs text-gray-700 mt-1">
            Password Anda tidak pernah meninggalkan browser. Tidak ada jaringan. Tidak ada logging.
          </p>
        </div>
      </footer>
    </div>
  );
}
