# Pustaka

Pustaka adalah aplikasi pengelolaan koleksi perpustakaan kampus yang dibangun menggunakan React, Vite, dan Bootstrap 5. Versi ini merupakan frontend skeleton dengan data contoh yang disimpan sementara dalam state React.

## Fitur

- Dashboard dengan ringkasan koleksi, ketersediaan buku, dan daftar koleksi terbaru.
- Katalog buku dengan pencarian judul atau penulis serta filter status.
- Form penambahan buku dengan validasi judul, penulis, tahun terbit, dan kategori.
- Sidebar pada desktop dan menu navigasi responsif pada mobile.

Aplikasi belum terhubung ke backend atau database. Data yang ditambahkan akan kembali ke kondisi awal setelah halaman dimuat ulang.

## Teknologi

- React 19
- Vite 8
- Bootstrap 5

Bootstrap dipilih karena menyediakan komponen tabel, form, tombol, dan grid responsif yang sesuai untuk aplikasi administrasi perpustakaan. Layout menggunakan `container-fluid`, `row`, dan kelas kolom responsif untuk menyesuaikan susunan konten pada mobile dan desktop.

## Menjalankan Aplikasi

Gunakan Node.js 22.12 atau versi lebih baru yang kompatibel dengan Vite 8.

```bash
npm ci
npm run dev
```

Buka alamat lokal yang ditampilkan pada terminal.

## Pemeriksaan dan Build

```bash
npm run lint
npm run build
npm run preview
```

## Dokumentasi Tampilan

Screenshot diambil pada desktop dengan viewport 1440 × 1000, mobile 375 × 812, dan tablet 768 × 1024. Gambar menggunakan mode full page sehingga tinggi screenshot mengikuti panjang konten halaman.

| Halaman      | Desktop                                         | Mobile                                         | Tablet                                         |
| ------------ | ----------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Dashboard    | [Lihat](docs/screenshots/dashboard-desktop.png) | [Lihat](docs/screenshots/dashboard-mobile.png) | [Lihat](docs/screenshots/dashboard-tablet.png) |
| Katalog buku | [Lihat](docs/screenshots/katalog-desktop.png)   | [Lihat](docs/screenshots/katalog-mobile.png)   | [Lihat](docs/screenshots/katalog-tablet.png)   |
| Tambah buku  | [Lihat](docs/screenshots/tambah-desktop.png)    | [Lihat](docs/screenshots/tambah-mobile.png)    | [Lihat](docs/screenshots/tambah-tablet.png)    |

Dokumentasi interaksi mencakup [navigasi mobile](docs/screenshots/navigasi-mobile.png), [pengisian form](docs/screenshots/form-terisi-mobile.png), dan [hasil penambahan buku](docs/screenshots/tambah-berhasil-mobile.png).

![Dashboard Pustaka pada desktop](docs/screenshots/dashboard-desktop.png)
