function Header(props) {
  return (
    <div className="text-center mb-4">
      <h2>{props.judul}</h2>
      <p className="text-muted">{props.subjudul}</p>
    </div>
  )
}

export default Header
