import { useState, useEffect } from 'react'
import Header from './components/Header'
import RingkasanBuku from './components/RingkasanBuku'
import FormTambahBuku from './components/FormTambahBuku'
import DaftarBuku from './components/DaftarBuku'

function App() {
  const [buku, setBuku] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function ambilDataBuku() {
    setLoading(true)
    setError(null)

    fetch('https://openlibrary.org/subjects/programming.json?limit=4')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Gagal mengambil data dari server')
        }
        return res.json()
      })
      .then((data) => {
        const daftarBaru = data.works.map((item, index) => {
          return {
            id: index + 1,
            judul: item.title,
            penulis: item.authors ? item.authors[0].name : 'Penulis Tidak Diketahui',
            tahun: item.first_publish_year || 2020,
            tersedia: true,
          }
        })
        setBuku(daftarBaru)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    ambilDataBuku()
  }, [])

  function handleTambahBuku(judul, penulis, tahun) {
    const bukuBaru = {
      id: Date.now(),
      judul: judul,
      penulis: penulis,
      tahun: Number(tahun),
      tersedia: true,
    }
    setBuku([...buku, bukuBaru])
  }

  const totalBuku = buku.length
  const totalTersedia = buku.filter((item) => item.tersedia === true).length
  const totalDipinjam = totalBuku - totalTersedia

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '700px' }}>
      <Header
        judul="Aplikasi Perpustakaan"
        subjudul="Kelola daftar buku perpustakaan kampus"
      />

      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Sedang memuat data buku...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center my-4" role="alert">
          <p className="mb-2">{error}</p>
          <button className="btn btn-outline-danger btn-sm" onClick={ambilDataBuku}>
            Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && (
        <div>
          <RingkasanBuku
            total={totalBuku}
            tersedia={totalTersedia}
            dipinjam={totalDipinjam}
          />
          <FormTambahBuku onTambah={handleTambahBuku} />
          <DaftarBuku daftar={buku} />
        </div>
      )}
    </div>
  )
}

export default App
