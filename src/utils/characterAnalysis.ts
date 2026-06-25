/**
 * utils/characterAnalysis.ts
 * Analisis karakter password berdasarkan teori himpunan.
 *
 * Himpunan yang digunakan:
 *   A = {A-Z}       |A| = 26  (huruf besar)
 *   B = {a-z}       |B| = 26  (huruf kecil)
 *   C = {0-9}       |C| = 10  (angka)
 *   D = STANDARD_SYMBOLS  |D| = 26  (simbol)
 *
 * N = |A ∪ B ∪ C ∪ D|
 *   = 26·[A ada] + 26·[B ada] + 10·[C ada] + 26·[D ada]
 */

import type { CharacterCategoryResult } from '../types/analysis';

/** Set simbol yang didukung — tepat 26 simbol */
export const STANDARD_SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

/** Ukuran setiap himpunan charset */
export const CHARSET_SIZES = {
  uppercase: 26,
  lowercase: 26,
  digit: 10,
  symbol: 26,
} as const;

/**
 * Menentukan apakah sebuah karakter termasuk huruf besar (A-Z).
 */
export function isUppercase(ch: string): boolean {
  return ch >= 'A' && ch <= 'Z';
}

/**
 * Menentukan apakah sebuah karakter termasuk huruf kecil (a-z).
 */
export function isLowercase(ch: string): boolean {
  return ch >= 'a' && ch <= 'z';
}

/**
 * Menentukan apakah sebuah karakter termasuk angka (0-9).
 */
export function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

/**
 * Menentukan apakah sebuah karakter termasuk simbol dalam STANDARD_SYMBOLS.
 */
export function isSymbol(ch: string): boolean {
  return STANDARD_SYMBOLS.includes(ch);
}

/**
 * Menentukan apakah sebuah karakter didukung oleh model charset.
 * Karakter didukung jika masuk salah satu dari A, B, C, atau D.
 */
export function isSupportedChar(ch: string): boolean {
  return isUppercase(ch) || isLowercase(ch) || isDigit(ch) || isSymbol(ch);
}

/**
 * Menganalisis komposisi karakter password dan menghitung ukuran charset N.
 *
 * Mengembalikan objek CharacterCategoryResult yang berisi:
 * - Bendera keberadaan setiap kategori
 * - Jumlah karakter setiap kategori
 * - Ukuran charset efektif N
 * - Daftar karakter yang tidak didukung
 */
export function analyzeCharacters(password: string): CharacterCategoryResult {
  let uppercaseCount = 0;
  let lowercaseCount = 0;
  let digitCount = 0;
  let symbolCount = 0;
  const unsupportedSet = new Set<string>();

  for (const ch of password) {
    if (isUppercase(ch)) {
      uppercaseCount++;
    } else if (isLowercase(ch)) {
      lowercaseCount++;
    } else if (isDigit(ch)) {
      digitCount++;
    } else if (isSymbol(ch)) {
      symbolCount++;
    } else {
      // Karakter tidak didukung oleh model charset
      unsupportedSet.add(ch);
    }
  }

  const hasUppercase = uppercaseCount > 0;
  const hasLowercase = lowercaseCount > 0;
  const hasDigit = digitCount > 0;
  const hasSymbol = symbolCount > 0;

  // N = |A ∪ B ∪ C ∪ D|
  // Karena himpunan A, B, C, D saling terpisah (disjoint),
  // ukuran gabungan = jumlah ukuran himpunan yang aktif.
  const charsetSize =
    (hasUppercase ? CHARSET_SIZES.uppercase : 0) +
    (hasLowercase ? CHARSET_SIZES.lowercase : 0) +
    (hasDigit ? CHARSET_SIZES.digit : 0) +
    (hasSymbol ? CHARSET_SIZES.symbol : 0);

  return {
    hasUppercase,
    hasLowercase,
    hasDigit,
    hasSymbol,
    uppercaseCount,
    lowercaseCount,
    digitCount,
    symbolCount,
    charsetSize,
    unsupportedChars: [...unsupportedSet],
  };
}

/**
 * Mendeteksi apakah password mengandung karakter yang tidak didukung.
 * Karakter tidak didukung mencakup spasi, emoji, dan simbol di luar STANDARD_SYMBOLS.
 */
export function detectUnsupportedChars(password: string): string[] {
  const unsupportedSet = new Set<string>();
  for (const ch of password) {
    if (!isSupportedChar(ch)) {
      unsupportedSet.add(ch);
    }
  }
  return [...unsupportedSet];
}
