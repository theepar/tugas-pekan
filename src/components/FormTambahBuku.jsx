import { useState } from 'react'

function FormTambahBuku(props) {
  const [judul, setJudul] = useState('')
  const [penulis, setPenulis] = useState('')
  const [tahun, setTahun] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (judul === '' || penulis === '' || tahun === '') {
      alert('Semua data buku harus diisi!')
      return
    }

    props.onTambah(judul, penulis, tahun)

    setJudul('')
    setPenulis('')
    setTahun('')
  }

  return (
    <div className="card p-3 mb-4">
      <h5 className="mb-3">Tambah Buku</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Judul Buku</label>
          <input
            type="text"
            className="form-control"
            placeholder="Masukkan judul buku"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Penulis</label>
          <input
            type="text"
            className="form-control"
            placeholder="Masukkan nama penulis"
            value={penulis}
            onChange={(e) => setPenulis(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tahun Terbit</label>
          <input
            type="number"
            className="form-control"
            placeholder="Contoh: 2024"
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Tambah
        </button>
      </form>
    </div>
  )
}

export default FormTambahBuku
