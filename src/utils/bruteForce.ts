/**
 * utils/bruteForce.ts
 * Simulasi estimasi waktu brute force.
 *
 * Asumsi:
 *   Attack rate = 1.000.000.000 percobaan per detik (1 miliar/detik)
 *   Worst-case time = K / attack_rate
 *   Average-case time = K / (2 × attack_rate)
 *
 * Semua perhitungan menggunakan BigInt untuk menghindari overflow.
 */

import type { BruteForceResult, TimeBreakdown } from '../types/analysis';
import { bigIntToScientific } from './bigIntMath';

/** Kecepatan serangan brute force (percobaan per detik) */
export const ATTACK_RATE = 1_000_000_000n; // 10^9

/** Konstanta konversi waktu (dalam detik) */
const SECONDS_PER_MINUTE = 60n;
const SECONDS_PER_HOUR = 3_600n;
const SECONDS_PER_DAY = 86_400n;
const SECONDS_PER_YEAR = 31_536_000n;
const SECONDS_PER_MILLION_YEARS = 31_536_000_000_000n;
const SECONDS_PER_BILLION_YEARS = 31_536_000_000_000_000n;
const SECONDS_PER_TRILLION_YEARS = 31_536_000_000_000_000_000n;

/**
 * Mengkonversi jumlah detik (BigInt) ke berbagai satuan waktu
 * dan memilih representasi yang paling mudah dibaca.
 */
export function convertSecondsToTimeBreakdown(seconds: bigint): TimeBreakdown {
  const scientificNotation = bigIntToScientific(seconds);

  // Pilih satuan yang paling representatif
  let humanReadable: string;

  if (seconds === 0n) {
    humanReadable = 'Instan (< 1 detik)';
  } else if (seconds < SECONDS_PER_MINUTE) {
    humanReadable = `${seconds} detik`;
  } else if (seconds < SECONDS_PER_HOUR) {
    humanReadable = `${seconds / SECONDS_PER_MINUTE} menit`;
  } else if (seconds < SECONDS_PER_DAY) {
    humanReadable = `${seconds / SECONDS_PER_HOUR} jam`;
  } else if (seconds < SECONDS_PER_YEAR) {
    humanReadable = `${seconds / SECONDS_PER_DAY} hari`;
  } else if (seconds < SECONDS_PER_MILLION_YEARS) {
    humanReadable = `${seconds / SECONDS_PER_YEAR} tahun`;
  } else if (seconds < SECONDS_PER_BILLION_YEARS) {
    const mYears = seconds / SECONDS_PER_MILLION_YEARS;
    humanReadable = `${mYears} juta tahun`;
  } else if (seconds < SECONDS_PER_TRILLION_YEARS) {
    const bYears = seconds / SECONDS_PER_BILLION_YEARS;
    humanReadable = `${bYears} miliar tahun`;
  } else {
    const tYears = seconds / SECONDS_PER_TRILLION_YEARS;
    const tYearsStr = tYears.toString();
    if (tYearsStr.length > 15) {
      humanReadable = `${scientificNotation} detik (jauh melampaui usia alam semesta)`;
    } else {
      humanReadable = `${tYears} triliun tahun`;
    }
  }

  return {
    seconds,
    minutes: seconds / SECONDS_PER_MINUTE,
    hours: seconds / SECONDS_PER_HOUR,
    days: seconds / SECONDS_PER_DAY,
    years: seconds / SECONDS_PER_YEAR,
    millionYears: seconds / SECONDS_PER_MILLION_YEARS,
    billionYears: seconds / SECONDS_PER_BILLION_YEARS,
    trillionYears: seconds / SECONDS_PER_TRILLION_YEARS,
    scientificNotation,
    humanReadable,
  };
}

/**
 * Menghitung estimasi waktu brute force.
 *
 * @param combinationCount  Jumlah total kombinasi K = N^L (BigInt)
 * @returns BruteForceResult berisi estimasi worst-case dan average-case
 */
export function calculateBruteForce(combinationCount: bigint): BruteForceResult {
  if (combinationCount === 0n) {
    const emptyBreakdown = convertSecondsToTimeBreakdown(0n);
    return {
      attackRatePerSecond: ATTACK_RATE,
      worstCaseSeconds: 0n,
      averageCaseSeconds: 0n,
      timeBreakdown: emptyBreakdown,
    };
  }

  // Worst-case: penyerang harus mencoba seluruh ruang kombinasi
  const worstCaseSeconds = combinationCount / ATTACK_RATE;
  // Average-case: secara rata-rata separuh ruang kombinasi (informatif saja)
  const averageCaseSeconds = combinationCount / (2n * ATTACK_RATE);

  const timeBreakdown = convertSecondsToTimeBreakdown(worstCaseSeconds);

  return {
    attackRatePerSecond: ATTACK_RATE,
    worstCaseSeconds,
    averageCaseSeconds,
    timeBreakdown,
  };
}

/**
 * Memformat BigInt waktu ke string yang dapat dibaca.
 * Jika terlalu besar untuk ditampilkan langsung, gunakan notasi ilmiah.
 */
export function formatTimeSeconds(seconds: bigint): string {
  const str = seconds.toString();
  if (str.length > 20) {
    return bigIntToScientific(seconds) + ' detik';
  }
  return `${seconds.toLocaleString()} detik`;
}
