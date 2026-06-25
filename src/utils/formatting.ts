/**
 * utils/formatting.ts
 * Fungsi pemformatan tampilan (hanya untuk display, bukan kalkulasi).
 */

/**
 * Membulatkan angka ke n angka desimal untuk tampilan.
 * Seluruh pembulatan dilakukan hanya pada layer tampilan.
 */
export function toFixed(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}

/**
 * Menyembunyikan password dengan mengganti setiap karakter dengan '•'.
 */
export function maskPassword(password: string): string {
  return '•'.repeat(password.length);
}

/**
 * Memformat persentase untuk tampilan progress bar.
 */
export function toPercent(value: number, max = 100): number {
  return Math.max(0, Math.min(100, (value / max) * 100));
}

/**
 * Menghasilkan label status dari nilai boolean.
 */
export function boolLabel(value: boolean): string {
  return value ? 'TRUE' : 'FALSE';
}

/**
 * Mengubah angka ke format string dengan pemisah ribuan menggunakan locale Indonesia.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('id-ID');
}

/**
 * Memotong string BigInt agar layak ditampilkan.
 * Tampilkan 20 digit pertama + "..." jika terlalu panjang.
 */
export function truncateBigIntString(str: string, maxLen = 30): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + `... (${str.length} digit total)`;
}

/**
 * Menghasilkan warna teks Tailwind berdasarkan nilai boolean proposisi.
 */
export function propositionColor(value: boolean): string {
  return value ? 'text-green-400' : 'text-red-400';
}

/**
 * Menghasilkan warna background badge berdasarkan severity rekomendasi.
 */
export function severityBadgeColor(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high':
      return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'medium':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'low':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
  }
}

/**
 * Menghasilkan label tingkat keparahan rekomendasi.
 */
export function severityLabel(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high': return 'Kritis';
    case 'medium': return 'Sedang';
    case 'low': return 'Rendah';
  }
}
