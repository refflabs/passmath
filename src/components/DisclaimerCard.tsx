/**
 * components/DisclaimerCard.tsx
 * Section keterbatasan model — wajib ditampilkan.
 */

export default function DisclaimerCard() {
  const limitations = [
    {
      icon: '📐',
      title: 'Asumsi Independensi Karakter',
      detail: 'K = N^L mengasumsikan pemilihan karakter independen dan seragam dari seluruh charset. Password nyata sering kali tidak memenuhi asumsi ini.',
    },
    {
      icon: '🎲',
      title: 'Entropy Teoretis, Bukan Empiris',
      detail: 'Entropy yang dihitung adalah entropy teoritis ruang pencarian, bukan entropy aktual yang bergantung pada distribusi karakter yang sebenarnya dipilih.',
    },
    {
      icon: '🔢',
      title: 'GCD Bukan Uji Kriptografis',
      detail: 'GCD adalah indikator aritmetika sederhana. GCD = 1 tidak membuktikan bahwa password benar-benar acak secara kriptografis.',
    },
    {
      icon: '📊',
      title: 'Distribusi Modulo: Heuristik Saja',
      detail: 'Pada password pendek, distribusi modulo hanya bersifat heuristik dan tidak cukup sampel untuk pengujian statistik yang valid.',
    },
    {
      icon: '🔏',
      title: 'Kode Verifikasi Bukan Hash',
      detail: 'K mod 97 hanya memiliki 97 kemungkinan keluaran dan sangat rentan collision. Ini bukan pengganti fungsi hash kriptografis seperti SHA-256 atau bcrypt.',
    },
    {
      icon: '🌐',
      title: 'Tidak Mempertimbangkan Konteks Nyata',
      detail: 'Password yang kuat secara matematis masih dapat lemah jika: (a) merupakan kata dari kamus; (b) pernah bocor di database; (c) mengandung informasi pribadi; (d) pernah digunakan di banyak situs.',
    },
    {
      icon: '🎓',
      title: 'Tujuan Akademik',
      detail: 'Aplikasi ini dibuat untuk demonstrasi konsep Matematika Diskrit: teori himpunan, logika proposisional, kombinatorika, entropy, GCD, modulo, pohon keputusan, dan simulasi brute force. Ini bukan pengganti password manager atau audit keamanan profesional.',
    },
  ];

  return (
    <div className="card p-6 animate-slide-up">
      <div className="card-header">
        <div className="card-icon bg-gray-500/15 text-gray-400">
          <span aria-hidden="true" className="text-sm">📋</span>
        </div>
        <div>
          <h2 className="card-title">12. Catatan Keterbatasan Model</h2>
          <p className="text-xs text-gray-500 mt-0.5">Baca sebelum mengambil kesimpulan</p>
        </div>
      </div>

      <div className="note-box mb-5 text-xs">
        <p>
          Setiap metrik dalam sistem ini memiliki keterbatasan ilmiah.
          Hasil analisis harus dipahami sebagai <strong className="text-gray-300">indikator heuristik akademik</strong>,
          bukan sertifikasi keamanan.
        </p>
      </div>

      <div className="space-y-3">
        {limitations.map(({ icon, title, detail }, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-950/30 border border-white/3">
            <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-1">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 bg-blue-950/20 border border-blue-500/15 rounded-xl text-xs text-blue-300/70">
        <p className="font-medium text-blue-300 mb-1.5">🔒 Untuk Keamanan Nyata:</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Gunakan password manager (Bitwarden, 1Password, dll.)</li>
          <li>Aktifkan Two-Factor Authentication (2FA) di semua akun penting</li>
          <li>Gunakan password yang unik untuk setiap layanan</li>
          <li>Periksa apakah email/password Anda pernah bocor di <em>haveibeenpwned.com</em></li>
        </ul>
      </div>
    </div>
  );
}
