/**
 * utils/recommendations.ts
 * Menghasilkan rekomendasi perbaikan password berdasarkan hasil analisis.
 *
 * Rekomendasi dihasilkan secara otomatis dari:
 * - Panjang password
 * - Kategori karakter yang digunakan
 * - Nilai GCD
 * - Modulo Distribution Score
 * - Nilai entropy
 * - Pola umum yang terdeteksi
 */

import type { Recommendation, PasswordAnalysisResult } from '../types/analysis';

/** Daftar kata umum yang sangat sering digunakan dalam password */
const COMMON_WORDS = [
  'password', 'passwd', 'pass', 'admin', 'administrator',
  'root', 'user', 'login', 'qwerty', 'abc', 'letmein',
  'welcome', 'monkey', 'dragon', 'master', 'iloveyou',
  'sunshine', 'princess', 'superman', 'batman', 'football',
  'baseball', 'hockey', 'soccer', 'charlie', 'donald',
];

/** Pola urutan angka umum */
const SEQUENTIAL_DIGITS = ['0123', '1234', '2345', '3456', '4567', '5678', '6789', '7890'];

/** Pola urutan keyboard umum */
const KEYBOARD_SEQUENCES = [
  'qwerty', 'asdfgh', 'zxcvbn', 'qwert', 'asdf', 'zxcv',
  'yuiop', 'hjkl', 'qazwsx', 'edcrfv',
];

/**
 * Memeriksa apakah password mengandung karakter yang sama berulang.
 * Contoh: "aaaaaa", "111111"
 */
function hasRepeatingChars(password: string, threshold = 3): boolean {
  for (let i = 0; i <= password.length - threshold; i++) {
    const ch = password[i];
    let count = 1;
    while (i + count < password.length && password[i + count] === ch) {
      count++;
    }
    if (count >= threshold) return true;
  }
  return false;
}

/**
 * Memeriksa apakah password mengandung substring yang berulang.
 * Contoh: "abcabcabc"
 */
function hasRepeatingSubstring(password: string): boolean {
  const len = password.length;
  for (let subLen = 2; subLen <= Math.floor(len / 2); subLen++) {
    const sub = password.slice(0, subLen);
    const pattern = new RegExp(`(${sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}){2,}`, 'i');
    if (pattern.test(password)) return true;
  }
  return false;
}

/**
 * Memeriksa apakah password mengandung tahun empat digit di akhir.
 * Contoh: "Password2023", "informatika#2026"
 */
function hasYearAtEnd(password: string): boolean {
  return /\d{4}$/.test(password);
}

/**
 * Memeriksa apakah password hanya terdiri dari satu kategori karakter.
 */
function isSingleCategory(
  hasUppercase: boolean,
  hasLowercase: boolean,
  hasDigit: boolean,
  hasSymbol: boolean
): boolean {
  const categories = [hasUppercase, hasLowercase, hasDigit, hasSymbol].filter(Boolean);
  return categories.length === 1;
}

/**
 * Menghasilkan daftar rekomendasi berdasarkan hasil analisis password.
 */
export function generateRecommendations(
  result: Omit<PasswordAnalysisResult, 'recommendations'>
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const lower = result.password.toLowerCase();

  // === Rekomendasi berdasarkan panjang ===
  if (result.length < 12) {
    recommendations.push({
      id: 'rec-length-min',
      category: 'length',
      severity: 'high',
      title: 'Panjang Password Terlalu Pendek',
      description: `Password memiliki ${result.length} karakter. Tambahkan panjang hingga minimal 12 karakter untuk meningkatkan keamanan secara signifikan.`,
    });
  }

  if (result.entropy < 128 && result.charsetSize > 0) {
    const minLen = result.minLengthFor128Bits;
    recommendations.push({
      id: 'rec-length-entropy',
      category: 'length',
      severity: 'medium',
      title: 'Panjang untuk Entropy 128 Bit',
      description: `Dengan charset N = ${result.charsetSize}, password memerlukan minimal ${minLen} karakter untuk mencapai entropy teoretis 128 bit. Memperpanjang password lebih efektif daripada hanya mengganti satu karakter.`,
    });
  }

  // === Rekomendasi berdasarkan kategori karakter ===
  if (!result.charAnalysis.hasUppercase) {
    recommendations.push({
      id: 'rec-no-uppercase',
      category: 'charset',
      severity: 'medium',
      title: 'Tidak Ada Huruf Besar',
      description: 'Tambahkan minimal satu huruf besar (A–Z) untuk memperluas ruang charset dan meningkatkan entropy.',
    });
  }

  if (!result.charAnalysis.hasLowercase) {
    recommendations.push({
      id: 'rec-no-lowercase',
      category: 'charset',
      severity: 'medium',
      title: 'Tidak Ada Huruf Kecil',
      description: 'Tambahkan minimal satu huruf kecil (a–z) untuk meningkatkan keberagaman charset.',
    });
  }

  if (!result.charAnalysis.hasDigit) {
    recommendations.push({
      id: 'rec-no-digit',
      category: 'charset',
      severity: 'medium',
      title: 'Tidak Ada Angka',
      description: 'Sertakan minimal satu angka (0–9) untuk memperluas ruang kombinasi.',
    });
  }

  if (!result.charAnalysis.hasSymbol) {
    recommendations.push({
      id: 'rec-no-symbol',
      category: 'charset',
      severity: 'medium',
      title: 'Tidak Ada Simbol',
      description: `Tambahkan minimal satu simbol dari set: !@#$%^&*()-_=+[]{}|;:,.<>? untuk memperluas charset N sebesar 26 karakter.`,
    });
  }

  // === Rekomendasi berdasarkan GCD ===
  if (result.gcdAnalysis.gcdValue > 1) {
    recommendations.push({
      id: 'rec-gcd',
      category: 'gcd',
      severity: 'low',
      title: 'Struktur Aritmetika Terdeteksi (GCD > 1)',
      description: `GCD nilai ASCII = ${result.gcdAnalysis.gcdValue}. Coba variasikan karakter dari kategori berbeda agar nilai ASCII tidak seluruhnya memiliki faktor pembagi bersama. Ini merupakan indikator heuristik, bukan bukti mutlak kelemahan password.`,
    });
  }

  // === Rekomendasi berdasarkan modulo distribution ===
  if (result.moduloAnalysis.score < 70) {
    recommendations.push({
      id: 'rec-modulo',
      category: 'modulo',
      severity: 'low',
      title: 'Distribusi Modulo Menunjukkan Clustering',
      description: `Modulo Distribution Score = ${result.moduloAnalysis.score.toFixed(1)}. Gunakan variasi karakter dari kategori dan posisi yang lebih beragam untuk meningkatkan distribusi residue modulo.`,
    });
  }

  // === Rekomendasi berdasarkan entropy ===
  if (result.entropyScore < 50) {
    recommendations.push({
      id: 'rec-entropy-low',
      category: 'entropy',
      severity: 'high',
      title: 'Entropy Terlalu Rendah',
      description: `Entropy saat ini ${result.entropy.toFixed(1)} bit. Ruang kombinasi terlalu kecil. Memperpanjang password atau menambah variasi karakter akan meningkatkan entropy secara eksponensial.`,
    });
  }

  // === Deteksi pola umum ===
  if (hasRepeatingChars(lower)) {
    recommendations.push({
      id: 'rec-repeat-chars',
      category: 'pattern',
      severity: 'high',
      title: 'Karakter Berulang Terdeteksi',
      description: 'Password mengandung karakter yang sama berulang kali (misalnya "aaaaaa"). Ini sangat mengurangi ruang pencarian efektif.',
    });
  }

  if (SEQUENTIAL_DIGITS.some((seq) => lower.includes(seq))) {
    recommendations.push({
      id: 'rec-sequential-digits',
      category: 'pattern',
      severity: 'medium',
      title: 'Urutan Angka Berurutan',
      description: 'Password mengandung urutan angka berurutan (contoh: 1234, 5678). Pola seperti ini mudah ditebak oleh dictionary attack.',
    });
  }

  if (KEYBOARD_SEQUENCES.some((seq) => lower.includes(seq))) {
    recommendations.push({
      id: 'rec-keyboard-pattern',
      category: 'pattern',
      severity: 'medium',
      title: 'Pola Keyboard Terdeteksi',
      description: 'Password mengandung urutan keyboard umum (seperti "qwerty", "asdfgh"). Hindari pola keyboard yang mudah ditebak.',
    });
  }

  if (COMMON_WORDS.some((word) => lower.includes(word))) {
    recommendations.push({
      id: 'rec-common-word',
      category: 'pattern',
      severity: 'high',
      title: 'Kata Umum Terdeteksi',
      description: 'Password mengandung kata yang sangat umum digunakan (seperti "password", "admin", "qwerty"). Kata-kata ini selalu ada dalam daftar dictionary attack.',
    });
  }

  if (hasYearAtEnd(result.password)) {
    recommendations.push({
      id: 'rec-year-end',
      category: 'pattern',
      severity: 'low',
      title: 'Tahun di Akhir Password',
      description: 'Password diakhiri dengan 4 digit yang tampak seperti tahun. Pola ini umum dan mudah ditebak oleh penyerang.',
    });
  }

  if (isSingleCategory(
    result.charAnalysis.hasUppercase,
    result.charAnalysis.hasLowercase,
    result.charAnalysis.hasDigit,
    result.charAnalysis.hasSymbol
  )) {
    recommendations.push({
      id: 'rec-single-category',
      category: 'charset',
      severity: 'high',
      title: 'Hanya Satu Kategori Karakter',
      description: 'Password hanya menggunakan satu kategori karakter. Menggabungkan huruf besar, kecil, angka, dan simbol meningkatkan N secara signifikan.',
    });
  }

  if (hasRepeatingSubstring(lower) && result.length > 5) {
    recommendations.push({
      id: 'rec-repeat-substring',
      category: 'pattern',
      severity: 'medium',
      title: 'Pengulangan Substring Terdeteksi',
      description: 'Password mengandung pola berulang (misalnya "abcabcabc"). Pola berulang mengurangi entropi efektif password.',
    });
  }

  // === Saran umum jika password sudah relatif baik ===
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-passphrase',
      category: 'length',
      severity: 'low',
      title: 'Pertimbangkan Passphrase',
      description: 'Password Anda sudah memenuhi kriteria keamanan dasar. Untuk keamanan lebih tinggi, pertimbangkan menggunakan passphrase panjang (4+ kata acak yang tidak berhubungan) yang lebih mudah diingat namun sangat sulit ditebak.',
    });
  }

  return recommendations;
}
