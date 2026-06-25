/**
 * utils/scoring.ts
 * Perhitungan Hybrid Scoring: Entropy Score, Randomness Score, dan Final Score.
 *
 * Rumus:
 *   ES = min(100, (H / 128) × 100)
 *   GCD Score = 100 jika GCD=1, else max(0, 100 - 25×log₂(GCD))
 *   Modulo Score = MDS
 *   RS = (GCD Score × 0.5) + (Modulo Score × 0.5)
 *   Final Score = (ES × 0.6) + (RS × 0.4)
 */

import type { SecurityStatus } from '../types/analysis';

/**
 * Menghitung Randomness Score.
 *
 * RS merupakan skor heuristik akademik yang menggabungkan:
 * - GCD Score: mengukur keberagaman aritmetika nilai ASCII
 * - Modulo Score: mengukur distribusi residue modulo
 *
 * @param gcdScore    GCD Score (0–100)
 * @param moduloScore Modulo Distribution Score (0–100)
 * @returns Randomness Score (0–100)
 */
export function calculateRandomnessScore(gcdScore: number, moduloScore: number): number {
  // RS = (GCD Score × 50%) + (Modulo Score × 50%)
  return gcdScore * 0.5 + moduloScore * 0.5;
}

/**
 * Menghitung Final Hybrid Score.
 *
 * Menggabungkan Entropy Score (bobot 60%) dan Randomness Score (bobot 40%).
 *
 * @param entropyScore    Entropy Score (0–100)
 * @param randomnessScore Randomness Score (0–100)
 * @returns Final Score (0–100)
 */
export function calculateFinalScore(entropyScore: number, randomnessScore: number): number {
  // Final Score = (ES × 0.6) + (RS × 0.4)
  return entropyScore * 0.6 + randomnessScore * 0.4;
}

/**
 * Menentukan status keamanan berdasarkan Final Score.
 *
 * Klasifikasi pohon keputusan:
 *   0 ≤ score < 40  → Tidak Aman
 *   40 ≤ score < 60 → Kurang Aman
 *   60 ≤ score < 80 → Aman
 *   80 ≤ score ≤ 100 → Sangat Aman
 */
export function getSecurityStatus(finalScore: number): SecurityStatus {
  if (finalScore < 40) return 'Tidak Aman';
  if (finalScore < 60) return 'Kurang Aman';
  if (finalScore < 80) return 'Aman';
  return 'Sangat Aman';
}

/**
 * Mendapatkan warna CSS berdasarkan status keamanan.
 */
export function getStatusColor(status: SecurityStatus): {
  bg: string;
  text: string;
  border: string;
  progress: string;
} {
  switch (status) {
    case 'Tidak Aman':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        progress: 'bg-gradient-to-r from-red-600 to-red-400',
      };
    case 'Kurang Aman':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        progress: 'bg-gradient-to-r from-orange-600 to-amber-400',
      };
    case 'Aman':
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-500/30',
        progress: 'bg-gradient-to-r from-green-600 to-emerald-400',
      };
    case 'Sangat Aman':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        progress: 'bg-gradient-to-r from-blue-600 to-cyan-400',
      };
  }
}

/**
 * Mendapatkan ikon/emoji berdasarkan status keamanan.
 * Sertakan teks agar aksesibel (tidak mengandalkan ikon semata).
 */
export function getStatusIcon(status: SecurityStatus): string {
  switch (status) {
    case 'Tidak Aman':
      return '🔴';
    case 'Kurang Aman':
      return '🟠';
    case 'Aman':
      return '🟢';
    case 'Sangat Aman':
      return '🔵';
  }
}
