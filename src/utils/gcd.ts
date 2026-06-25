/**
 * utils/gcd.ts
 * Perhitungan Greatest Common Divisor (GCD) menggunakan algoritma Euclidean.
 *
 * GCD digunakan untuk menganalisis apakah nilai ASCII karakter password
 * memiliki faktor pembagi bersama (tidak koprime).
 *
 * GCD = 1 → Coprime (tidak ada faktor pembagi selain 1)
 * GCD > 1 → Ada faktor pembagi bersama
 *
 * CATATAN ILMIAH:
 * GCD merupakan indikator aritmetika tambahan dan bukan uji randomness kriptografis.
 * GCD = 1 tidak membuktikan bahwa password benar-benar acak.
 */

import type { GcdAnalysisResult, GcdStep } from '../types/analysis';

/**
 * Menghitung GCD dua bilangan menggunakan algoritma Euclidean iteratif.
 *
 * Algoritma:
 *   Selama b ≠ 0:
 *     remainder = a mod b
 *     a ← b
 *     b ← remainder
 *   Kembalikan |a|
 *
 * Kompleksitas: O(log(min(a, b)))
 */
export function gcd(a: number, b: number): number {
  // Pastikan kedua nilai non-negatif
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }

  return x;
}

/**
 * Menghitung GCD dari sebuah array bilangan secara berurutan (reduce).
 *
 * Contoh: gcdArray([73, 110, 102]) = gcd(gcd(73, 110), 102) = 1
 */
export function gcdArray(values: number[]): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return Math.abs(values[0]);
  return values.reduce((result, value) => gcd(result, value));
}

/**
 * Menghitung GCD Score dari nilai GCD.
 *
 * Rumus:
 *   GCD = 1 → GCD Score = 100
 *   GCD > 1 → GCD Score = max(0, 100 - 25 × log₂(GCD))
 *
 * Score lebih rendah ketika GCD lebih besar,
 * karena GCD besar mengindikasikan struktur aritmetika yang lebih kuat.
 */
export function calculateGcdScore(gcdValue: number): number {
  if (gcdValue <= 1) return 100;
  // Kurangi score berdasarkan log₂(GCD)
  const penalty = 25 * Math.log2(gcdValue);
  return Math.max(0, 100 - penalty);
}

/**
 * Menjalankan analisis GCD lengkap terhadap password.
 *
 * Proses:
 * 1. Konversi setiap karakter ke nilai ASCII.
 * 2. Hitung GCD secara berurutan dan rekam setiap langkah.
 * 3. Tentukan apakah password bersifat coprime.
 * 4. Hitung GCD Score.
 */
export function analyzeGcd(password: string): GcdAnalysisResult {
  // Dapatkan hanya karakter yang didukung untuk analisis ASCII
  const chars = [...password];

  const asciiValues = chars.map((ch) => ({
    char: ch,
    ascii: ch.charCodeAt(0),
  }));

  if (asciiValues.length === 0) {
    return {
      asciiValues: [],
      steps: [],
      gcdValue: 0,
      isCoprime: false,
      gcdScore: 0,
    };
  }

  const steps: GcdStep[] = [];
  let currentGcd = asciiValues[0].ascii;

  // Hitung GCD secara bertahap, rekam setiap langkah
  for (let i = 1; i < asciiValues.length; i++) {
    const next = asciiValues[i].ascii;
    const prevGcd = currentGcd;
    currentGcd = gcd(currentGcd, next);

    steps.push({
      a: prevGcd,
      b: next,
      result: currentGcd,
      description: `gcd(${prevGcd}, ${next}) = ${currentGcd}`,
    });

    // Optimasi awal: jika GCD sudah 1, tidak perlu melanjutkan
    if (currentGcd === 1) {
      // Tambahkan informasi langkah sisa
      if (i < asciiValues.length - 1) {
        steps.push({
          a: 1,
          b: -1, // sentinel
          result: 1,
          description: `gcd(1, ...) = 1 untuk semua sisa karakter`,
        });
      }
      break;
    }
  }

  const gcdValue = currentGcd;
  const isCoprime = gcdValue === 1;
  const gcdScore = calculateGcdScore(gcdValue);

  return {
    asciiValues,
    steps,
    gcdValue,
    isCoprime,
    gcdScore,
  };
}
