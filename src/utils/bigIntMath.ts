/**
 * utils/bigIntMath.ts
 * Operasi matematika berbasis BigInt untuk menghindari overflow presisi.
 *
 * JavaScript Number hanya memiliki presisi ~15 digit desimal (53-bit).
 * Untuk password panjang, nilai K = N^L dapat mencapai ratusan digit,
 * sehingga wajib menggunakan BigInt.
 */

/**
 * Menghitung N^L menggunakan BigInt dengan fast exponentiation (binary exponentiation).
 * Kompleksitas: O(log L)
 *
 * Algoritma:
 *   Jika L = 0, kembalikan 1.
 *   Jika L ganjil, kembalikan base × power(base, L-1).
 *   Jika L genap, gunakan squaring: power(base², L/2).
 */
export function bigIntPow(base: bigint, exp: bigint): bigint {
  if (exp === 0n) return 1n;
  if (exp === 1n) return base;

  let result = 1n;
  let b = base;
  let e = exp;

  while (e > 0n) {
    if (e % 2n === 1n) {
      // e ganjil: kalikan result dengan base saat ini
      result = result * b;
    }
    // Kuadratkan base dan bagi eksponen dengan 2
    b = b * b;
    e = e / 2n;
  }

  return result;
}

/**
 * Mengonversi BigInt ke notasi ilmiah tanpa kehilangan presisi.
 * Contoh: 12933699143209908517669873647616n → "1.293 × 10^31"
 *
 * Algoritma:
 *   1. Ubah BigInt ke string desimal.
 *   2. Hitung eksponen = panjang_string - 1.
 *   3. Ambil 4 digit pertama sebagai mantissa.
 *   4. Format sebagai "X.XXX × 10^n".
 */
export function bigIntToScientific(n: bigint): string {
  if (n === 0n) return '0';
  if (n < 0n) return `-${bigIntToScientific(-n)}`;

  const str = n.toString();
  const exponent = str.length - 1;

  if (exponent === 0) return str;

  // Ambil 4 digit pertama untuk mantissa (1 digit + 3 desimal)
  const mantissaDigits = str.slice(0, 4);
  const mantissa = `${mantissaDigits[0]}.${mantissaDigits.slice(1)}`;

  return `${mantissa} × 10^${exponent}`;
}

/**
 * Menghitung N^L mod p menggunakan modular exponentiation berbasis BigInt.
 * Digunakan untuk kode verifikasi K mod 97.
 *
 * Algoritma fast modular exponentiation:
 *   result = base^exp mod modulus
 * Menghindari perhitungan K yang sangat besar sebelum operasi modulo.
 */
export function bigIntModPow(base: bigint, exp: bigint, modulus: bigint): bigint {
  if (modulus === 1n) return 0n;

  let result = 1n;
  let b = base % modulus;
  let e = exp;

  while (e > 0n) {
    if (e % 2n === 1n) {
      result = (result * b) % modulus;
    }
    b = (b * b) % modulus;
    e = e / 2n;
  }

  return result;
}

/**
 * Mengformat BigInt besar menjadi string yang dapat dibaca manusia
 * dengan pemisah ribuan.
 * Contoh: 1234567890n → "1.234.567.890"
 */
export function formatBigIntWithSeparator(n: bigint): string {
  const str = n.toString();
  // Tambahkan pemisah titik setiap 3 digit dari kanan
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Menentukan apakah BigInt cukup kecil untuk ditampilkan secara lengkap
 * (tidak lebih dari 60 digit).
 */
export function isBigIntDisplayable(n: bigint): boolean {
  return n.toString().length <= 60;
}
