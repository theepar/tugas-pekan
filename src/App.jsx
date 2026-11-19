import { useEffect, useState } from "react";
import FormTambahBuku from "./components/FormTambahBuku";
import StatusBuku from "./components/StatusBuku";
import StudentsPage from "./components/StudentsPage";
import { apiError, booksApi } from "./services/api";

// Bentuk data dari API (title, author, ...) diubah ke bentuk yang dipakai tampilan.
const toUi = (book) => ({
  id: book.id,
  judul: book.title,
  penulis: book.author,
  tahun: book.year,
  kategori: book.category,
  tersedia: book.available,
});

const pages = {
  dashboard: "Dashboard",
  katalog: "Katalog buku",
  tambah: "Tambah buku",
  mahasiswa: "Data mahasiswa",
};
const getPage = () =>
  Object.hasOwn(pages, location.hash.slice(1))
    ? location.hash.slice(1)
    : "dashboard";

function Icon({ name }) {
  const paths = {
    book: (
      <>
        <path d="M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z" />
        <path d="M12 5v15" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 6 6" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function App() {
  const [page, setPage] = useState(getPage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const onHashChange = () => {
      setPage(getPage());
      setMenuOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  async function loadBooks(signal) {
    setLoading(true);
    setLoadError("");
    try {
      const data = await booksApi.list(signal);
      setBooks(data.map(toUi));
    } catch (error) {
      if (!signal?.aborted) setLoadError(apiError(error));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    booksApi
      .list(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setBooks(data.map(toUi));
      })
      .catch((error) => {
        if (!controller.signal.aborted) setLoadError(apiError(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    document.title = `${pages[page]} · Pustaka`;
  }, [page]);
  const available = books.filter((book) => book.tersedia).length;
  const filtered = books.filter(
    (book) =>
      `${book.judul} ${book.penulis}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (status === "all" || book.tersedia === (status === "available")),
  );
  async function addBook(judul, penulis, tahun, kategori) {
    setActionError("");
    try {
      const created = await booksApi.create({
        title: judul,
        author: penulis,
        year: Number(tahun),
        category: kategori,
      });
      setBooks((current) => [...current, toUi(created)]);
      setQuery("");
      setStatus("all");
      setNotice(`Buku “${judul}” berhasil disimpan ke database.`);
      location.hash = "katalog";
    } catch (error) {
      setActionError(apiError(error));
    }
  }
  async function toggleBook(book) {
    setActionError("");
    try {
      const updated = await booksApi.update(book.id, {
        title: book.judul,
        author: book.penulis,
        year: book.tahun,
        category: book.kategori,
        available: !book.tersedia,
      });
      setBooks((current) =>
        current.map((item) => (item.id === updated.id ? toUi(updated) : item)),
      );
    } catch (error) {
      setActionError(apiError(error));
    }
  }
  async function removeBook(book) {
    if (!window.confirm(`Hapus buku “${book.judul}”?`)) return;
    setActionError("");
    try {
      await booksApi.remove(book.id);
      setBooks((current) => current.filter((item) => item.id !== book.id));
      setNotice(`Buku “${book.judul}” dihapus dari database.`);
    } catch (error) {
      setActionError(apiError(error));
    }
  }
  function bookTable(list, withActions = false) {
    if (loading) return <p className="empty-state">Memuat data buku...</p>;
    if (loadError)
      return (
        <div className="alert alert-danger m-3" role="alert">
          {loadError}{" "}
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={() => loadBooks()}
          >
            Coba lagi
          </button>
        </div>
      );
    return (
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <caption className="visually-hidden">
            Daftar koleksi buku perpustakaan
          </caption>
          <thead>
            <tr>
              <th scope="col">Judul buku</th>
              <th scope="col">Kategori</th>
              <th scope="col">Tahun</th>
              <th scope="col">Status</th>
              {withActions && <th scope="col">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {list.map((book) => (
              <tr key={book.id}>
                <td>
                  <div className="book-cell">
                    <span className={`book-thumb tone-${book.id % 3}`}>
                      <Icon name="book" />
                    </span>
                    <div>
                      <strong>{book.judul}</strong>
                      <small>{book.penulis}</small>
                    </div>
                  </div>
                </td>
                <td>{book.kategori}</td>
                <td>{book.tahun}</td>
                <td>
                  <StatusBuku tersedia={book.tersedia} />
                </td>
                {withActions && (
                  <td className="text-nowrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-light me-2"
                      onClick={() => toggleBook(book)}
                    >
                      {book.tersedia ? "Pinjamkan" : "Kembalikan"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeBook(book)}
                    >
                      Hapus
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <p className="empty-state">
            Tidak ada buku yang cocok. Coba kata kunci atau status lain.
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content").focus();
        }}
      >
        Lewati ke konten
      </a>
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Tutup navigasi"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${menuOpen ? "is-open" : ""}`}
        id="main-navigation"
      >
        <a href="#dashboard" className="brand">
          <span className="brand-mark">
            <Icon name="book" />
          </span>
          Pustaka<span className="brand-dot">.</span>
        </a>
        <div className="workspace-label">RUANG KELOLA</div>
        <nav aria-label="Navigasi utama">
          {Object.entries(pages).map(([key, label]) => (
            <a
              key={key}
              href={`#${key}`}
              className={`nav-item ${page === key ? "selected" : ""}`}
              aria-current={page === key ? "page" : undefined}
            >
              <Icon
                name={
                  {
                    dashboard: "grid",
                    katalog: "book",
                    tambah: "plus",
                    mahasiswa: "grid",
                  }[key]
                }
              />
              {label}
              {key === "katalog" && (
                <span className="nav-count">{books.length}</span>
              )}
            </a>
          ))}
        </nav>
        <div className="sidebar-note">
          <Icon name="book" />
          <strong>Ruang untuk pengetahuan.</strong>
          <p>Kelola koleksi hari ini, buka lebih banyak cerita esok hari.</p>
        </div>
        <div className="sidebar-profile">
          <span className="avatar">AP</span>
          <div>
            <strong>Admin Perpustakaan</strong>
            <small>Perpustakaan kampus</small>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="menu-toggle btn"
              aria-label={
                menuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
              }
              aria-controls="main-navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name="menu" />
            </button>
            <span className="breadcrumb-label">
              Ruang kelola <span>/</span> <strong>{pages[page]}</strong>
            </span>
          </div>
          <span className="demo-label">
            <span />
            {page === "mahasiswa" ? "Data mahasiswa" : "Data buku"}
          </span>
        </header>
        <main
          id="main-content"
          className="container-fluid content"
          tabIndex="-1"
        >
          <div className="page-heading">
            <div>
              <p className="eyebrow">PERPUSTAKAAN KAMPUS</p>
              <h1>
                {page === "dashboard"
                  ? "Setiap buku, sebuah peluang."
                  : pages[page]}
              </h1>
              <p className="page-description">
                {page === "dashboard"
                  ? "Selamat datang kembali. Ini ringkasan koleksi perpustakaan Anda."
                  : page === "katalog"
                    ? "Temukan dan pantau seluruh koleksi dalam satu tempat."
                    : page === "mahasiswa"
                      ? "Kelola data mahasiswa dan anggota perpustakaan kampus."
                      : "Lengkapi informasi untuk menambahkan koleksi baru."}
              </p>
            </div>
            {(page === "dashboard" || page === "katalog") && (
              <a className="btn btn-primary" href="#tambah">
                <Icon name="plus" />
                Tambah buku
              </a>
            )}
          </div>
          {actionError && (
            <div
              className="alert alert-danger d-flex justify-content-between gap-3"
              role="alert"
            >
              {actionError}
              <button
                type="button"
                className="btn-close"
                aria-label="Tutup pesan"
                onClick={() => setActionError("")}
              />
            </div>
          )}
          {notice && (
            <div
              className="alert alert-success d-flex justify-content-between gap-3"
              role="status"
            >
              {notice}
              <button
                type="button"
                className="btn-close"
                aria-label="Tutup pesan"
                onClick={() => setNotice("")}
              />
            </div>
          )}
          {page === "dashboard" && (
            <>
              <section className="welcome-banner">
                <div>
                  <span className="banner-label">
                    KOLEKSI YANG TERUS BERTUMBUH
                  </span>
                  <h2>
                    Pengetahuan tertata.
                    <br />
                    Akses lebih terbuka.
                  </h2>
                  <p>
                    Mulai dari satu buku, bangun perpustakaan
                    <br className="d-none d-md-block" /> yang menginspirasi
                    banyak kepala.
                  </p>
                  <a href="#katalog" className="banner-link">
                    Jelajahi katalog <Icon name="arrow" />
                  </a>
                </div>
                <div className="book-art" aria-hidden="true">
                  <div className="art-orbit" />
                  <div className="art-book book-one">
                    <span>THE ART OF</span>
                    <b>learning.</b>
                    <span>OPEN A NEW CHAPTER</span>
                  </div>
                  <div className="art-book book-two">
                    <span>A WORLD OF</span>
                    <b>ideas.</b>
                    <span>READ · THINK · GROW</span>
                  </div>
                  <div className="art-spark">✳</div>
                </div>
              </section>
              <section
                className="row g-3 stats-row"
                aria-label="Ringkasan koleksi"
              >
                {[
                  {
                    label: "Total koleksi",
                    value: books.length,
                    icon: "book",
                    hint: "Buku dalam katalog",
                    color: "blue",
                  },
                  {
                    label: "Buku tersedia",
                    value: available,
                    icon: "check",
                    hint: "Siap untuk dipinjam",
                    color: "green",
                  },
                  {
                    label: "Sedang dipinjam",
                    value: books.length - available,
                    icon: "clock",
                    hint: "Menunggu kembali",
                    color: "amber",
                  },
                ].map((stat) => (
                  <div className="col-12 col-md-4" key={stat.label}>
                    <div className="stat-panel">
                      <div className="stat-top">
                        <span>{stat.label}</span>
                        <span className={`stat-icon ${stat.color}`}>
                          <Icon name={stat.icon} />
                        </span>
                      </div>
                      <div className="stat-value">
                        {String(stat.value).padStart(2, "0")}
                        <span>buku</span>
                      </div>
                      <p>{stat.hint}</p>
                    </div>
                  </div>
                ))}
              </section>
              <section className="data-panel">
                <div className="section-heading">
                  <div>
                    <h2>Koleksi terbaru</h2>
                    <p>Beberapa buku yang mengisi rak kita.</p>
                  </div>
                  <a href="#katalog" className="text-link">
                    Lihat semua <Icon name="arrow" />
                  </a>
                </div>
                {bookTable(books.slice(-4).reverse())}
              </section>
            </>
          )}
          {page === "katalog" && (
            <section className="data-panel">
              <div className="catalog-tools">
                <div className="search-field">
                  <Icon name="search" />
                  <input
                    className="form-control"
                    type="search"
                    aria-label="Cari judul atau penulis"
                    placeholder="Cari judul atau penulis..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <select
                  className="form-select status-filter"
                  aria-label="Filter status buku"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="all">Semua status</option>
                  <option value="available">Tersedia</option>
                  <option value="borrowed">Dipinjam</option>
                </select>
              </div>
              <div className="result-label" aria-live="polite">
                Menampilkan {filtered.length} dari {books.length} buku
              </div>
              {bookTable(filtered, true)}
            </section>
          )}
          {page === "tambah" && (
            <div className="row g-4">
              <div className="col-lg-8">
                <FormTambahBuku onTambah={addBook} />
              </div>
              <aside className="col-lg-4">
                <div className="form-note">
                  <span className="stat-icon blue">
                    <Icon name="book" />
                  </span>
                  <h2>Koleksi yang rapi dimulai dari data yang lengkap.</h2>
                  <p>
                    Gunakan judul dan nama penulis sesuai sampul buku. Pilih
                    kategori agar koleksi mudah ditemukan.
                  </p>
                  <hr />
                  <strong>Penyimpanan data</strong>
                  <p>
                    Data buku disimpan di database PostgreSQL melalui REST API
                    dan Prisma, sehingga tetap ada setelah halaman dimuat
                    ulang.
                  </p>
                </div>
              </aside>
            </div>
          )}
          {page === "mahasiswa" && <StudentsPage />}
          <footer className="page-footer">
            <span>Pustaka · Perpustakaan kampus</span>
            <span>React / Bootstrap 5</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
export default App;
