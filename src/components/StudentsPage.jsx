import { useEffect, useState } from "react";
import { apiError, studentsApi } from "../services/api";

const emptyForm = {
  nim: "",
  name: "",
  email: "",
  studyProgram: "",
  cohort: "2024",
};

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  async function loadStudents(signal) {
    setLoading(true);
    setError("");
    try {
      setStudents(await studentsApi.list(signal));
    } catch (error) {
      if (!signal?.aborted) setError(apiError(error));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    studentsApi
      .list(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setStudents(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(apiError(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  function change(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const data = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      studyProgram: form.studyProgram.trim(),
      cohort: Number(form.cohort),
    };
    try {
      const result = editingId
        ? await studentsApi.update(editingId, data)
        : await studentsApi.create(data);
      setStudents((current) =>
        editingId
          ? current.map((student) =>
              student.id === editingId ? result : student,
            )
          : [...current, result],
      );
      setNotice(
        editingId
          ? "Data mahasiswa berhasil diperbarui."
          : "Mahasiswa berhasil ditambahkan ke database.",
      );
      resetForm();
      setQuery("");
    } catch (error) {
      setError(apiError(error));
    } finally {
      setSaving(false);
    }
  }

  async function removeStudent(id) {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await studentsApi.remove(id);
      setStudents((current) => current.filter((student) => student.id !== id));
      if (editingId === id) resetForm();
      setDeleteId(null);
      setNotice("Data mahasiswa berhasil dihapus.");
    } catch (error) {
      setError(apiError(error));
    } finally {
      setSaving(false);
    }
  }

  const visible = students.filter((student) =>
    `${student.name} ${student.nim} ${student.studyProgram}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            className="btn btn-outline-danger ms-2"
            onClick={() => loadStudents()}
            disabled={loading || saving}
          >
            Coba lagi
          </button>
        </div>
      )}
      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}
      <div className="row g-4">
        <div className="col-xl-8">
          <section className="data-panel" aria-busy={loading}>
            <div className="section-heading">
              <div>
                <h2>Daftar mahasiswa</h2>
                <p>{students.length} mahasiswa tersimpan di database</p>
              </div>
              <button
                className="btn btn-light"
                onClick={() => loadStudents()}
                disabled={loading || saving}
              >
                Muat ulang
              </button>
            </div>
            <div className="p-3">
              <label className="visually-hidden" htmlFor="student-search">
                Cari mahasiswa
              </label>
              <input
                id="student-search"
                type="search"
                className="form-control"
                placeholder="Cari nama, NIM, atau program studi..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            {loading ? (
              <p className="empty-state" role="status">
                Memuat data mahasiswa...
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <caption className="visually-hidden">
                    Data mahasiswa dari PostgreSQL
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Mahasiswa</th>
                      <th scope="col">Program studi</th>
                      <th scope="col">Angkatan</th>
                      <th scope="col">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="book-cell">
                            <div>
                              <strong>{student.name}</strong>
                              <small>{student.nim}</small>
                              <small>{student.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{student.studyProgram}</td>
                        <td>{student.cohort}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-light btn-sm"
                              disabled={saving}
                              aria-label={`Edit ${student.name}`}
                              onClick={() => {
                                setEditingId(student.id);
                                setForm({
                                  nim: student.nim,
                                  name: student.name,
                                  email: student.email,
                                  studyProgram: student.studyProgram,
                                  cohort: String(student.cohort),
                                });
                                setError("");
                                setNotice("");
                                document.getElementById("student-nim").focus();
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              disabled={saving}
                              aria-label={`Hapus ${student.name}`}
                              onClick={() => setDeleteId(student.id)}
                            >
                              Hapus
                            </button>
                          </div>
                          {deleteId === student.id && (
                            <div className="mt-2">
                              <p className="mb-2">Hapus mahasiswa ini?</p>
                              <button
                                className="btn btn-danger btn-sm me-2"
                                onClick={() => removeStudent(student.id)}
                                disabled={saving}
                              >
                                Ya, hapus
                              </button>
                              <button
                                className="btn btn-light btn-sm"
                                onClick={() => setDeleteId(null)}
                                disabled={saving}
                              >
                                Batal hapus
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!visible.length && (
                  <p className="empty-state">
                    {students.length
                      ? "Mahasiswa tidak ditemukan."
                      : "Belum ada data mahasiswa."}
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
        <div className="col-xl-4">
          <section className="data-panel form-panel">
            <div className="section-heading">
              <div>
                <h2>{editingId ? "Edit mahasiswa" : "Tambah mahasiswa"}</h2>
                <p>Semua kolom wajib diisi.</p>
              </div>
            </div>
            <form onSubmit={submit}>
              <fieldset disabled={saving || loading}>
                <div className="mb-3">
                  <label htmlFor="student-nim" className="form-label">
                    NIM
                  </label>
                  <input
                    id="student-nim"
                    name="nim"
                    className="form-control"
                    value={form.nim}
                    onChange={change}
                    pattern="[0-9]{12}"
                    inputMode="numeric"
                    maxLength={12}
                    title="NIM harus terdiri dari 12 angka"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="student-name" className="form-label">
                    Nama lengkap
                  </label>
                  <input
                    id="student-name"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={change}
                    minLength={2}
                    maxLength={120}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="student-email" className="form-label">
                    Email
                  </label>
                  <input
                    id="student-email"
                    name="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={change}
                    maxLength={150}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="student-program" className="form-label">
                    Program studi
                  </label>
                  <input
                    id="student-program"
                    name="studyProgram"
                    className="form-control"
                    value={form.studyProgram}
                    onChange={change}
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="student-cohort" className="form-label">
                    Angkatan
                  </label>
                  <input
                    id="student-cohort"
                    name="cohort"
                    type="number"
                    className="form-control"
                    value={form.cohort}
                    onChange={change}
                    min={2000}
                    max={2100}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">
                    {saving ? "Menyimpan..." : "Simpan mahasiswa"}
                  </button>
                  {editingId && (
                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={resetForm}
                    >
                      Batal edit
                    </button>
                  )}
                </div>
              </fieldset>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
