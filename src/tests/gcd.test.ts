/**
 * tests/gcd.test.ts
 * Unit test untuk fungsi GCD menggunakan algoritma Euclidean.
 */

import { describe, it, expect } from 'vitest';
import { gcd, gcdArray, calculateGcdScore } from '../utils/gcd';

describe('gcd — algoritma Euclidean', () => {
  it('gcd(73, 110) = 1', () => {
    expect(gcd(73, 110)).toBe(1);
  });

  it('gcd(6, 4) = 2', () => {
    expect(gcd(6, 4)).toBe(2);
  });

  it('gcd(97, 97) = 97', () => {
    expect(gcd(97, 97)).toBe(97);
  });

  it('gcd(0, 5) = 5', () => {
    expect(gcd(0, 5)).toBe(5);
  });

  it('gcd(5, 0) = 5', () => {
    expect(gcd(5, 0)).toBe(5);
  });

  it('gcd(100, 75) = 25', () => {
    expect(gcd(100, 75)).toBe(25);
  });

  it('gcd bersifat komutatif: gcd(a, b) = gcd(b, a)', () => {
    expect(gcd(48, 36)).toBe(gcd(36, 48));
  });

  it('gcd bilangan prima berbeda = 1', () => {
    expect(gcd(97, 89)).toBe(1);
  });
});

describe('gcdArray — GCD array bilangan', () => {
  it('gcdArray([97, 97, 97, 97]) = 97 (kasus "aaaa")', () => {
    // Karakter 'a' memiliki ASCII 97
    expect(gcdArray([97, 97, 97, 97])).toBe(97);
  });

  it('gcdArray([73, 110, 102, 111]) = 1 (kasus "Info")', () => {
    expect(gcdArray([73, 110, 102, 111])).toBe(1);
  });

  it('gcdArray([6, 4, 8]) = 2', () => {
    expect(gcdArray([6, 4, 8])).toBe(2);
  });

  it('gcdArray satu elemen', () => {
    expect(gcdArray([42])).toBe(42);
  });

  it('gcdArray array kosong = 0', () => {
    expect(gcdArray([])).toBe(0);
  });

  it('gcdArray ASCII password "Informatika#2026" = 1', () => {
    // I=73 n=110 f=102 o=111 r=114 m=109 a=97 t=116 i=105 k=107 a=97 #=35 2=50 0=48 2=50 6=54
    const asciiValues = [73, 110, 102, 111, 114, 109, 97, 116, 105, 107, 97, 35, 50, 48, 50, 54];
    expect(gcdArray(asciiValues)).toBe(1);
  });
});

describe('calculateGcdScore', () => {
  it('GCD = 1 → Score = 100', () => {
    expect(calculateGcdScore(1)).toBe(100);
  });

  it('GCD = 0 → Score = 100 (coprime edge case)', () => {
    // GCD = 0 tidak seharusnya terjadi, tetapi ≤ 1 mengembalikan 100
    expect(calculateGcdScore(0)).toBe(100);
  });

  it('GCD = 2 → Score = 100 - 25*log₂(2) = 75', () => {
    expect(calculateGcdScore(2)).toBeCloseTo(75, 1);
  });

  it('GCD = 4 → Score = 100 - 25*log₂(4) = 50', () => {
    expect(calculateGcdScore(4)).toBeCloseTo(50, 1);
  });

  it('GCD = 97 → Score > 0 (tidak negatif)', () => {
    expect(calculateGcdScore(97)).toBeGreaterThanOrEqual(0);
  });

  it('Score tidak pernah negatif', () => {
    expect(calculateGcdScore(1000)).toBeGreaterThanOrEqual(0);
  });
});
