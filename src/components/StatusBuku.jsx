function StatusBuku({ tersedia }) {
  return (
    <span className={`book-status ${tersedia ? "available" : "borrowed"}`}>
      <span />
      {tersedia ? "Tersedia" : "Dipinjam"}
    </span>
  );
}
export default StatusBuku;
