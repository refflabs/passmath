/**
 * utils/entropy.ts
 * Menghitung entropy password menggunakan rumus:
 *   H = L × log₂(N)
 *
 * Keterangan:
 *   H = entropy teoretis (bit)
 *   L = panjang password
 *   N = ukuran charset efektif
 *
 * Catatan: Ini adalah entropy teoretis ruang pencarian, bukan entropy empiris.
 * Rumus mengasumsikan pemilihan karakter independen dan seragam.
 */

/** Status klasifikasi entropy */
export type EntropyStatus =
  | 'Sangat Lemah'
  | 'Lemah'
  | 'Cukup'
  | 'Kuat'
  | 'Sangat Kuat';

/**
 * Menghitung entropy teoretis password.
 *
 * @param length   Panjang password (L)
 * @param charsetSize  Ukuran charset efektif (N)
 * @returns Nilai entropy dalam bit
 */
export function calculateEntropy(length: number, charsetSize: number): number {
  // Tangani kasus edge: panjang atau charset nol
  if (length === 0 || charsetSize === 0) return 0;
  // H = L × log₂(N)
  return length * Math.log2(charsetSize);
}

/**
 * Menentukan status klasifikasi berdasarkan nilai entropy.
 *
 * Klasifikasi:
 *   H < 28         → Sangat Lemah
 *   28 ≤ H < 36    → Lemah
 *   36 ≤ H < 60    → Cukup
 *   60 ≤ H < 128   → Kuat
 *   H ≥ 128        → Sangat Kuat
 */
export function getEntropyStatus(entropy: number): EntropyStatus {
  if (entropy < 28) return 'Sangat Lemah';
  if (entropy < 36) return 'Lemah';
  if (entropy < 60) return 'Cukup';
  if (entropy < 128) return 'Kuat';
  return 'Sangat Kuat';
}

/**
 * Menghitung Entropy Score (ES) dalam rentang 0–100.
 *
 * Rumus:
 *   ES = min(100, (H / 128) × 100)
 *
 * Nilai 128 bit merupakan batas referensi entropy "Sangat Kuat".
 */
export function calculateEntropyScore(entropy: number): number {
  return Math.min(100, (entropy / 128) * 100);
}

/**
 * Menghitung panjang minimum password untuk mencapai entropy 128 bit.
 *
 * Rumus:
 *   L_min = ⌈128 / log₂(N)⌉
 *
 * Digunakan untuk rekomendasi panjang minimum.
 */
export function calculateMinLengthFor128Bits(charsetSize: number): number {
  if (charsetSize <= 1) return 128;
  return Math.ceil(128 / Math.log2(charsetSize));
}
