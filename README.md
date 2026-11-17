# Pustaka

Pustaka adalah aplikasi pengelolaan perpustakaan kampus dengan frontend React dan Bootstrap 5. Backend NestJS menyediakan API data mahasiswa yang terhubung ke PostgreSQL. Frontend menggunakan Axios untuk mengirim dan menerima data mahasiswa.

## Fitur

- Dashboard, katalog, dan form tambah buku dengan data contoh sementara.
- Halaman data mahasiswa dengan pencarian, tambah, edit, dan hapus data.
- Penyimpanan data mahasiswa dalam PostgreSQL.
- Validasi input, penanganan NIM/email duplikat, serta pesan gagal dan berhasil.
- Navigasi responsif untuk mobile dan desktop.

Data buku masih berupa demo dalam state React. Data mahasiswa disimpan dalam database dan tetap tersedia setelah halaman dimuat ulang.

## Teknologi

React 19, Bootstrap 5, Axios, Vite 8, NestJS 12, TypeScript, PostgreSQL 16, dan driver `pg`.

Bootstrap digunakan karena menyediakan grid responsif, tabel, serta form yang sesuai untuk halaman administrasi perpustakaan.

## Menjalankan Aplikasi

Gunakan Node.js 22.12 atau versi lebih baru yang kompatibel, serta Docker Engine dengan Docker Compose.

### Database

Pada Windows, jalankan Docker Engine melalui WSL Debian. Dari folder proyek di WSL:

```bash
docker compose -p pustaka up -d database
```

Database tersedia pada `127.0.0.1:5544`. Konfigurasi Compose dan kredensial contoh hanya digunakan untuk pengembangan lokal. Data disimpan dalam volume `pustaka_pustaka_data`. SQL awal dijalankan otomatis ketika volume pertama kali dibuat.

### Backend

Dari terminal di folder proyek:

```bash
npm ci --prefix backend
```

Salin `backend/.env.example` menjadi `backend/.env`, lalu jalankan:

```bash
npm run api:dev
```

API tersedia pada `http://127.0.0.1:3002/api/students`. Perubahan kode backend memerlukan restart `npm run api:dev` agar TypeScript dibangun ulang.

### Frontend

Buka terminal lain pada folder proyek:

```bash
npm ci
npm run dev
```

Buka alamat yang ditampilkan Vite, lalu pilih **Data mahasiswa**. Vite meneruskan request `/api` ke backend melalui proxy. Jika port 5173 sudah digunakan, Vite memilih port berikutnya.

## Endpoint API

| Metode | Endpoint            | Fungsi                      |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/students`     | Mengambil seluruh mahasiswa |
| GET    | `/api/students/:id` | Mengambil satu mahasiswa    |
| POST   | `/api/students`     | Menambahkan mahasiswa       |
| PUT    | `/api/students/:id` | Mengganti data mahasiswa    |
| DELETE | `/api/students/:id` | Menghapus mahasiswa         |

Penjelasan struktur module, controller, service, database, dan contoh request tersedia di [dokumentasi API](docs/API.md).

## Pemeriksaan dan Build

```bash
npm run lint
npm run api:build
npm run build
```

Untuk menguji API melalui Bruno, buka folder [koleksi Pustaka](docs/bruno). Jalankan request secara berurutan agar ID dari proses tambah dapat dipakai pada pengujian detail, edit, dan hapus. Data uji memakai NIM `103022499999` dan email `pustaka-test@example.com`.

## Dokumentasi Tampilan

| Halaman        | Desktop                                         | Mobile                                         |
| -------------- | ----------------------------------------------- | ---------------------------------------------- |
| Dashboard      | [Lihat](docs/screenshots/dashboard-desktop.png) | [Lihat](docs/screenshots/dashboard-mobile.png) |
| Katalog buku   | [Lihat](docs/screenshots/katalog-desktop.png)   | [Lihat](docs/screenshots/katalog-mobile.png)   |
| Tambah buku    | [Lihat](docs/screenshots/tambah-desktop.png)    | [Lihat](docs/screenshots/tambah-mobile.png)    |
| Data mahasiswa | [Lihat](docs/screenshots/mahasiswa-desktop.png) | [Lihat](docs/screenshots/mahasiswa-mobile.png) |

![Data mahasiswa Pustaka](docs/screenshots/mahasiswa-desktop.png)

Hasil pengujian API tersedia pada [ringkasan Bruno CLI](docs/screenshots/bruno-results.png) dan [detail response GET mahasiswa](docs/screenshots/bruno-requests.png).
