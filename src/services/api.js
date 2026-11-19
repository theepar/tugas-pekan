import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

export const studentsApi = {
  list: (signal) =>
    api.get("/students", { signal }).then((response) => response.data),
  create: (student) =>
    api.post("/students", student).then((response) => response.data),
  update: (id, student) =>
    api.put(`/students/${id}`, student).then((response) => response.data),
  remove: (id) => api.delete(`/students/${id}`),
};

export const booksApi = {
  list: (signal) =>
    api.get("/books", { signal }).then((response) => response.data),
  create: (book) => api.post("/books", book).then((response) => response.data),
  update: (id, book) =>
    api.put(`/books/${id}`, book).then((response) => response.data),
  remove: (id) => api.delete(`/books/${id}`),
};

export function apiError(error) {
  if (axios.isCancel(error)) return "";
  const message = error.response?.data?.message;
  if (Array.isArray(message)) return message.join(" ");
  return (
    message ||
    "API belum dapat dihubungi. Pastikan backend dan database berjalan."
  );
}
