# Sistem Analisis Keamanan Password
## Berbasis Kombinatorika, Entropy, dan Teori Bilangan — Metode Hybrid Scoring

> Proyek akademik Matematika Diskrit | React + Vite + TypeScript + Tailwind CSS

---

## 🔒 Privasi

**Password Anda tidak pernah meninggalkan browser.**
- Tidak ada request jaringan
- Tidak ada logging ke console
- Tidak ada penyimpanan ke localStorage atau sessionStorage
- Tidak ada analytics, API, atau database

---

## 🚀 Instalasi & Menjalankan

```bash
# Clone atau extract proyek
cd password-security-analyzer

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Jalankan unit tests
npm test
```

Buka browser di `http://localhost:5173`

---

## 📁 Struktur Proyek

```
src/
├── components/              # Komponen UI React
│   ├── PasswordInput.tsx       # Input password + validasi
│   ├── AnalysisSummary.tsx     # Ringkasan hasil
│   ├── SetTheoryCard.tsx       # Teori himpunan A∪B∪C∪D
│   ├── PropositionTable.tsx    # Logika proposisional P1–P5
│   ├── CombinatoricsCard.tsx   # Kombinatorika K=N^L
│   ├── EntropyCard.tsx         # Entropy H=L×log₂(N)
│   ├── AsciiTable.tsx          # Tabel nilai ASCII
│   ├── GcdAnalysisCard.tsx     # Algoritma GCD Euclidean
│   ├── ModuloDistributionChart.tsx  # Distribusi modulo
│   ├── ScoringCard.tsx         # Hybrid Scoring
│   ├── BruteForceCard.tsx      # Simulasi brute force
│   ├── DecisionTree.tsx        # Pohon keputusan
│   ├── RecommendationCard.tsx  # Rekomendasi perbaikan
│   └── DisclaimerCard.tsx      # Keterbatasan model
├── utils/                   # Fungsi matematika (dipisah dari UI)
│   ├── analyzePassword.ts      # Fungsi orkestrasi utama
│   ├── characterAnalysis.ts    # Teori himpunan charset
│   ├── bigIntMath.ts           # Fast exponentiation BigInt
│   ├── entropy.ts              # Entropy dan scoring
│   ├── gcd.ts                  # Algoritma Euclidean GCD
│   ├── moduloDistribution.ts   # Distribusi modulo + MDS
│   ├── scoring.ts              # Hybrid scoring
│   ├── bruteForce.ts           # Estimasi waktu brute force
│   ├── recommendations.ts      # Generator rekomendasi
│   └── formatting.ts           # Helper tampilan
├── types/
│   └── analysis.ts             # TypeScript interfaces
├── tests/                   # Unit tests (Vitest)
│   ├── gcd.test.ts
│   ├── combinatorics.test.ts
│   ├── moduloDistribution.test.ts
│   └── scoring.test.ts
├── App.tsx                  # Komponen utama
│   └── main.tsx             # Entry point
```

---

## 🧮 Fungsi Matematika Utama

### 1. Teori Himpunan
```
N = |A ∪ B ∪ C ∪ D|
  = 26·[A ada] + 26·[B ada] + 10·[C ada] + 26·[D ada]
```

### 2. Logika Proposisional
```
P1 ∧ P2 ∧ P3 ∧ P4 ∧ P5
```

### 3. Kombinatorika (BigInt)
```
K = N^L    (Rule of Product)
```

### 4. Entropy
```
H = L × log₂(N)    (bit)
ES = min(100, (H / 128) × 100)
```

### 5. GCD — Algoritma Euclidean
```
gcd(a, b): selama b ≠ 0: temp = b; b = a mod b; a = temp; return a
GCD Score = 100 jika GCD=1, else max(0, 100 - 25×log₂(GCD))
```

### 6. Distribusi Modulo
```
residue_i = ASCII(char_i) mod 97
MDS = 100 × ((0.5 × UR) + (0.5 × NormalizedHm))
```

### 7. Hybrid Scoring
```
RS = (GCD Score × 0.5) + (MDS × 0.5)
Final Score = (ES × 0.6) + (RS × 0.4)
```

---

## 🧪 Test Case

| Password | L | N | GCD | Status |
|---|---|---|---|---|
| `Informatika#2026` | 16 | 88 | 1 | Sangat Aman |
| `aaaa` | 4 | 26 | 97 | Tidak Aman |
| `ABC123` | 6 | 36 | — | Tidak Aman |
| `A1#a1#` | 6 | 88 | — | Kurang Aman |
| *(kosong)* | 0 | — | — | Error (null) |

---

## ⚠️ Keterbatasan Model

1. K = N^L mengasumsikan pemilihan karakter independen dan seragam
2. Entropy adalah entropy teoretis, bukan empiris
3. GCD bukan uji randomness kriptografis
4. Distribusi modulo bersifat heuristik pada password pendek
5. Tidak mempertimbangkan dictionary attack, kebocoran, atau social engineering
6. Dibuat untuk demonstrasi Matematika Diskrit, bukan audit keamanan profesional

---

## 🛠 Teknologi

- **React 19** + **TypeScript**
- **Vite 8** — development server & bundler
- **Tailwind CSS 3** — styling
- **Recharts** — tersedia untuk chart tambahan
- **Vitest** — unit testing
- **BigInt** — kalkulasi presisi penuh

---

*Proyek Akademik Matematika Diskrit — Semua analisis berjalan di sisi klien.*
