import StatusBuku from './StatusBuku'

function KartuBuku(props) {
  return (
    <div className="col-md-6 mb-3">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{props.judul}</h5>
          <p className="card-text text-muted mb-2">
            Penulis: {props.penulis}
            <br />
            Tahun: {props.tahun}
          </p>
          <StatusBuku tersedia={props.tersedia} />
        </div>
      </div>
    </div>
  )
}

export default KartuBuku
