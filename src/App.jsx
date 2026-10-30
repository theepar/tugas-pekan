import { useState } from 'react'
import Header from './components/Header'
import RingkasanBuku from './components/RingkasanBuku'
import DaftarBuku from './components/DaftarBuku'

function App() {
  const [buku] = useState([
    { id: 1, judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', tahun: 2005, tersedia: true },
    { id: 2, judul: 'Bumi Manusia', penulis: 'Pramoedya Ananta Toer', tahun: 1980, tersedia: false },
    { id: 3, judul: 'Clean Code', penulis: 'Robert C. Martin', tahun: 2008, tersedia: true },
    { id: 4, judul: 'Filosofi Teras', penulis: 'Henry Manampiring', tahun: 2018, tersedia: true },
  ])

  const totalBuku = buku.length
  const totalTersedia = buku.filter((item) => item.tersedia === true).length
  const totalDipinjam = totalBuku - totalTersedia

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '700px' }}>
      <Header
        judul="Aplikasi Perpustakaan"
        subjudul="Kelola daftar buku perpustakaan kampus"
      />

      <RingkasanBuku
        total={totalBuku}
        tersedia={totalTersedia}
        dipinjam={totalDipinjam}
      />

      <DaftarBuku daftar={buku} />
    </div>
  )
}

export default App
