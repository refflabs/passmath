/**
 * tests/combinatorics.test.ts
 * Unit test untuk kombinatorika berbasis BigInt.
 */

import { describe, it, expect } from 'vitest';
import { bigIntPow, bigIntToScientific, bigIntModPow } from '../utils/bigIntMath';

describe('bigIntPow — fast exponentiation', () => {
  it('N=88, L=16 → K=12933699143209908517669873647616n', () => {
    // Test case utama: Informatika#2026
    const result = bigIntPow(88n, 16n);
    expect(result).toBe(12933699143209908517669873647616n);
  });

  it('N=26, L=4 → K=456976 (kasus "aaaa")', () => {
    expect(bigIntPow(26n, 4n)).toBe(456976n);
  });

  it('N=36, L=6 → K=2176782336 (kasus "ABC123")', () => {
    expect(bigIntPow(36n, 6n)).toBe(2176782336n);
  });

  it('N^0 = 1 untuk semua N > 0', () => {
    expect(bigIntPow(88n, 0n)).toBe(1n);
    expect(bigIntPow(1n, 0n)).toBe(1n);
  });

  it('N^1 = N', () => {
    expect(bigIntPow(88n, 1n)).toBe(88n);
  });

  it('2^10 = 1024', () => {
    expect(bigIntPow(2n, 10n)).toBe(1024n);
  });

  it('10^20 = 100000000000000000000n', () => {
    expect(bigIntPow(10n, 20n)).toBe(100000000000000000000n);
  });
});

describe('bigIntToScientific — notasi ilmiah dari BigInt', () => {
  it('1293...n → "1.293 × 10^31"', () => {
    const result = bigIntToScientific(12933699143209908517669873647616n);
    expect(result).toBe('1.293 × 10^31');
  });

  it('0 → "0"', () => {
    expect(bigIntToScientific(0n)).toBe('0');
  });

  it('1 → "1" (tidak ada eksponen)', () => {
    expect(bigIntToScientific(1n)).toBe('1');
  });

  it('1000n → "1.000 × 10^3"', () => {
    expect(bigIntToScientific(1000n)).toBe('1.000 × 10^3');
  });

  it('12345n → "1.234 × 10^4"', () => {
    expect(bigIntToScientific(12345n)).toBe('1.234 × 10^4');
  });
});

describe('bigIntModPow — modular exponentiation', () => {
  it('88^16 mod 97 = 35 (kasus Informatika#2026)', () => {
    // Verifikasi kode verifikasi password utama
    expect(bigIntModPow(88n, 16n, 97n)).toBe(35n);
  });

  it('2^10 mod 97 = 1024 mod 97 = 54', () => {
    expect(bigIntModPow(2n, 10n, 97n)).toBe(54n);
    // Verifikasi: 1024 mod 97 = 1024 - 10×97 = 1024 - 970 = 54
    expect(1024n % 97n).toBe(54n);
  });

  it('N mod 1 = 0 untuk semua N', () => {
    expect(bigIntModPow(88n, 16n, 1n)).toBe(0n);
  });

  it('Konsisten dengan bigIntPow untuk nilai kecil', () => {
    const base = 5n;
    const exp = 3n;
    const mod = 97n;
    const directResult = bigIntPow(base, exp) % mod;
    const modPowResult = bigIntModPow(base, exp, mod);
    expect(modPowResult).toBe(directResult);
  });
});
