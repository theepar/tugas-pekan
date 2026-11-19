import { useState } from "react";

const currentYear = new Date().getFullYear();

function FormTambahBuku({ onTambah }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("Judul dan nama penulis tidak boleh hanya berisi spasi.");
      return;
    }
    onTambah(title.trim(), author.trim(), year, category);
  }
  return (
    <section className="data-panel form-panel">
      <div className="section-heading">
        <div>
          <h2>Informasi buku</h2>
          <p>Semua kolom wajib diisi.</p>
        </div>
        <span className="step-label">01 / KOLEKSI</span>
      </div>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="title" className="form-label">
            Judul buku
          </label>
          <input
            id="title"
            className="form-control"
            placeholder="Contoh: Clean Code"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            maxLength="150"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="form-label">
            Nama penulis
          </label>
          <input
            id="author"
            className="form-control"
            placeholder="Contoh: Robert C. Martin"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            required
            maxLength="120"
          />
        </div>
        <div className="row g-4">
          <div className="col-sm-6">
            <label htmlFor="year" className="form-label">
              Tahun terbit
            </label>
            <input
              id="year"
              type="number"
              className="form-control"
              placeholder="Contoh: 2024"
              min="1000"
              max={currentYear}
              value={year}
              onChange={(event) => setYear(event.target.value)}
              required
            />
          </div>
          <div className="col-sm-6">
            <label htmlFor="category" className="form-label">
              Kategori
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {[
                "Pemrograman",
                "Desain",
                "Fiksi",
                "Pengembangan diri",
                "Lainnya",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="form-hint">Buku baru akan ditandai sebagai tersedia.</p>
        <div className="form-actions">
          <a href="#katalog" className="btn btn-light">
            Batal
          </a>
          <button type="submit" className="btn btn-primary">
            Simpan buku
          </button>
        </div>
      </form>
    </section>
  );
}
export default FormTambahBuku;
