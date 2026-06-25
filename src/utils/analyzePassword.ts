/**
 * utils/analyzePassword.ts
 * Fungsi orkestrasi utama yang menjalankan seluruh analisis password.
 *
 * Urutan:
 * 1. Analisis karakter (teori himpunan)
 * 2. Proposisi logika
 * 3. Kombinatorika (BigInt)
 * 4. Entropy
 * 5. GCD
 * 6. Distribusi modulo
 * 7. Scoring (ES, GCD Score, RS, Final Score)
 * 8. Kode verifikasi
 * 9. Brute force
 * 10. Rekomendasi
 */

import type { PasswordAnalysisResult, PropositionResult } from '../types/analysis';
import { analyzeCharacters } from './characterAnalysis';
import { bigIntPow, bigIntToScientific, bigIntModPow } from './bigIntMath';
import { calculateEntropy, calculateEntropyScore, calculateMinLengthFor128Bits } from './entropy';
import { analyzeGcd } from './gcd';
import { analyzeModuloDistribution } from './moduloDistribution';
import { calculateRandomnessScore, calculateFinalScore, getSecurityStatus } from './scoring';
import { calculateBruteForce } from './bruteForce';
import { generateRecommendations } from './recommendations';

/** Batas maksimum panjang password yang dianalisis */
export const MAX_PASSWORD_LENGTH = 128;

/**
 * Mengevaluasi proposisi logika dari password.
 *
 * Proposisi:
 *   P1: panjang ≥ 12
 *   P2: ada huruf besar
 *   P3: ada huruf kecil
 *   P4: ada angka
 *   P5: ada simbol
 */
function evaluatePropositions(
  length: number,
  hasUppercase: boolean,
  hasLowercase: boolean,
  hasDigit: boolean,
  hasSymbol: boolean
): PropositionResult {
  const p1 = length >= 12;
  const p2 = hasUppercase;
  const p3 = hasLowercase;
  const p4 = hasDigit;
  const p5 = hasSymbol;

  return {
    p1,
    p2,
    p3,
    p4,
    p5,
    // P1 ∧ P2 ∧ P3 ∧ P4 ∧ P5
    allTrue: p1 && p2 && p3 && p4 && p5,
  };
}

/**
 * Fungsi utama analisis password.
 *
 * @param password  Password yang akan dianalisis (belum termasuk karakter tidak didukung)
 * @returns PasswordAnalysisResult | null jika password kosong atau charset = 0
 */
export function analyzePassword(password: string): PasswordAnalysisResult | null {
  // Validasi: password kosong
  if (!password || password.length === 0) return null;

  // Potong ke batas maksimum untuk menjaga responsivitas browser
  const pwd = password.slice(0, MAX_PASSWORD_LENGTH);
  const length = pwd.length;

  // === 1. Analisis karakter ===
  const charAnalysis = analyzeCharacters(pwd);
  const charsetSize = charAnalysis.charsetSize;

  // Jika charset nol (semua karakter tidak didukung), kembalikan null
  if (charsetSize === 0) return null;

  // === 2. Proposisi logika ===
  const propositions = evaluatePropositions(
    length,
    charAnalysis.hasUppercase,
    charAnalysis.hasLowercase,
    charAnalysis.hasDigit,
    charAnalysis.hasSymbol
  );

  // === 3. Kombinatorika: K = N^L ===
  // Menggunakan BigInt untuk menghindari overflow
  const combinationCount = bigIntPow(BigInt(charsetSize), BigInt(length));
  const combinationScientific = bigIntToScientific(combinationCount);

  // === 4. Entropy: H = L × log₂(N) ===
  const entropy = calculateEntropy(length, charsetSize);
  const entropyScore = calculateEntropyScore(entropy);
  const minLengthFor128Bits = calculateMinLengthFor128Bits(charsetSize);

  // === 5. Analisis GCD ===
  const gcdAnalysis = analyzeGcd(pwd);
  const gcdScore = gcdAnalysis.gcdScore;

  // === 6. Distribusi modulo ===
  const moduloAnalysis = analyzeModuloDistribution(pwd);

  // === 7. Scoring ===
  const randomnessScore = calculateRandomnessScore(gcdScore, moduloAnalysis.score);
  const finalScore = calculateFinalScore(entropyScore, randomnessScore);
  const securityStatus = getSecurityStatus(finalScore);

  // === 8. Kode verifikasi: K mod 97 ===
  // Menggunakan modular exponentiation untuk menghindari perhitungan K penuh
  const verificationCode = bigIntModPow(BigInt(charsetSize), BigInt(length), 97n);

  // === 9. Brute force ===
  const bruteForce = calculateBruteForce(combinationCount);

  // Buat objek hasil parsial untuk rekomendasi
  const partialResult: Omit<PasswordAnalysisResult, 'recommendations'> = {
    password: pwd,
    length,
    charAnalysis,
    charsetSize,
    combinationCount,
    combinationScientific,
    entropy,
    entropyStatus: '',  // akan diisi oleh komponen
    propositions,
    gcdAnalysis,
    moduloAnalysis,
    entropyScore,
    gcdScore,
    randomnessScore,
    finalScore,
    verificationCode,
    securityStatus,
    bruteForce,
    minLengthFor128Bits,
  };

  // === 10. Rekomendasi ===
  const recommendations = generateRecommendations(partialResult);

  return {
    ...partialResult,
    recommendations,
  };
}
