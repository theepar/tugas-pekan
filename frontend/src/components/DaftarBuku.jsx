import KartuBuku from './KartuBuku'

function DaftarBuku(props) {
  if (props.daftar.length === 0) {
    return <p className="text-center text-muted my-4">Belum ada data buku</p>
  }

  return (
    <div>
      <h5 className="mb-3">Daftar Buku</h5>
      <div className="row">
        {props.daftar.map((item) => (
          <KartuBuku
            key={item.id}
            judul={item.judul}
            penulis={item.penulis}
            tahun={item.tahun}
            tersedia={item.tersedia}
          />
        ))}
      </div>
    </div>
  )
}

export default DaftarBuku
