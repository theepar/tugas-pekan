function RingkasanBuku(props) {
  return (
    <div className="row text-center mb-4">
      <div className="col">
        <div className="card p-3">
          <h6>Total Buku</h6>
          <h3 className="m-0">{props.total}</h3>
        </div>
      </div>
      <div className="col">
        <div className="card p-3">
          <h6>Tersedia</h6>
          <h3 className="text-success m-0">{props.tersedia}</h3>
        </div>
      </div>
      <div className="col">
        <div className="card p-3">
          <h6>Dipinjam</h6>
          <h3 className="text-danger m-0">{props.dipinjam}</h3>
        </div>
      </div>
    </div>
  )
}

export default RingkasanBuku
