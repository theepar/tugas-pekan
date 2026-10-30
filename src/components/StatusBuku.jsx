function StatusBuku(props) {
  if (props.tersedia === true) {
    return <span className="badge bg-success">Tersedia</span>
  } else {
    return <span className="badge bg-secondary">Dipinjam</span>
  }
}

export default StatusBuku
