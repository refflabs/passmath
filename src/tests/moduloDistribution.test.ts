/**
 * tests/moduloDistribution.test.ts
 * Unit test untuk analisis distribusi modulo.
 */

import { describe, it, expect } from 'vitest';
import { analyzeModuloDistribution, getBucketIndex, calculateBucketEntropy } from '../utils/moduloDistribution';

describe('getBucketIndex — pengelompokan residue ke bucket', () => {
  it('0 → bucket 0 (0–13)', () => {
    expect(getBucketIndex(0)).toBe(0);
  });

  it('13 → bucket 0 (0–13)', () => {
    expect(getBucketIndex(13)).toBe(0);
  });

  it('14 → bucket 1 (14–27)', () => {
    expect(getBucketIndex(14)).toBe(1);
  });

  it('96 → bucket 6 (84–96)', () => {
    expect(getBucketIndex(96)).toBe(6);
  });

  it('84 → bucket 6 (84–96)', () => {
    expect(getBucketIndex(84)).toBe(6);
  });

  it('55 → bucket 3 (42–55)', () => {
    expect(getBucketIndex(55)).toBe(3);
  });
});

describe('calculateBucketEntropy — Shannon entropy bucket', () => {
  it('semua data di satu bucket → entropy = 0', () => {
    expect(calculateBucketEntropy([4, 0, 0, 0, 0, 0, 0], 4)).toBe(0);
  });

  it('data tersebar merata di semua 7 bucket → entropy maksimal', () => {
    const counts = [1, 1, 1, 1, 1, 1, 1];
    const entropy = calculateBucketEntropy(counts, 7);
    // -7 × (1/7 × log₂(1/7)) = log₂(7) ≈ 2.807
    expect(entropy).toBeCloseTo(Math.log2(7), 3);
  });

  it('total = 0 → entropy = 0 (tidak ada NaN)', () => {
    expect(calculateBucketEntropy([0, 0, 0, 0, 0, 0, 0], 0)).toBe(0);
  });
});

describe('analyzeModuloDistribution — password "aaaa"', () => {
  it('password "aaaa": semua residue = 0 (97 mod 97 = 0)', () => {
    const result = analyzeModuloDistribution('aaaa');
    expect(result.residues.every((r) => r.residue === 0)).toBe(true);
  });

  it('password "aaaa": status clustering terdeteksi', () => {
    const result = analyzeModuloDistribution('aaaa');
    expect(result.status).toBe('Clustering Terdeteksi');
  });

  it('password "aaaa": unique residue ratio = 1/4', () => {
    const result = analyzeModuloDistribution('aaaa');
    expect(result.uniqueResidueRatio).toBeCloseTo(0.25, 5);
  });
});

describe('analyzeModuloDistribution — password "Informatika#2026"', () => {
  it('karakter pertama I: ASCII=73, residue=73', () => {
    const result = analyzeModuloDistribution('Informatika#2026');
    const firstChar = result.residues.find((r) => r.char === 'I' && r.position === 1);
    expect(firstChar?.residue).toBe(73);
  });

  it('karakter "a": ASCII=97, residue=0', () => {
    const result = analyzeModuloDistribution('Informatika#2026');
    const aChars = result.residues.filter((r) => r.char === 'a');
    aChars.forEach((r) => expect(r.residue).toBe(0));
  });

  it('karakter "#": ASCII=35, residue=35', () => {
    const result = analyzeModuloDistribution('Informatika#2026');
    const hashChar = result.residues.find((r) => r.char === '#');
    expect(hashChar?.residue).toBe(35);
  });

  it('Score berada di rentang 0–100', () => {
    const result = analyzeModuloDistribution('Informatika#2026');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

describe('analyzeModuloDistribution — edge cases', () => {
  it('password kosong → tidak ada NaN', () => {
    const result = analyzeModuloDistribution('');
    expect(Number.isNaN(result.score)).toBe(false);
    expect(result.score).toBe(0);
  });

  it('password satu karakter → tidak ada NaN', () => {
    const result = analyzeModuloDistribution('A');
    expect(Number.isNaN(result.score)).toBe(false);
  });
});
