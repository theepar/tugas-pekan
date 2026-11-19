# Pustaka

Pustaka adalah aplikasi pengelolaan perpustakaan kampus dengan frontend React dan Bootstrap 5. Backend NestJS menyediakan REST API untuk data buku, dan seluruh data disimpan di PostgreSQL melalui Prisma ORM.

## Struktur Proyek

```
.
├── backend/       NestJS, Prisma, dan skema database
├── frontend/      React, Bootstrap, dan Vite
└── README.md
```

## Fitur

- Katalog buku dari database: pencarian, filter status, tambah buku, ubah status (pinjamkan/kembalikan), dan hapus.
- Dashboard dengan ringkasan koleksi: total buku, tersedia, dan dipinjam.
- Data tersimpan permanen di PostgreSQL dan tetap ada setelah server di-restart.
- Endpoint dengan query lanjutan: filter buku (`where`) dan statistik (`count`, `groupBy`).
- Validasi input serta pesan gagal dan berhasil.
- Navigasi responsif untuk mobile dan desktop.

## Teknologi

React 19, Bootstrap 5, React Icons, Axios, Vite 8, NestJS 12, TypeScript, PostgreSQL 16, dan Prisma ORM 6.

Bootstrap digunakan karena menyediakan grid responsif, tabel, serta form yang sesuai untuk halaman administrasi perpustakaan.

## Menjalankan Aplikasi

Gunakan Node.js 22.12 atau versi lebih baru yang kompatibel, serta server PostgreSQL.

### Database

Siapkan server PostgreSQL lokal, lalu atur `DATABASE_URL` di `backend/.env` (contoh ada di `backend/.env.example`). Prisma membuat database dan tabelnya lewat migrasi.

### Backend

```bash
cd backend
npm ci
```

Salin `.env.example` menjadi `.env`, lalu buat tabel dan isi data contoh:

```bash
npx prisma migrate dev
npx prisma db seed
```

Jalankan backend:

```bash
npm run dev
```

API tersedia pada `http://127.0.0.1:3002/api`. Perubahan kode backend memerlukan restart `npm run dev` agar TypeScript dibangun ulang.

### Frontend

Buka terminal lain:

```bash
cd frontend
npm ci
npm run dev
```

Buka alamat yang ditampilkan Vite. Vite meneruskan request `/api` ke backend melalui proxy. Jika port 5173 sudah digunakan, Vite memilih port berikutnya.

## Endpoint API

| Metode | Endpoint           | Fungsi                                                          |
| ------ | ------------------ | --------------------------------------------------------------- |
| GET    | `/api/books`       | Daftar buku. Filter opsional: `search`, `category`, `available` |
| GET    | `/api/books/stats` | Total, tersedia, dipinjam, dan jumlah per kategori              |
| GET    | `/api/books/:id`   | Satu buku                                                       |
| POST   | `/api/books`       | Menambahkan buku                                                |
| PUT    | `/api/books/:id`   | Mengganti data buku                                             |
| DELETE | `/api/books/:id`   | Menghapus buku                                                  |

Contoh filter: `GET /api/books?category=Pemrograman&available=true&search=clean`

Kode status: 400 untuk input tidak valid, 404 untuk buku tidak ditemukan, dan 503 jika database tidak dapat diakses.

## Prisma ORM

Backend memakai Prisma Client untuk membaca dan menulis data ke PostgreSQL.

| Bagian          | Lokasi                                                                          |
| --------------- | ------------------------------------------------------------------------------- |
| Model data      | [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) (model `Book`)   |
| Migrasi         | [`backend/prisma/migrations`](backend/prisma/migrations)                        |
| Data contoh     | [`backend/prisma/seed.js`](backend/prisma/seed.js)                              |
| Provider Prisma | [`backend/src/prisma`](backend/src/prisma) (`PrismaModule` dan `PrismaService`) |
| Service buku    | [`backend/src/books/books.service.ts`](backend/src/books/books.service.ts)      |

Model `Book` (tabel `books`): `id`, `title`, `author`, `year`, `category`, `available`, dan `createdAt`.

`PrismaService` (extends `PrismaClient`) diekspor oleh `PrismaModule`, diimpor oleh `BooksModule`, lalu disuntikkan ke `BooksService`. Controller hanya memanggil service, jadi controller tidak bergantung pada Prisma. Error Prisma diterjemahkan di [`run-query.ts`](backend/src/prisma/run-query.ts): `P2002` menjadi 409, `P2025` menjadi 404, dan kegagalan koneksi menjadi 503.

Perintah yang dipakai (dari folder `backend`):

```bash
npx prisma migrate dev --name init   # membuat database pustaka_prisma dan tabel books
npx prisma db seed                   # mengisi 6 buku contoh
npx prisma studio                    # melihat isi tabel di browser
```

## Pemeriksaan dan Build

```bash
cd frontend
npm run lint
npm run build

cd ../backend
npm run build
```
