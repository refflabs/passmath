/**
 * types/analysis.ts
 * Definisi tipe data utama untuk hasil analisis password.
 */

/** Hasil analisis kategori karakter */
export interface CharacterCategoryResult {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  uppercaseCount: number;
  lowercaseCount: number;
  digitCount: number;
  symbolCount: number;
  charsetSize: number;
  /** Karakter yang tidak didukung oleh model charset */
  unsupportedChars: string[];
}

/** Proposisi logika */
export interface PropositionResult {
  p1: boolean; // panjang >= 12
  p2: boolean; // ada huruf besar
  p3: boolean; // ada huruf kecil
  p4: boolean; // ada angka
  p5: boolean; // ada simbol
  allTrue: boolean; // P1 ∧ P2 ∧ P3 ∧ P4 ∧ P5
}

/** Satu langkah komputasi GCD */
export interface GcdStep {
  a: number;
  b: number;
  result: number;
  description: string;
}

/** Hasil analisis GCD */
export interface GcdAnalysisResult {
  asciiValues: { char: string; ascii: number }[];
  steps: GcdStep[];
  gcdValue: number;
  isCoprime: boolean;
  gcdScore: number;
}

/** Hasil distribusi modulo */
export interface ModuloAnalysis {
  /** Sisa bagi ASCII mod 97 untuk setiap karakter */
  residues: { char: string; ascii: number; residue: number; position: number }[];
  uniqueResidueRatio: number;
  bucketCounts: number[];
  bucketEntropy: number;
  normalizedBucketEntropy: number;
  score: number;
  status: 'Relatif Tersebar' | 'Clustering Terdeteksi';
}

/** Hasil analisis brute force */
export interface BruteForceResult {
  attackRatePerSecond: bigint;
  worstCaseSeconds: bigint;
  averageCaseSeconds: bigint;
  timeBreakdown: TimeBreakdown;
}

/** Konversi waktu ke berbagai satuan */
export interface TimeBreakdown {
  seconds: bigint;
  minutes: bigint;
  hours: bigint;
  days: bigint;
  years: bigint;
  millionYears: bigint;
  billionYears: bigint;
  trillionYears: bigint;
  scientificNotation: string;
  humanReadable: string;
}

/** Status keamanan password */
export type SecurityStatus = 'Tidak Aman' | 'Kurang Aman' | 'Aman' | 'Sangat Aman';

/** Satu rekomendasi perbaikan */
export interface Recommendation {
  id: string;
  category: 'length' | 'charset' | 'gcd' | 'modulo' | 'entropy' | 'pattern';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

/** Hasil lengkap analisis password */
export interface PasswordAnalysisResult {
  password: string;
  length: number;
  charAnalysis: CharacterCategoryResult;
  charsetSize: number;
  combinationCount: bigint;
  combinationScientific: string;
  entropy: number;
  entropyStatus: string;
  propositions: PropositionResult;
  gcdAnalysis: GcdAnalysisResult;
  moduloAnalysis: ModuloAnalysis;
  entropyScore: number;
  gcdScore: number;
  randomnessScore: number;
  finalScore: number;
  verificationCode: bigint;
  securityStatus: SecurityStatus;
  bruteForce: BruteForceResult;
  recommendations: Recommendation[];
  minLengthFor128Bits: number;
}
