/**
 * tests/scoring.test.ts
 * Unit test untuk sistem scoring hybrid.
 */

import { describe, it, expect } from 'vitest';
import { calculateRandomnessScore, calculateFinalScore, getSecurityStatus } from '../utils/scoring';
import { calculateEntropyScore } from '../utils/entropy';
import { analyzePassword } from '../utils/analyzePassword';

describe('calculateEntropyScore', () => {
  it('H = 0 → ES = 0', () => {
    expect(calculateEntropyScore(0)).toBe(0);
  });

  it('H = 64 → ES = 50', () => {
    expect(calculateEntropyScore(64)).toBeCloseTo(50, 1);
  });

  it('H = 128 → ES = 100', () => {
    expect(calculateEntropyScore(128)).toBeCloseTo(100, 1);
  });

  it('H > 128 → ES = 100 (dibatasi)', () => {
    expect(calculateEntropyScore(200)).toBe(100);
  });
});

describe('calculateRandomnessScore', () => {
  it('GCD Score=100, Modulo=100 → RS=100', () => {
    expect(calculateRandomnessScore(100, 100)).toBe(100);
  });

  it('GCD Score=50, Modulo=50 → RS=50', () => {
    expect(calculateRandomnessScore(50, 50)).toBe(50);
  });

  it('GCD Score=100, Modulo=0 → RS=50', () => {
    expect(calculateRandomnessScore(100, 0)).toBe(50);
  });
});

describe('calculateFinalScore', () => {
  it('ES=100, RS=100 → Final=100', () => {
    expect(calculateFinalScore(100, 100)).toBeCloseTo(100, 1);
  });

  it('ES=0, RS=0 → Final=0', () => {
    expect(calculateFinalScore(0, 0)).toBe(0);
  });

  it('Bobot: ES=60%, RS=40%', () => {
    // ES=80, RS=60 → 80×0.6 + 60×0.4 = 48 + 24 = 72
    expect(calculateFinalScore(80, 60)).toBeCloseTo(72, 1);
  });
});

describe('getSecurityStatus', () => {
  it('score = 0 → Tidak Aman', () => {
    expect(getSecurityStatus(0)).toBe('Tidak Aman');
  });

  it('score = 39.9 → Tidak Aman', () => {
    expect(getSecurityStatus(39.9)).toBe('Tidak Aman');
  });

  it('score = 40 → Kurang Aman', () => {
    expect(getSecurityStatus(40)).toBe('Kurang Aman');
  });

  it('score = 59.9 → Kurang Aman', () => {
    expect(getSecurityStatus(59.9)).toBe('Kurang Aman');
  });

  it('score = 60 → Aman', () => {
    expect(getSecurityStatus(60)).toBe('Aman');
  });

  it('score = 79.9 → Aman', () => {
    expect(getSecurityStatus(79.9)).toBe('Aman');
  });

  it('score = 80 → Sangat Aman', () => {
    expect(getSecurityStatus(80)).toBe('Sangat Aman');
  });

  it('score = 100 → Sangat Aman', () => {
    expect(getSecurityStatus(100)).toBe('Sangat Aman');
  });
});

describe('analyzePassword — test case utama', () => {
  it('Informatika#2026: N=88, L=16', () => {
    const result = analyzePassword('Informatika#2026');
    expect(result).not.toBeNull();
    expect(result!.charsetSize).toBe(88);
    expect(result!.length).toBe(16);
  });

  it('Informatika#2026: K = 88^16', () => {
    const result = analyzePassword('Informatika#2026');
    expect(result!.combinationCount).toBe(12933699143209908517669873647616n);
  });

  it('Informatika#2026: entropy ≈ 103.4 bit', () => {
    const result = analyzePassword('Informatika#2026');
    expect(result!.entropy).toBeCloseTo(103.4, 0);
  });

  it('Informatika#2026: GCD = 1 (coprime)', () => {
    const result = analyzePassword('Informatika#2026');
    expect(result!.gcdAnalysis.gcdValue).toBe(1);
    expect(result!.gcdAnalysis.isCoprime).toBe(true);
  });

  it('Informatika#2026: K mod 97 = 35', () => {
    const result = analyzePassword('Informatika#2026');
    expect(result!.verificationCode).toBe(35n);
  });

  it('Informatika#2026: status = Sangat Aman', () => {
    const result = analyzePassword('Informatika#2026');
    expect(result!.securityStatus).toBe('Sangat Aman');
  });

  it('Informatika#2026: Final Score ≈ 84.2 (toleransi ±2)', () => {
    const result = analyzePassword('Informatika#2026');
    expect(result!.finalScore).toBeGreaterThan(82);
    expect(result!.finalScore).toBeLessThan(88);
  });
});

describe('analyzePassword — kasus "aaaa"', () => {
  it('"aaaa": L=4, N=26 (hanya huruf kecil)', () => {
    const result = analyzePassword('aaaa');
    expect(result!.length).toBe(4);
    expect(result!.charsetSize).toBe(26);
  });

  it('"aaaa": GCD = 97 (semua ASCII = 97)', () => {
    const result = analyzePassword('aaaa');
    expect(result!.gcdAnalysis.gcdValue).toBe(97);
  });

  it('"aaaa": semua residue = 0', () => {
    const result = analyzePassword('aaaa');
    expect(result!.moduloAnalysis.residues.every((r) => r.residue === 0)).toBe(true);
  });

  it('"aaaa": Final Score rendah (< 40)', () => {
    const result = analyzePassword('aaaa');
    expect(result!.finalScore).toBeLessThan(40);
  });

  it('"aaaa": status = Tidak Aman', () => {
    const result = analyzePassword('aaaa');
    expect(result!.securityStatus).toBe('Tidak Aman');
  });
});

describe('analyzePassword — kasus "ABC123"', () => {
  it('"ABC123": huruf besar dan angka aktif, N=36', () => {
    const result = analyzePassword('ABC123');
    expect(result!.charAnalysis.hasUppercase).toBe(true);
    expect(result!.charAnalysis.hasLowercase).toBe(false);
    expect(result!.charAnalysis.hasDigit).toBe(true);
    expect(result!.charAnalysis.hasSymbol).toBe(false);
    expect(result!.charsetSize).toBe(36);
  });

  it('"ABC123": P3 (huruf kecil) dan P5 (simbol) = FALSE', () => {
    const result = analyzePassword('ABC123');
    expect(result!.propositions.p3).toBe(false);
    expect(result!.propositions.p5).toBe(false);
  });
});

describe('analyzePassword — kasus "A1#a1#"', () => {
  it('"A1#a1#": semua kategori aktif, N=88', () => {
    const result = analyzePassword('A1#a1#');
    expect(result!.charAnalysis.hasUppercase).toBe(true);
    expect(result!.charAnalysis.hasLowercase).toBe(true);
    expect(result!.charAnalysis.hasDigit).toBe(true);
    expect(result!.charAnalysis.hasSymbol).toBe(true);
    expect(result!.charsetSize).toBe(88);
  });

  it('"A1#a1#": kombinatorika BigInt berjalan tanpa error', () => {
    const result = analyzePassword('A1#a1#');
    expect(typeof result!.combinationCount).toBe('bigint');
    expect(result!.combinationCount).toBeGreaterThan(0n);
  });
});

describe('analyzePassword — kasus password kosong', () => {
  it('password kosong → null (tidak ada crash)', () => {
    const result = analyzePassword('');
    expect(result).toBeNull();
  });

  it('null input → null (tidak ada crash)', () => {
    // @ts-expect-error - testing null input
    const result = analyzePassword(null);
    expect(result).toBeNull();
  });
});
