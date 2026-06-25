/**
 * utils/moduloDistribution.ts
 * Analisis distribusi modulo nilai ASCII password.
 *
 * Bilangan prima yang digunakan: p = 97
 * Residue = ASCII(karakter) mod 97
 *
 * Algoritma scoring distribusi:
 *   A. Unique Residue Ratio (UR) = jumlah_residu_unik / L
 *   B. Pembagian bucket (7 bucket): 0-13, 14-27, 28-41, 42-55, 56-69, 70-83, 84-96
 *   C. Shannon entropy bucket: Hm = -Σ(pi × log₂(pi))
 *   D. Normalisasi: NormalizedHm = Hm / log₂(min(7, L))
 *   E. MDS = 100 × ((0.5 × UR) + (0.5 × NormalizedHm))
 *
 * CATATAN ILMIAH:
 * Distribusi modulo pada password pendek hanya merupakan indikator heuristik.
 */

import type { ModuloAnalysis } from '../types/analysis';

/** Bilangan prima untuk operasi modulo */
export const MODULO_PRIME = 97;

/** Definisi 7 bucket untuk rentang 0–96 */
export const BUCKET_DEFINITIONS = [
  { label: '0–13', min: 0, max: 13 },
  { label: '14–27', min: 14, max: 27 },
  { label: '28–41', min: 28, max: 41 },
  { label: '42–55', min: 42, max: 55 },
  { label: '56–69', min: 56, max: 69 },
  { label: '70–83', min: 70, max: 83 },
  { label: '84–96', min: 84, max: 96 },
] as const;

/**
 * Menentukan nomor bucket (0-6) untuk nilai residue.
 * Bucket i mencakup nilai (i×14) hingga (i×14 + 13), kecuali bucket terakhir.
 */
export function getBucketIndex(residue: number): number {
  for (let i = 0; i < BUCKET_DEFINITIONS.length; i++) {
    if (residue >= BUCKET_DEFINITIONS[i].min && residue <= BUCKET_DEFINITIONS[i].max) {
      return i;
    }
  }
  // Fallback (tidak seharusnya terjadi untuk 0–96)
  return BUCKET_DEFINITIONS.length - 1;
}

/**
 * Menghitung Shannon entropy distribusi bucket.
 *
 * Rumus:
 *   Hm = -Σ(pi × log₂(pi))
 *
 * Bucket dengan jumlah nol diabaikan (tidak dimasukkan ke log₂).
 *
 * @param bucketCounts  Array jumlah data per bucket
 * @param total         Total data
 */
export function calculateBucketEntropy(bucketCounts: number[], total: number): number {
  if (total === 0) return 0;

  let entropy = 0;
  for (const count of bucketCounts) {
    if (count === 0) continue; // Lewati bucket kosong
    const p = count / total;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

/**
 * Menjalankan analisis distribusi modulo lengkap.
 *
 * @param password  Password yang dianalisis
 * @returns ModuloAnalysis dengan semua nilai dan skor
 */
export function analyzeModuloDistribution(password: string): ModuloAnalysis {
  const chars = [...password];
  const L = chars.length;

  if (L === 0) {
    return {
      residues: [],
      uniqueResidueRatio: 0,
      bucketCounts: new Array(7).fill(0),
      bucketEntropy: 0,
      normalizedBucketEntropy: 0,
      score: 0,
      status: 'Clustering Terdeteksi',
    };
  }

  // Hitung residue untuk setiap karakter
  const residues = chars.map((ch, index) => {
    const ascii = ch.charCodeAt(0);
    const residue = ascii % MODULO_PRIME;
    return { char: ch, ascii, residue, position: index + 1 };
  });

  // === A. Unique Residue Ratio ===
  const uniqueResidues = new Set(residues.map((r) => r.residue));
  const uniqueResidueRatio = uniqueResidues.size / L;

  // === B. Hitung jumlah data per bucket ===
  const bucketCounts = new Array(7).fill(0) as number[];
  for (const { residue } of residues) {
    const bucketIdx = getBucketIndex(residue);
    bucketCounts[bucketIdx]++;
  }

  // === C. Shannon entropy bucket ===
  const bucketEntropy = calculateBucketEntropy(bucketCounts, L);

  // === D. Normalisasi entropy ===
  // HmMax = log₂(min(7, L))
  // Jika L <= 1, HmMax = 0 → tangani pembagian nol
  const effectiveBuckets = Math.min(7, L);
  const hmMax = effectiveBuckets > 1 ? Math.log2(effectiveBuckets) : 0;
  const normalizedBucketEntropy = hmMax > 0 ? Math.min(1, bucketEntropy / hmMax) : 0;

  // === E. Modulo Distribution Score ===
  // MDS = 100 × ((0.5 × UR) + (0.5 × NormalizedHm))
  const rawScore = 100 * (0.5 * uniqueResidueRatio + 0.5 * normalizedBucketEntropy);
  // Batasi pada rentang 0–100
  const score = Math.max(0, Math.min(100, rawScore));

  const status: ModuloAnalysis['status'] =
    score >= 70 ? 'Relatif Tersebar' : 'Clustering Terdeteksi';

  return {
    residues,
    uniqueResidueRatio,
    bucketCounts,
    bucketEntropy,
    normalizedBucketEntropy,
    score,
    status,
  };
}
